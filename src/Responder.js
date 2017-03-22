/**
 * Created by steve on 13/03/2017.
 */
module.exports = class Responder {

  constructor(callback) {
    this.callback = callback;
  }

  errorHandler(err) {
    console.log(err);
    this.callback(err);
  }

  get cardTitle() {
    return 'Monzo';
  }

  get version() {
    return version.substring(0, version.lastIndexOf('.'));
  }

  set card(content) {
    this.crd = {
      type: 'Simple',
      title: this.cardTitle,
      content: content
    };
  }

  set reprompt(text) {
    this.reprom = {
      outputSpeech: {
        type: 'PlainText',
        text: text
      }
    };
  }

  set responseText(text) {
    this.respText = text;
  }

  respond(shouldEnd) {
    if (shouldEnd === undefined) {
      shouldEnd = true;
    }
    this.callback(null, {
      version: this.version,
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: this.respText
        },
        card: this.crd,
        reprompt: this.reprom,
        shouldEndSession: shouldEnd
      }
    });
  }
};
