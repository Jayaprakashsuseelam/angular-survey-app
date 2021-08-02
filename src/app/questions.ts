import { Question } from './question';

export const myQuestions:Question[] = [
    {
        question: "Please tell us your age?",
        answers: {
          a: "Under 18",
          b: "18 - 30",
          c: "31 - 45",
          d: "45 - 60",
          e: "60+"
        },
        inputType: "radio"
      },
      {
        question: "From the following list, which of these animals is your favourite?",
        answers: {
          a: "Rabbit",
          b: "Cat",
          c: "Dog",
          d: "Goldfish"
        },
        inputType: "checkbox"
      },
      {
        question: "What do you like about this animal?",
        answers: [],
        inputType: "textarea"
      }
];