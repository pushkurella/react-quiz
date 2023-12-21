import { useContext } from "react";
import Answer from "./Answer";
import { QuizContext } from "../contexts/quiz";


const Question = () => {
    const [quizState, dispatch] = useContext(QuizContext);
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    return (
        <div>
            <div className="question">{currentQuestion && currentQuestion.question}</div>
            <div className="answers">
                {quizState.answers.map((answer, index) => (
                    <Answer answerText={answer}
                        correctAnswer={currentQuestion.correctAnswer}
                        currentAnswer={quizState.currentAnswer}
                        key={index} index={index}
                        onSelectAnswer={(answerText) => dispatch({ type: 'SELECT_ANSWER', payload: answerText })} />
                ))}
            </div>
        </div>
    );
}

export default Question;
