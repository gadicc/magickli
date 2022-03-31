import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { supermemo } from "supermemo";
import {
  useGongoOne,
  useGongoIsPopulated,
  useGongoSub,
} from "gongo-client-react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

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

function NewStudyData(set) {
  const userId = db.auth.getUserId();

  const newStudyData = {
    setId: set.id,
    cards: {},
    correct: 0,
    incorrect: 0,
    time: 0,
    dueDate: new Date(),
  };

  if (userId) {
    newStudyData.userId = userId;
    newStudyData.__ObjectIDs = ["userId"];
  }

  for (let cardId of Object.keys(set.data)) {
    newStudyData.cards[cardId] = {
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

  // console.log({ newStudyData });
  return newStudyData;
}

function updateCardSet(set, cardId, _studyData, { wrongCount, startTime }) {
  const card = { ..._studyData.cards[cardId] };
  const studyData = {
    correct: _studyData.correct,
    incorrect: _studyData.incorrect,
    time: _studyData.time,
    ["cards." + cardId]: card,
  };

  // console.log({ cardSet, card });

  const elapsed = Date.now() - startTime;
  card.time += elapsed;
  studyData.time += elapsed;

  let grade;
  if (wrongCount === 0) {
    card.correct++;
    studyData.correct++;
    if (elapsed < 3000) grade = 5;
    else if (elapsed < 5000) grade = 4;
    else grade = 3;
  } else {
    card.incorrect++;
    studyData.incorrect++;
    if (elapsed < 3000) grade = 2;
    else if (elapsed < 8000) grade = 1;
    else grade = 0;
  }

  // console.log({ wrongCount, startTime, elapsed, grade });

  card.supermemo = supermemo(card.supermemo, grade);

  const dayInMs = 86400000;
  //const oldDueDate = card.dueDate.getTime();
  card.dueDate = new Date(Date.now() + card.supermemo.interval * dayInMs);

  let earliestDueDate = card.dueDate;
  for (let card2 of Object.values(_studyData.cards))
    if (card2.dueDate < earliestDueDate) earliestDueDate = card2.dueDate;
  studyData.dueDate = earliestDueDate;

  //if (studyData.dueDate.getTime() === oldDueDate) studyData.dueDate = card.dueDate;

  // If we weren't logged in before, but are now, take this opportunity to
  // populate userId.  TODO: probably a better place to do this.
  const userId = db.auth.getUserId();
  if (userId && !_studyData.userId) {
    studyData.userId = userId;
    if (!_studyData.__ObjectIDs) _studyData.__ObjectIDs = [];
    _studyData.__ObjectIDs.push("userId");
  }

  // Gongo quirk: since we're updating with the same data*, it will skip.
  // *i.e., we mutate the original record, then ask to update it, but there's
  // "no change".
  console.log({ $set: studyData });
  StudySetCol.update(_studyData._id, {
    $set: studyData,
  });
}

function fetchDueCards(allCards, studyData) {
  const now = new Date();
  const cards = [];
  for (let setCard of allCards) {
    const studySetCard = studyData.cards[setCard.id];
    if (studySetCard.dueDate <= now) cards.push(setCard);
  }
  return cards;
}

function StudySetLoad() {
  const router = useRouter();
  const _id = router.query._id;

  const isPopulated = useGongoIsPopulated();
  const set = React.useMemo(() => getSet(_id), [_id]);
  const allCards = React.useMemo(() => set.generateCards(), [set]);
  const studyData = useGongoOne((db) =>
    db.collection("studySet").find({ setId: _id })
  );
  useGongoSub("studySet");

  // console.log({ studyData });

  React.useEffect(() => {
    if (isPopulated && !studyData) {
      // Race conditiion, let's double check with sync
      if (!StudySetCol.findOne({ setId: _id }));
      StudySetCol.insert(NewStudyData(set));
    }
  }, [!!studyData, isPopulated]);

  if (!studyData || !isPopulated) return <div>Initializing</div>;

  const dueCards = fetchDueCards(allCards, studyData);
  console.log({ set, allCards, dueCards, studyData });

  if (dueCards.length === 0) {
    const navParts = [{ title: "Study", url: "/study" }];
    return (
      <Container maxWidth="lg" sx={{ p: 0 }}>
        <AppBar title={set.id} navParts={navParts} />
        <Box sx={{ p: 2, textAlign: "center" }}>
          <div style={{ fontSize: "500%" }}>🏆</div>
          <Typography variant="body1">
            You&apos;re all done for the day!
          </Typography>
          <br />
          <Button variant="contained" component={Link} href="/study">
            Back to Study Home
          </Button>
        </Box>
      </Container>
    );
  }

  return <StudySet set={set} cards={dueCards} studyData={studyData} />;
}

function StudySet({ set, cards, studyData }) {
  console.log({ cards });
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
      // If we're on the final card, don't try set a new card at the end.
      if (cards.length > 1)
        setTimeout(() => {
          setWrong(null);
          setCard(randomCard(cards, card));
          if (!wrong) setCorrect(correct + 1);
          setTotal(total + 1);
          setStartTime(Date.now());
        }, 200);
      updateCardSet(set, card.id, studyData, { wrongCount, startTime });
    } else {
      setWrong(answer);
      setWrongCount(wrongCount + 1);
    }
  }

  const navParts = [{ title: "Study", url: "/study" }];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <AppBar title={set.id} navParts={navParts} />
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

export default dynamic(Promise.resolve(StudySetLoad), { ssr: false });
