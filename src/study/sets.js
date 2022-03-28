import React from "react";
import Paper from "@mui/material/Paper";

import data from "../../data/data.js";

function SingleCharQuestion({ question }) {
  return (
    <Paper sx={{ my: 2, p: 2, fontSize: "500%", textAlign: "center" }}>
      {question}
    </Paper>
  );
}

// TODO, rather just pull out X shuffled items.
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

function generateCards() {
  const { data, question, answer } = this;
  const array = Object.values(data);

  shuffle(array);
  return array.map((item) => {
    const otherItems = array.filter((oItem) => oItem !== item);
    shuffle(otherItems);
    const answers = otherItems.slice(0, 3).concat([item]).map(answer);
    shuffle(answers);
    return {
      set: name,
      id: item.id,
      question: question(item),
      answer: answer(item),
      answers,
    };
  });
}

const sets = {
  _default: {
    Question: SingleCharQuestion,
    generateCards,
  },
  "zodiac-signs": {
    data: data.zodiac,
    question: (item) => item.symbol,
    answer: (item) => item.name.en,
    Question: SingleCharQuestion,
  },
};

function getSet(id) {
  if (!sets[id]) throw new Error("No such set");

  const set = {
    ...sets._default,
    ...sets[id],
  };

  set.generateCards.bind(set);

  // TODO, itereate through values, do string substuttion
  // e.g. "item => item.name.en" becomes (item) => item.name.en;

  return set;
}

export default getSet;
