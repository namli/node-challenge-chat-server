const express = require("express");
const cors = require("cors");
const app = express();
const low = require('lowdb');
const bodyParser = require("body-parser");
const shortid = require('shortid');
app.use(bodyParser.json());
app.use(cors());
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const MessageProcess = require('./classes/message.dto.class');

db._.mixin({
  searchText: function (array, text) {
    return array.filter(function (item) {
      if (item.text.includes(text.text)) {
        return true;
      }
    });
  }
});



const welcomeMessage = {
  id: shortid.generate(),
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

db.defaults({ mssg: [welcomeMessage], users: [], })
  .write();

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server. 
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});


app.get("/mssg", function (req, res) {
  res.send(db.get('mssg')
    .value());
});

app.get("/mssg/search", function (req, res) {
  res.send(db.get('mssg')
    .searchText({ text: req.query.text })
    .value());
});

app.get("/mssg/latest", function (req, res) {
  res.send(db.get('mssg')
    .take(10)
    .value());
});

app.get("/mssg/:id", function (req, res) {
  res.send(db.get('mssg')
    .find({ id: req.params.id })
    .value());
});

app.post("/mssg", function (req, res) {
  let mssg = new MessageProcess(req.body);

  if (mssg.state == 1) {
    res.send(db.get('mssg')
      .push(mssg.getMessage())
      .write());
  }

  if (mssg.state == 0) {
    res.status(400).send(mssg.error);
  }
});

app.delete("/mssg/:id", function (req, res) {
  res.send(db.get('mssg')
    .remove({ id: req.params.id })
    .write());
});

app.put("/mssg/:id", function (req, res) {
  let mssg = new MessageProcess(req.body);

  if (mssg.state == 1) {
    res.send(
      db.get('mssg')
        .find({ id: req.params.id })
        .assign(mssg.getMessage())
        .write()
    );
  }

  if (mssg.state == 0) {
    res.status(400).send(mssg.error);
  }

});


//app.listen(process.env.PORT); 

//Start our server so that it listens for HTTP requests!
app.listen(3000, function () {
  console.log("info", 'Server is running at port : ' + 3000);
});
