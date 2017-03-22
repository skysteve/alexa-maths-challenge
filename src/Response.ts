import {AlexaCustomSkillRequest} from '../types/AlexaCustomSkillRequest';
import {AlexaCustomSkillResponse} from '../types/AlexaCustomSkillResponse';

const RESPONSE_VERSION = '1.0';
const SKILL_TITLE = 'Bin Man';

export class Response {
  private callback: Function;
  private request: AlexaCustomSkillRequest;
  private _endSession: boolean;
  private _cardContent: string;
  private _speechText: string;
  private _repomptText: string;
  private attributes: any;

  /**
   * Initialise the responder with a callback to call when done
   * @param callback
   */
  constructor(callback: Function, request: AlexaCustomSkillRequest) {
    this.callback = callback;
    this.request = request;
    this.attributes = request.session.attributes || {};
    this._endSession = true; // by default end the session
  }

  /**
   * Send the response to the user
   * (make sure speech and (optional) card content are set
   */
  public send(): void {
    if (!this._speechText) {
      console.error('no speech text set');
      this.callback('no speech text set');
    }

    // build the response
    const response: AlexaCustomSkillResponse = {
      version: RESPONSE_VERSION,
      sessionAttributes: this.attributes,
      response: {
        outputSpeech: {
          type: 'SSML',
          ssml: `<speak> ${this._speechText} </speak>`
        },
        shouldEndSession: this._endSession
      }
    };

    // if no card content, don't return a card
    if (this._cardContent) {
      response.response.card = {
        type: 'Simple',
          title: SKILL_TITLE,
          content: this._cardContent
      };
    }

    if (this._repomptText) {
      response.response.reprompt = {
        outputSpeech: {
          type: 'SSML',
          ssml: `<speak> ${this._repomptText} </speak>`
        }
      };
    }

    // send the response
    this.callback(null, response);
  }

  /**
   * Log and send unknown request message
   * @param request
  */
  public sendUnknownRequest(): void {
    console.error('Unknown request', JSON.stringify(this.request, null, 2));

    const message = 'Sorry, I failed to understand your request, please try again';
    this.callback(null, {
      version: RESPONSE_VERSION,
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: message
        },
        card: {
          type: 'Simple',
          title: SKILL_TITLE,
          content: message
        },
        shouldEndSession: true
      }
    });
  }

  public addSessionAttributes(attributes: any) {
    Object.assign(this.attributes, attributes);
  }

  public removeSessionAttribute(attribute: string) {
    delete this.attributes[attribute];
  }

  /* getters and setters */

  public set endSession(endSession: boolean) {
    this._endSession = endSession;
  }

  public set cardContent(text: string) {
    this._cardContent = text;
  }

  public set speechText(text: string) {
    this._speechText = text;
  }

  public set repomptText(text: string) {
    this._repomptText = text;
    // if there's reprompt text - we obv don't want to end
    this._endSession = false;
  }
}
