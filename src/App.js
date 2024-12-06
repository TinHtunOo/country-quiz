import { useEffect, useState } from "react";
import { getRandomItem } from "./utils";
const url =
  "https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags";

export default function App() {
  const questionArray = [];
  const questionAmount = 10;
  const questionTypeArray = ["flags", "currencies", "capital"];
  const [questions, setQuestionArray] = useState([]);
  const [queNum, setQueNum] = useState(0);
  const [finishQue, setFinishQue] = useState([]);

  useEffect(function () {
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
          question: que,
          answer: [rightAns, ...wrongAnss].sort(),
          rightAnswer: rightAns,
        };
        questionArray.push(quiz);
      }
      console.log(questionArray);
      console.log("render");
      setQuestionArray(questionArray);
    }
    fetchData();
  }, []);

  function handleSelectQuestion(num) {
    setQueNum(num);
  }

  function handleFinishQue(num) {
    setFinishQue((que) => [num, ...que]);
  }

  return (
    <div className="container">
      <h4>Country Quiz</h4>
      <QuizNumberBox>
        {questions.map((question, index) => (
          <QuizNumber
            key={index}
            num={index}
            queNum={queNum}
            onSelectQuestion={handleSelectQuestion}
            finishQue={finishQue}
          >
            {index + 1}
          </QuizNumber>
        ))}
      </QuizNumberBox>
      <Question question={questions.at(queNum)} />
      <AnswerBox>
        {questions.at(queNum)?.answer?.map((answer) => (
          <Answer key={answer} onFinishQue={handleFinishQue}>
            {answer}
          </Answer>
        ))}
      </AnswerBox>
    </div>
  );
}

function QuizNumberBox({ children }) {
  return <div className="quiz-num-box">{children}</div>;
}

function QuizNumber({ children, num, queNum, onSelectQuestion, finishQue }) {
  return (
    <span
      className={num === queNum || finishQue.includes(num) ? "active" : ""}
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

function Answer({ children, onFinishQue, num }) {
  const [selected, setSelected] = useState(false);
  // function onSelect() {
  //   setSelected(true);
  // }
  return (
    <span onClick={onFinishQue} className={selected ? "active" : ""}>
      {children}
    </span>
  );
}
