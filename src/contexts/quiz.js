import { createContext, useReducer } from "react";

const shuffleAnswers = (question) => {
  const allAns = [...question.incorrectAnswers, question.correctAnswer];
  const shuffledAnswers = allAns
    .map((value) => ({
      sort: Math.random(),
      value,
    }))
    .sort((a, b) => a.sort - b.sort)
    .map((val) => val.value);
  return shuffledAnswers;
};

const normalizeQuestions = (backendQuestions) => {
  return backendQuestions.map((backendQuestion) => {
    const incorrectAnswers = backendQuestion.incorrect_answers.map(
      (incorrectAnswer) => decodeURIComponent(incorrectAnswer)
    );
    return {
      correctAnswer: decodeURIComponent(backendQuestion.correct_answer),
      question: decodeURIComponent(backendQuestion.question),
      incorrectAnswers,
    };
  });
};

export const initialState = {
  currentQuestionIndex: 0,
  questions: [],
  showResults: false,
  answers: [],
  currentAnswer: "",
  correctAnswersCount: 0,
};
export const reducer = (state, action) => {
  switch (action.type) {
    case "NEXT_QUESTION": {
      const currentQuestionIndex = state.currentQuestionIndex + 1;
      const showResults =
        state.questions.length === state.currentQuestionIndex + 1;
      const answers = state.showResults
        ? []
        : shuffleAnswers(
            state.questions[
              showResults ? currentQuestionIndex - 1 : currentQuestionIndex
            ]
          );
      return {
        ...state,
        currentQuestionIndex,
        showResults,
        answers,
        currentAnswer: "",
      };
    }
    case "RESTART": {
      return initialState;
    }
    case "SELECT_ANSWER": {
      const correctAnswerCount =
        action.payload ===
        state.questions[state.currentQuestionIndex].correctAnswer
          ? state.correctAnswersCount + 1
          : state.correctAnswersCount;
      return {
        ...state,
        currentAnswer: action.payload,
        correctAnswersCount: correctAnswerCount,
      };
    }
    case "LOADED_QUESTIONS": {
      const normalizedQuestions = normalizeQuestions(action.payload);
      return {
        ...state,
        questions: normalizedQuestions,
        answers: shuffleAnswers(normalizedQuestions[0]),
      };
    }
    default:
      return state;
  }
};

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const value = useReducer(reducer, initialState);
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
