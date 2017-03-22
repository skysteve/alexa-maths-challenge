/**
 * Created by steve on 13/03/2017.
 */
const Responder = require('./src/Responder');


module.exports = function handler(event, context, callback) {
  try {
    // validate alexa skill id
    if (event.session.application.applicationId !== 'ALEXA_SKILL_ID') {
      return callback('Invalid Application ID');
    }

    const responder = new Responder(callback);

    switch (event.request.type) {
      case 'LaunchRequest':
        const question = 'What is 3 + 4 + 4';
        responder.setResponseText(question);
        responder.respond(false);
        break;
      case 'IntentRequest':
        const intentHandler = new IntentHandler(event.request, event.session, responder);
        intentHandler.handleIntent(event.request.intent.name);
        break;
      case 'SessionEndedRequest':
        callback();
        break;
      default:
        return responder.errorHandler(`Unknown request type ${event.request.type}`);
    }
  } catch (err) {
    console.log(err);
    callback(err);
  }
};
