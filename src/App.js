import { useEffect, useState } from "react";
import { getRandomItem } from "./utils";
const url =
  "https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags";

export default function App() {
  const questionArray = [];
  const questionAmount = 10;
  const questionTypeArray = ["flags", "capital"];
  const [questions, setQuestionArray] = useState([]);
  const [restart, setRestart] = useState(false);
  const [queNum, setQueNum] = useState(0);
  const [selectedAnswers, setSelectedAnswer] = useState([]);
  const [score, setScore] = useState(0);
  const currentQue = questions.at(queNum);
  const finishQuiz = selectedAnswers.length === 10;
  useEffect(
    function () {
      async function fetchData() {
        const res = await fetch(url);
        const data = await res.json();

        function getWrongAns(rightAns, wrongAnss) {
          const countryInfo = getRandomItem(data);
          const { name } = countryInfo;
          const wrongAns = `${name.common}`;
          if (wrongAns !== rightAns) {
            wrongAnss.push(wrongAns);
          } else {
            getWrongAns(rightAns, wrongAnss);
          }
        }

        for (let i = 0; i < questionAmount; i++) {
          const queType = getRandomItem(questionTypeArray);
          const countryInfo = getRandomItem(data);
          const { flags, capital, currencies, name } = countryInfo;
          let que = "";
          let rightAns = "";
          let wrongAnss = [];
          const currency = Object.keys(currencies)[0];

          if (queType === "flags") {
            que = `Which country is this flag  <img src =${flags.svg} width="25px" height="auto"/>  belong to?`;
          } else if (queType === "currencies") {
            que = `Which country use this currency "${currencies[currency]?.name}"?`;
          } else {
            que = `Which country is this capital, ${capital.at(0)} located?`;
          }
          rightAns = `${name.common}`;
          for (let i = 0; i < 3; i++) {
            getWrongAns(rightAns, wrongAnss);
          }
          const quiz = {
            id: i,
            question: que,
            answer: [rightAns, ...wrongAnss].sort(),
            rightAnswer: rightAns,
          };
          questionArray.push(quiz);
        }
        console.log(questionArray);
        setQuestionArray(questionArray);
      }
      fetchData();
    },
    [restart]
  );

  function handleSelectQuestion(num) {
    setQueNum(num);
  }

  function handleSelectAnswer(answer, rightAns) {
    if (selectedAnswers.some((item) => item.queID === answer.queID)) return;
    setSelectedAnswer((answerArray) => [...answerArray, answer]);
    if (answer.answer[0] === rightAns) setScore((score) => score + 1);
    console.log();
  }

  function checkAnswer(answer) {
    if (selectedAnswers.some((item) => item.queID === currentQue?.id)) {
      return answer === currentQue?.rightAnswer
        ? "right-answer"
        : "wrong-answer";
    }
  }

  function handlePlayAgain() {
    setQuestionArray([]);
    setQueNum(0);
    setSelectedAnswer([]);
    setScore(0);
    setRestart(!restart);
  }

  return (
    <>
      {finishQuiz ? (
        <div className="congrate">
          <img src="img/congrats.svg" />
          <p className="congrate-text">Congrats! You completed the quiz.</p>
          <p className="score-text">You answer {score}/10 correctly.</p>
          <button onClick={handlePlayAgain} className="play-again-btn">
            Play Again
          </button>
        </div>
      ) : (
        <div className="container">
          <h4>Country Quiz</h4>
          <QuizNumberBox>
            {questions.map((question, index) => (
              <QuizNumber
                key={index}
                num={index}
                queNum={queNum}
                onSelectQuestion={handleSelectQuestion}
                selectedAnswers={selectedAnswers}
              >
                {index + 1}
              </QuizNumber>
            ))}
          </QuizNumberBox>
          <Question question={currentQue} />
          <AnswerBox>
            {currentQue?.answer?.map((answer) => (
              <Answer
                key={answer + Math.random().toFixed(2)}
                answer={answer}
                queID={currentQue?.id}
                onselectAnswer={handleSelectAnswer}
                rightAns={currentQue?.rightAnswer}
                selectedAnswers={selectedAnswers}
                className={checkAnswer}
              >
                {answer}
              </Answer>
            ))}
          </AnswerBox>
        </div>
      )}
    </>
  );
}

function QuizNumberBox({ children }) {
  return <div className="quiz-num-box">{children}</div>;
}

function QuizNumber({
  children,
  num,
  queNum,
  onSelectQuestion,
  selectedAnswers,
}) {
  const finishAnswer = selectedAnswers.some((item) => item.queID === num);
  return (
    <span
      className={num === queNum || finishAnswer ? "active" : ""}
      onClick={() => onSelectQuestion(num)}
    >
      {children}
    </span>
  );
}

function Question({ question }) {
  return <h3 dangerouslySetInnerHTML={{ __html: question?.question }} />;
}

function AnswerBox({ children }) {
  return <div className="answer-box">{children}</div>;
}

function Answer({
  children,
  onselectAnswer,
  answer,
  queID,
  className,
  selectedAnswers,
  rightAns,
}) {
  const selectedAnswer = { queID, answer: [answer, rightAns] };
  const isHover = selectedAnswers.some((item) => item.queID === queID);
  const changeColor = selectedAnswers.some(
    (item) => item.answer[0] === answer && item.queID === queID
  );
  return (
    <button
      onClick={() => onselectAnswer(selectedAnswer, rightAns)}
      className={
        selectedAnswers.some(
          (item) => item.answer.includes(answer) && item.queID === queID
        )
          ? `${className(answer)} ${changeColor ? "active" : ""}`
          : ""
      }
      style={isHover ? { cursor: "none" } : { cursor: "pointer" }}
    >
      {children}
    </button>
  );
}
