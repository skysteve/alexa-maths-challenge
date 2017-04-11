import {AlexaCustomSkillRequest, SkillRequest, SkillSession} from '../types/AlexaCustomSkillRequest';
import {get as getFromDynamo} from './helpers/dynamoDb';

declare var process;

const DEBUG = process.env.DEBUG === 'true';

export class Request {
  private event: AlexaCustomSkillRequest;

  constructor(event: AlexaCustomSkillRequest) {
    this.event = event;

    if (DEBUG) {
      console.log('INCOMING_REQUEST', JSON.stringify(event, null, 2));
    }
  }

  public get intentName(): string {
    if (this.request.intent) {
      return this.request.intent.name;
    }

    return 'UNKNOWN';
  }

  public get applicationId(): string {
    return this.session.application.applicationId;
  }

  public get userId(): string {
    return this.session.user.userId;
  }

  public get sessionAttributes(): any {
    return this.session.attributes || {};
  }

  public getSessionAttribute(key: string): any {
    return this.sessionAttributes[key];
  }

  public getSlotValue(key: string): any {
    if (!this.request.intent || !this.request.intent.slots) {
      return;
    }

    if (!this.request.intent.slots[key]) {
      return;
    }

    return this.request.intent.slots[key].value;
  }

  public hasSessionAttributes(): boolean {
    return Object.keys(this.sessionAttributes).length > 0;
  }

  public loadDynamoUser(): Promise<any> {
    return getFromDynamo(this.userId);
  }

  public get requestType(): string {
    return this.request.type;
  }

  private get request(): SkillRequest {
    return this.event.request;
  }

  private get session(): SkillSession {
    return this.event.session;
  }
}
