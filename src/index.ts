import {AlexaCustomSkillRequest} from '../types/AlexaCustomSkillRequest';
import * as intents from './handlers/intents';
import {helpMessage, welcomeMessage, stopRequest} from './handlers/defaults';
import {Request} from './Request';
import {Response} from './Response';

declare var process;

export function handler(event: AlexaCustomSkillRequest, context: any, callback: Function): any {
  try {
    const request = new Request(event);

    if (request.applicationId !== process.env.ALEXA_SKILL_ID) {
      callback('Invalid Application ID');
    }

    const response = new Response(callback, event);

    // handle request type
    switch (request.requestType) {
      case 'LaunchRequest':
        return welcomeMessage(response);
      case 'IntentRequest':
        break;
      case 'SessionEndedRequest':
        if (request.requestReason === 'USER_INITIATED') {
          return stopRequest(request, response);
        } else if ('EXCEEDED_MAX_REPROMPTS') {
          // just repeat it again
          return intents.repeat(request, response);
        } else {
          console.error('SessionEndedRequest ERROR', JSON.stringify(event, null, 2));
          response.speechText = 'Sorry an error occurred';
          response.endSession = true;
          return response.send();
        }
      default:
        return response.sendUnknownRequest();
    }

    // handle intents
    switch (request.intentName) {
      case 'AMAZON.HelpIntent':
        return helpMessage(response);
      case 'HandleAnswer':
        return intents.handleAnswer(request, response);
      case 'DontKnowIntent':
            intents.dontKnowIntent(request, response);
      case 'AMAZON.StopIntent':
      case 'AMAZON.CancelIntent':
        return stopRequest(request, response);
      case 'AMAZON.RepeatIntent':
        return intents.repeat(request, response);
      default:
        return response.sendUnknownRequest();
    }
  } catch (err) {
    console.log(err);
    callback(err);
  }
}
