import { useEffect, useState } from "react";
import { getRandomItem } from "./utils";

const url =
  "https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags,region";
export function useGetQuestion(
  questionAmount = 10,
  questionTypeArray = ["flags", "currencies", "capital"]
) {
  const questionArray = [];

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
          que = `Which country is this flag ${flags.svg} belong to?`;
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
    }
    fetchData();
  }, []);

  return questionArray;
}
