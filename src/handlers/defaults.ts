import {Response} from '../Response';

export function welcomeMessage(response: Response): void {
  response.speechText = 'Welcome to the maths challenge. How many questions would you like?';
  response.repomptText = 'How many questions would you like?';
  response.addSessionAttributes({requestedQuestionCount: true});
  response.send();
}
