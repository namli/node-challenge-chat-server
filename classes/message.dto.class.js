const shortid = require('shortid');
class Message {

  constructor(reqBody) {
    this.state = 1;
    this.validatedMessage = this.validateObj(reqBody);
    if (this.state == 1) {
      this.validatedMessage.id = shortid.generate();
      this.validatedMessage.timeSent = new Date();
    }

  }

  validateObj(obj) {
    try {
      if (!obj.hasOwnProperty('from')) {
        throw ('YOu mast have a Name');
      }

      if (obj.from.length <= 0 || obj.from == '') {
        throw ('Name mast be long!');
      }

      if (!obj.hasOwnProperty('text')) {
        throw ('YOu mast provide a message');
      }

      if (obj.text.length <= 3 || obj.from == '') {
        throw ('Message mast be longer than 3 ');
      }

      return obj;

    } catch (error) {

      console.log(error);
      this.error = error;
      this.state = 0;

    }


  }

  getMessage() {
    if (this.state == 1) {
      return this.validatedMessage;
    }
  }


}

module.exports = Message;