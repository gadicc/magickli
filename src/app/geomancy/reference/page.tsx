"use client";
import React from "react";

import {
  tetragram as _tetragrams,
  geomanicHouse as houses,
} from "@/../data/data";
import Tetragram from "../Tetragram";
import Typography from "@mui/material/Typography";
import { Container, Grid, MenuItem, Select, Stack } from "@mui/material";

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

const rowsToBinary = (rows: (1 | 2)[]) =>
  parseInt(rows.map((r) => (r === 1 ? "0" : "1")).join(""), 2);
export default function Geomancy() {
  const [sortBy, setSortBy] = React.useState<"alpha" | "pairs" | "binary">(
    "pairs"
  );
  const tetragrams = React.useMemo(() => {
    if (sortBy === "pairs") {
      const t = _tetragrams;
      // prettier-ignore
      return [
        t.acquisitio, t.amissio, // gain, loss
        t.albus, t.rubeus, // white, red
        t.puella, t.puer, // girl, boy
        t.laetitia, t.tristitia, // joy, sorrow
        t.caput_draconis, t.cauda_draconis, // dragon's head, tail
        t.populus, t.via, // people, way
        t.conjunctio, t.carcer, // conjunction, prison
        t.fortuna_major, t.fortuna_minor, // major, minor fortune
      ]
    }

    const tetragrams = Object.values(_tetragrams);
    if (sortBy === "alpha")
      tetragrams.sort((a, b) => a.title.en.localeCompare(b.title.en));
    else if (sortBy === "binary")
      tetragrams.sort((a, b) => rowsToBinary(a.rows) - rowsToBinary(b.rows));
    return tetragrams;
  }, [sortBy]);
  const byPairs = sortBy === "pairs" || sortBy === "binary";

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

        <div style={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ my: 2 }}>
            16 Tetragrams
          </Typography>
          <Select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "alpha" | "pairs" | "binary")
            }
            size="small"
          >
            <MenuItem value="alpha">sort alphabetically</MenuItem>
            <MenuItem value="pairs">sort by meaning pairs</MenuItem>
            <MenuItem value="binary">sort by binary value</MenuItem>
          </Select>
        </div>
        <br />

        <Grid container spacing={2} p={0}>
          {tetragrams.map((tetragram) => (
            <Grid
              key={tetragram.id}
              item
              xs={6}
              sm={byPairs ? 6 : 4}
              md={byPairs ? 6 : 3}
              lg={byPairs ? 6 : 2}
              xl={byPairs ? 6 : 1}
            >
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
