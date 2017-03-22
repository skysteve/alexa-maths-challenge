import {Request} from '../Request';
import {Response} from '../Response';
import {getQuestion} from '../helpers/questionGenerator';

export function handleAnswer(request: Request, response: Response): void {
  const answer = request.getSlotValue('Answer');

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

    response.addSessionAttributes({
      totalQuestions: answer,
      currentQuestion: 1,
      totalCorrect: 0,
      question
    });

    response.speechText = `Okay ${answer} questions coming up! Question one, What is ${question.question}?`;
    response.repomptText = `What is ${question.question}?`;
    response.send();
    return;
  }

  let currentQuestion = request.getSessionAttribute('currentQuestion');
  let totalCorrect = request.getSessionAttribute('totalCorrect');
  const totalQuestions = request.getSessionAttribute('currentQuestion');
  const askedQuestion = request.getSessionAttribute('question');
  const bCorrect = (answer === askedQuestion.answer);
  let answerFeedback;

  // check if the answer was correct
  if (bCorrect) {
    totalCorrect += 1;
    answerFeedback = `Correct! ${askedQuestion.question} equals ${answer}`;
  } else {
    answerFeedback = `That answer is wrong, ${askedQuestion.question} equals ${answer}`;
  }

  // if the user has had the requested number of questions - we're done!
  if (currentQuestion >= totalQuestions) {
    response.speechText = `${answerFeedback}. Thank you for playing, you got ${totalCorrect} of ${totalQuestions} correct`;
    response.endSession = true;
    return response.send();
  }

  // increment question counter
  currentQuestion += 1;

  // get the next question
  const question = getQuestion();

  // store values
  response.addSessionAttributes({
    currentQuestion,
    totalCorrect: 0,
    question
  });

  response.speechText = `${answerFeedback}. Question ${currentQuestion}, What is ${question.question}?`;
  response.repomptText = `What is ${question.question}?`;
  response.send();
  return;
}
