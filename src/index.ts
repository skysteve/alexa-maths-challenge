import {AlexaCustomSkillRequest} from '../types/AlexaCustomSkillRequest';
import * as intents from './handlers/intents';
import {welcomeMessage} from './handlers/defaults';
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
      default:
        return response.sendUnknownRequest();
    }

    // handle intents
    switch (request.intentName) {
      case 'HandleAnswer':
        return intents.handleAnswer(request, response);
      default:
        return response.sendUnknownRequest();
    }
  } catch (err) {
    console.log(err);
    callback(err);
  }
}
