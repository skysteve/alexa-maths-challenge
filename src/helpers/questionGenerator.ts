/*
TODO - implement difficulty level
easy: only addition and subtraction
medium: also multiplication
hard: as with medium but longer
very hard: as with hard but with division
 */

/**
 * Get a random int between in and max
 * @param min {number}
 * @param max {number}
 * @returns {number}
 */
function random(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Get a question
 * @returns {{answer: number, question: *}}
 */
export function getQuestion(): {answer: number, question: string} {
  // length of question should be between 3-6 items long (this may become an option in dynamo at some point, maybe difficulty level)
  const length = random(2, 4);

  // get the initial value
  let answer = random(1, 10);
  let question = `${answer}`;

  for (let i = 0; i < length; i++) {
    const value = random(1, 10);

    switch (random(1, 6)) { // TODO 6 should be 9
      case 1:
      case 2:
      case 3:
        answer += value;
        question += ` plus ${value}.`;
        break;
      case 4:
      case 5:
      case 6:
        answer -= value;
        question += ` minus ${value}.`;
        break;
      case 7:
      case 8:
      case 9:
        answer *= value;
        question += ` multiplied by ${value}.`;
        break;
      default:
        // should never happen
        break;
    }
  }

  return {
    answer,
    question: question.substring(0, question.length - 1) // strip off the final . because we get a ?
  };
}

/**
 * Get a message for the user once they've finished with a congratulations message (if earned)
 * @param totalQuestions
 * @param questionsCorrect
 * @returns {string}
 */
export function getCongratulationsMessage(totalQuestions: number, questionsCorrect: number) {
  const percentage = (questionsCorrect/totalQuestions) * 100;

  if (percentage === 100) {
    return 'A perfect score!';
  }

  if (percentage >= 75) {
    return 'Excellent work!';
  }

  if (percentage >= 50) {
    return 'Well done!';
  }

  // user got less than 50% right - boo
  return 'Better luck next time';
}
