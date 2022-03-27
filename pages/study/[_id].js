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

import data from "../../data/data.js";

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

function SingleCharQuestion({ question }) {
  return (
    <Paper sx={{ my: 2, p: 2, fontSize: "500%", textAlign: "center" }}>
      {question}
    </Paper>
  );
}

const sets = {
  "zodiac-signs": {
    data: data.zodiac,
    question: (item) => item.symbol,
    answer: (item) => item.name.en,
    Question: SingleCharQuestion,
  },
};

function generateSet(name) {
  const { data, question, answer } = sets[name];
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

export async function getServerSideProps(context) {
  const { _id } = context.query;
  return { props: { _id } };
}

const randomItem = (set) => set[Math.floor(Math.random() * set.length)];

function StudySet() {
  const router = useRouter();
  const _id = router.query._id;

  const set = React.useMemo(() => generateSet(_id), [_id]);
  const [item, setItem] = React.useState(randomItem(set));
  const [correct, setCorrect] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [wrong, setWrong] = React.useState(null);
  const Question = sets[_id].Question;

  function clicked(answer) {
    if (answer === item.answer) {
      setWrong("noMatch"); // to show answer in green
      setTimeout(() => {
        setWrong(null);
        setItem(randomItem(set));
        if (!wrong) setCorrect(correct + 1);
        setTotal(total + 1);
      }, 200);
    } else {
      setWrong(answer);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <AppBar title={"Study " + _id} />
      <Box sx={{ p: 2 }}>
        <div style={{ textAlign: "right" }}>
          {total === 0 ? "Go!" : `${correct} / ${total}`}
        </div>

        <Question question={item.question} />
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {item.answers.map((answer) => (
              <Grid key={answer} item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  style={{
                    color: wrong && answer === item.answer && "white",
                    background: wrong
                      ? answer === wrong
                        ? "red"
                        : answer === item.answer
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
