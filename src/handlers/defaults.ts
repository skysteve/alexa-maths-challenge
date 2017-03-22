import {Request} from '../Request';
import {Response} from '../Response';

export function welcomeMessage(response: Response): void {
  response.speechText = 'Welcome to the maths challenge. How many questions would you like?';
  response.repomptText = 'How many questions would you like?';
  response.addSessionAttributes({requestedQuestionCount: true});
  response.send();
}

export function stopRequest(request: Request, response: Response): void {
  const currentQuestion = request.getSessionAttribute('currentQuestion');
  const totalCorrect = request.getSessionAttribute('totalCorrect');

  // if user has asked questions - give them their current score, otherwise just say thanks
  if (!currentQuestion) {
    response.speechText = 'Thank you for playing';
  } else {
    response.speechText = `Thank you for playing, you got ${totalCorrect} out of ${currentQuestion}.`;
  }

  return response.send();
}
