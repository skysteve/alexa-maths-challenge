import {Request} from '../Request';
import {Response} from '../Response';
import {getQuestion, getCongratulationsMessage} from '../helpers/questionGenerator';
import {welcomeMessage} from './defaults';

export function handleAnswer(request: Request, response: Response): void {
  const answer = Number(request.getSlotValue('Answer'));
  const requestedCount = request.getSessionAttribute('requestedQuestionCount');
  let currentQuestionNumber = request.getSessionAttribute('currentQuestionNumber');

  // if we haven't requested anything and there's no current question return out
  if (!requestedCount && !currentQuestionNumber) {
    response.speechText = 'Sorry I didn\'t understand that, please try saying "Alexa open maths challenge"';
    return response.send();
  }

  // if answer isn't a number - error
  if (isNaN(answer)) {
    response.speechText = 'Sorry I didn\'t understand that, your answer must be a number';
    response.endSession = false;
    return response.send();
  }

  // if user has been asked how many questions they want, generate questions and serve them up
  if (request.getSessionAttribute('requestedQuestionCount')) {
    response.removeSessionAttribute('requestedQuestionCount');

    // validate number of answers requested
    if (answer < 1 || answer > 10) {
      response.speechText = 'You must choose a number of questions between 1 and 10. How many questions would you like?';
      response.repomptText = 'How many questions would you like?';
      return response.send();
    }

    const question = getQuestion();
    const questionText = answer === 1 ? 'question': 'questions';

    currentQuestionNumber = 1;

    response.addSessionAttributes({
      totalQuestions: answer,
      currentQuestionNumber,
      totalCorrect: 0,
      question
    });

    response.speechText = `Okay! ${answer} ${questionText} coming up! Question one, What is ${question.question}?`;
    response.repomptText = `What is ${question.question}?`;
    response.send();
    return;
  }

  let totalCorrect = request.getSessionAttribute('totalCorrect');
  const totalQuestions = request.getSessionAttribute('totalQuestions');
  const askedQuestion = request.getSessionAttribute('question');
  const bCorrect = (answer === askedQuestion.answer);
  let answerFeedback;

  // check if the answer was correct
  if (bCorrect) {
    totalCorrect += 1;
    answerFeedback = 'Correct!';
  } else {
    answerFeedback = `That answer is wrong, ${askedQuestion.explanation}`;
  }

  // if the user has had the requested number of questions - we're done!
  if (currentQuestionNumber >= totalQuestions) {
    response.speechText = `${answerFeedback}. Thank you for playing, you got ${totalCorrect} out of ${totalQuestions} questions correct. ${getCongratulationsMessage(totalQuestions, totalCorrect)}`;
    response.endSession = true;
    return response.send();
  }

  // increment question counter
  currentQuestionNumber += 1;

  // get the next question
  const question = getQuestion();

  // store values
  response.addSessionAttributes({
    currentQuestionNumber,
    totalCorrect,
    question
  });

  response.speechText = `${answerFeedback}. Question ${currentQuestionNumber}, What is ${question.question}?`;
  response.repomptText = `What is ${question.question}?`;
  response.send();
  return;
}

export function dontKnowIntent(request: Request, response: Response) {
  const totalCorrect = request.getSessionAttribute('totalCorrect');
  const totalQuestions = request.getSessionAttribute('totalQuestions');
  const askedQuestion = request.getSessionAttribute('question');
  let currentQuestionNumber = request.getSessionAttribute('currentQuestionNumber');

  if (!askedQuestion) {
    response.speechText = 'Sorry I didn\'t understand that, your answer must be a number';
    response.endSession = false;
    return response.send();
  }

  const answerFeedback = askedQuestion.explanation;

  // if the user has had the requested number of questions - we're done!
  if (currentQuestionNumber >= totalQuestions) {
    response.speechText = `${answerFeedback}. Thank you for playing, you got ${totalCorrect} out of ${totalQuestions} questions correct. ${getCongratulationsMessage(totalQuestions, totalCorrect)}`;
    response.endSession = true;
    return response.send();
  }

  // increment question counter
  currentQuestionNumber += 1;

  // get the next question
  const question = getQuestion();

  // store values
  response.addSessionAttributes({
    currentQuestionNumber,
    totalCorrect,
    question
  });

  response.speechText = `${answerFeedback}. Question ${currentQuestionNumber}, What is ${question.question}?`;
  response.repomptText = `What is ${question.question}?`;
  response.send();
  return;
}

export function repeat(request: Request, response: Response) {
  if (request.getSessionAttribute('requestedQuestionCount')) {
    return welcomeMessage(response);
  }

  const askedQuestion = request.getSessionAttribute('question');

  response.speechText = `What is ${askedQuestion.question}?`;
  response.repomptText = `What is ${askedQuestion.question}?`;
  response.send();
}
