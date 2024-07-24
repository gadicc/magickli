import React from "react";

import {
  tetragram as tetragrams,
  geomanicHouse as houses,
} from "@/../data/data";
import Tetragram from "../Tetragram";
import Typography from "@mui/material/Typography";
import { Container, Grid, Stack } from "@mui/material";

/*
function id2title(str: string) {
  return (str[0].toUpperCase() + str.substring(1)).replace(
    /_(\w)/,
    (m, p1) => " " + p1.toUpperCase()
  );
}
*/

// https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
const nth = (n) =>
  ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";

export default function Geomancy() {
  return (
    <>
      <Container sx={{ my: 1 }}>
        <p>
          In great appreciation of
          <i>The Golden Dawn Journal: Book 1: Divination</i> by Chic & Tabatha
          Cicero. Buy on{" "}
          <a href="https://www.amazon.com/Golden-Dawn-Journal-Divination-Llewellyns/dp/1567188508">
            Amazon
          </a>{" "}
          or{" "}
          <a href="https://www.goldendawnshop.com/product/basics-of-magic-the-best-of-the-golden-dawn-journal-book-1-divination/">
            GDShop
          </a>{" "}
          (summary).
        </p>

        <Typography variant="h4" sx={{ my: 2 }} style={{ textAlign: "center" }}>
          16 Tetragrams
        </Typography>
        <Grid container spacing={2} p={0}>
          {Object.values(tetragrams).map((tetragram) => (
            <Grid key={tetragram.id} item xs={6} sm={4} md={3} lg={2} xl={1}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <b>{tetragram.title.en}</b>
                  <br />({tetragram.translation.en})
                </Grid>
                <Grid item xs={4}>
                  <Tetragram rows={tetragram.rows} />
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" sx={{ my: 2 }} style={{ textAlign: "center" }}>
          Geomanic Houses
        </Typography>

        <div style={{ textAlign: "justify" }}>
          {houses.slice(1).map((house, i) => (
            <p key={i}>
              <b>
                {i + 1}
                {nth(i + 1)} House:
              </b>{" "}
              {house.meaning.en}
            </p>
          ))}
        </div>

        <Typography variant="h4" sx={{ my: 2 }} style={{ textAlign: "center" }}>
          Meanings in the Houses
        </Typography>

        {Object.values(tetragrams).map((tetragram) => (
          <div key={tetragram.id}>
            <b>{tetragram.title.en}</b>
            <br />
            <i> {tetragram.meaning.en}</i>
            <br />
            <ol>
              {tetragram.meanings.slice(1).map((meaning, i) => (
                <li key={i}>{meaning.en}</li>
              ))}
            </ol>
          </div>
        ))}
      </Container>
    </>
  );
}
