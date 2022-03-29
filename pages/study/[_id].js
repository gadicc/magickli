import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

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

function StudySet() {
  const router = useRouter();
  const _id = router.query._id;

  const set = React.useMemo(() => getSet(_id), [_id]);
  const cards = React.useMemo(() => set.generateCards(), [set]);
  const [card, setCard] = React.useState(randomCard(cards));
  const [correct, setCorrect] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [wrong, setWrong] = React.useState(null);
  const Question = set.Question;
  // console.log({ set, cards, card });

  function clicked(answer) {
    if (answer === card.answer) {
      setWrong("noMatch"); // to show answer in green
      setTimeout(() => {
        setWrong(null);
        setCard(randomCard(cards, card));
        if (!wrong) setCorrect(correct + 1);
        setTotal(total + 1);
      }, 200);
    } else {
      setWrong(answer);
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
