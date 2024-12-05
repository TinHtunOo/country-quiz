import { useEffect, useState } from "react";
import { useGetQuestion } from "./useGetQuestion";

export default function App() {
  console.log(useGetQuestion());
  return (
    <div className="container">
      <h4>Country Quiz</h4>
      <QuizNumberBox />
      <Question />
      <AnswerBox />
    </div>
  );
}

function QuizNumberBox() {
  return (
    <div className="quiz-num-box">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
        <QuizNumber key={num}>{num}</QuizNumber>
      ))}
    </div>
  );
}

function QuizNumber({ children }) {
  return <span>{children}</span>;
}

function Question() {
  return (
    <h3>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    </h3>
  );
}

function AnswerBox() {
  return (
    <div className="answer-box">
      {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
        <Answer key={num}></Answer>
      ))}
    </div>
  );
}

function Answer() {
  return <span>Helooooo</span>;
}
