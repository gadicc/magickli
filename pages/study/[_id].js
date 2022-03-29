import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { supermemo } from "supermemo";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

import Link from "../../src/Link.js";
import AppBar from "../../components/AppBar.js";

import getSet from "../../src/study/sets.js";
import db from "../../src/db.js";

export async function getServerSideProps(context) {
  const { _id } = context.query;
  return { props: { _id } };
}

function randomCard(set, prevCard) {
  const newCard = set[Math.floor(Math.random() * set.length)];
  return newCard === prevCard ? randomCard(set, prevCard) : newCard;
}

const StudySetCol = db.collection("studySet");

function updateCardSet(set, cardId, { wrongCount, startTime }) {
  const cardSet = StudySetCol.findOne({ setId: set.id }) || {
    // userId:
    setId: set.id,
    cards: null,
    correct: 0,
    incorrect: 0,
    time: 0,
    dueDate: new Date(),
  };

  if (!cardSet.cards) {
    cardSet.cards = {};
    for (let cardId of Object.keys(set.data))
      cardSet.cards[cardId] = {
        correct: 0,
        incorrect: 0,
        time: 0,
        dueDate: new Date(),
        supermemo: {
          interval: 0,
          repetition: 0,
          efactor: 2.5,
        },
      };
  }

  const card = cardSet.cards[cardId];
  // console.log({ cardSet, card });

  const elapsed = Date.now() - startTime;
  card.time += elapsed;
  cardSet.time += elapsed;

  let grade;
  if (wrongCount === 0) {
    card.correct++;
    cardSet.correct++;
    if (elapsed < 3000) grade = 5;
    else if (elapsed < 5000) grade = 4;
    else grade = 3;
  } else {
    card.incorrect++;
    cardSet.incorrect++;
    if (elapsed < 3000) grade = 2;
    else if (elapsed < 8000) grade = 1;
    else grade = 0;
  }

  // console.log({ wrongCount, startTime, elapsed, grade });

  card.supermemo = supermemo(card.supermemo, grade);

  const dayInMs = 86400000;
  const oldDueDate = card.dueDate.getTime();
  card.dueDate = new Date(oldDueDate + card.supermemo.interval * dayInMs);

  let earliestDueDate = card.dueDate;
  for (let card2 of Object.values(cardSet.cards))
    if (card2.dueDate < earliestDueDate) earliestDueDate = card2.dueDate;

  //if (cardSet.dueDate.getTime() === oldDueDate) cardSet.dueDate = card.dueDate;

  if (cardSet._id) StudySetCol.update(cardSet._id, { $set: cardSet });
  else StudySetCol.insert(cardSet);
}

function StudySet() {
  const router = useRouter();
  const _id = router.query._id;

  const set = React.useMemo(() => getSet(_id), [_id]);
  const cards = React.useMemo(() => set.generateCards(), [set]);
  const [card, setCard] = React.useState(randomCard(cards));
  const [correct, setCorrect] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [wrong, setWrong] = React.useState(null);
  const [wrongCount, setWrongCount] = React.useState(0);
  const [startTime, setStartTime] = React.useState(Date.now());
  const Question = set.Question;
  // console.log({ set, cards, card });

  function clicked(answer) {
    if (answer === card.answer) {
      setWrong("noMatch"); // to show answer in green
      setWrongCount(0);
      setTimeout(() => {
        setWrong(null);
        setCard(randomCard(cards, card));
        if (!wrong) setCorrect(correct + 1);
        setTotal(total + 1);
        setStartTime(Date.now());
      }, 200);
      updateCardSet(set, card.id, { wrongCount, startTime });
    } else {
      setWrong(answer);
      setWrongCount(wrongCount + 1);
    }
  }

  const navParts = [{ title: "Study", url: "/study" }];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <AppBar title={_id} navParts={navParts} />
      <Box sx={{ p: 2 }}>
        <div style={{ textAlign: "right" }}>
          {total === 0 ? "Go!" : `${correct} / ${total}`}
        </div>

        <Question question={card.question} />
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            {card.answers.map((answer) => (
              <Grid key={answer} item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  style={{
                    color: wrong && answer === card.answer && "white",
                    background: wrong
                      ? answer === wrong
                        ? "red"
                        : answer === card.answer
                        ? "green"
                        : "transparent"
                      : "transparent",
                  }}
                  onClick={clicked.bind(this, answer)}
                >
                  {answer}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default dynamic(Promise.resolve(StudySet), { ssr: false });
