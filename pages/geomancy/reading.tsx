import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";

import AppBar from "../../components/AppBar";
import Tetragram from "../../components/geomancy/Tetragram";
import { compute } from "../../src/geomancy/tetragrams";
import {
  tetragram as tetragrams,
  geomanicHouse as houses,
} from "../../data/data";

// https://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
function romanize(num) {
  if (!+num) return false;
  const digits = String(+num).split("");
  // prettier-ignore
  const key = ['','C','CC','CCC','CD','D','DC','DCC','DCCC','CM',
             '','X','XX','XXX','XL','L','LX','LXX','LXXX','XC',
             '','I','II','III','IV','V','VI','VII','VIII','IX'];
  // prettier-ignore
  let roman = '', i = 3;
  while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

function tetragramFromRows(rows) {
  for (const tetragram of Object.values(tetragrams)) {
    const tr = tetragram.rows;
    if (
      tr[0] === rows[0] &&
      tr[1] === rows[1] &&
      tr[2] === rows[2] &&
      tr[3] === rows[3]
    )
      return tetragram;
  }
  return null;
}

function TetragramStack({ title, start, tetraRows, group }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <b>{title}</b>
      <br />
      <Stack direction="row-reverse" justifyContent="space-evenly">
        {tetraRows.map((rows, i) => (
          <Box key={i}>
            {romanize(i + start)}
            <br />
            <Tetragram key={i} rows={rows} />
            <br />
            {!group && tetragramFromRows(rows).title.en}
          </Box>
        ))}
      </Stack>
      {group && (
        <Box>
          <ol start={start + 3} type="I" reversed>
            {tetraRows.reverse().map((rows, i) => (
              <li key={i}>{tetragramFromRows(rows).title.en}</li>
            ))}
          </ol>
        </Box>
      )}
    </Box>
  );
}

function GeomancyReading() {
  const mothers: (1 | 2)[][] = [
    [1, 2, 1, 1],
    [1, 1, 1, 2],
    [2, 1, 1, 1],
    [1, 2, 1, 2],
  ];

  const { daughters, nephews, witnesses, judges } = compute(mothers);

  return (
    <>
      <AppBar
        title="Reading"
        navParts={[{ title: "Geomancy", url: "/geomancy" }]}
      />

      <Container sx={{ my: 1 }}>
        <Stack direction="row-reverse" justifyContent="space-around">
          <TetragramStack
            title="Mothers"
            tetraRows={mothers}
            start={1}
            group={true}
          />
          <TetragramStack
            title="Daughters"
            tetraRows={daughters}
            start={5}
            group={true}
          />
        </Stack>

        <TetragramStack
          title="Nephews"
          tetraRows={nephews}
          start={9}
          group={false}
        />
        <br />

        <TetragramStack
          title="Witnesses"
          tetraRows={witnesses}
          start={13}
          group={false}
        />
        <br />

        <TetragramStack
          title="Judge"
          tetraRows={judges}
          start={15}
          group={false}
        />
        <br />
      </Container>
    </>
  );
}

export default GeomancyReading;
