import { QuizContext } from "../contexts/quiz";
import Question from "./Question";
import { useContext, useEffect } from "react";

const Quiz = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  let flagged = false;
  const apiUrl =
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple&encode=url3986";
  useEffect(() => {
    console.log(quizState, "length", flagged);
    if (quizState.questions.length > 0 || flagged === true) {
      return;
    }
    flagged = true;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const { response_code, results } = data;
        console.log(data.results, response_code);
        if (response_code !== 1) {
          dispatch({ type: "LOADED_QUESTIONS", payload: results });
        }
      })
      .catch((error) => {
        console.log("its error", error);
      });
  }, []);

  return (
    <div className="quiz">
      {quizState.showResults && (
        <div className="results">
          <div className="congratulations">Congratulations</div>
          <div className="results-info">
            <div>You have completed the quiz</div>
            <div>
              You've got {quizState.correctAnswersCount} of{" "}
              {quizState.questions.length}
            </div>
          </div>
          <div
            className="next-button"
            onClick={() => dispatch({ type: "RESTART" })}
          >
            Restart
          </div>
        </div>
      )}
      {!quizState.showResults && (
        <div>
          <div className="score">
            Question {quizState.currentQuestionIndex + 1}/{" "}
            {quizState.questions.length}
          </div>
          <Question />
          <div
            className="next-button"
            onClick={() => dispatch({ type: "NEXT_QUESTION" })}
          >
            Next question
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
