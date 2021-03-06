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
export function getQuestion(): {answer: number, question: string, explanation: string} {
  // length of question should be between 3-6 items long (this may become an option in dynamo at some point, maybe difficulty level)
  const length = random(3, 6);
  const min = 1;
  const max = 10;
  const multiplyMax = 5;

  // get the initial value
  let answer = random(min, max * 2.5); // greater starting value
  let question = `${answer}`;
  let explanation = `${question}`;

  for (let i = 0; i < length; i++) {
    let value = random(min, max);

    switch (random(1, 6)) { // Note - no multiply atm
      case 1:
      case 2:
      case 3:
        answer += value;
        question += ` plus ${value},`;
        explanation += ` plus ${value}, is ${answer}.`;
        break;
      case 4:
      case 5:
      case 6:
        answer -= value;

        let safety = 0;

        // can't have negative numbers
        while (answer < 0) {
          // add the number back on
          answer += value;

          // get a new random number
          value = random(min, max);
          answer -= value;

          // stop ourselves going into infinite loop
          safety += 1;

          // this shouldn't happen, but just in case
          if (safety >= 10 && answer < 0) {
            answer += value;
            value = 0;
            break;
          }
        }

        question += ` minus ${value}. .`;
        explanation += ` minus ${value}, is ${answer}.`;
        break;
      case 7:
      case 8:
      case 9:
        value = random(1, multiplyMax);
        answer *= value;
        question += ` multiplied by ${value}.`;
        explanation += ` multiplied by ${value}, is ${answer}.`;
        break;
      default:
        // should never happen
        break;
    }
  }

  return {
    answer,
    explanation,
    question: question.substring(0, question.length - 1) // strip off the final , because we get a ?
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
