import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";

import AppBar from "../../components/AppBar";
import Tetragram from "../../components/geomancy/Tetragram";
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

  const daughters = [
    [mothers[0][0], mothers[1][0], mothers[2][0], mothers[3][0]], // heads
    [mothers[0][1], mothers[1][1], mothers[2][1], mothers[3][1]], // necks
    [mothers[0][2], mothers[1][2], mothers[2][2], mothers[3][2]], // bodies
    [mothers[0][3], mothers[1][3], mothers[2][3], mothers[3][3]], // feet
  ];

  const num = (x) => (x % 2 === 0 ? 2 : 1);
  const nephews = [
    [
      num(mothers[0][0] + mothers[1][0]),
      num(mothers[0][1] + mothers[1][1]),
      num(mothers[0][2] + mothers[1][2]),
      num(mothers[0][3] + mothers[1][3]),
    ],
    [
      num(mothers[2][0] + mothers[3][0]),
      num(mothers[2][1] + mothers[3][1]),
      num(mothers[2][2] + mothers[3][2]),
      num(mothers[2][3] + mothers[3][3]),
    ],
    [
      num(daughters[0][0] + daughters[1][0]),
      num(daughters[0][1] + daughters[1][1]),
      num(daughters[0][2] + daughters[1][2]),
      num(daughters[0][3] + daughters[1][3]),
    ],
    [
      num(daughters[2][0] + daughters[3][0]),
      num(daughters[2][1] + daughters[3][1]),
      num(daughters[2][2] + daughters[3][2]),
      num(daughters[2][3] + daughters[3][3]),
    ],
  ];

  const witnesses = [
    [
      num(nephews[0][0] + nephews[1][0]),
      num(nephews[0][1] + nephews[1][1]),
      num(nephews[0][2] + nephews[1][2]),
      num(nephews[0][3] + nephews[1][3]),
    ],
    [
      num(nephews[2][0] + nephews[3][0]),
      num(nephews[2][1] + nephews[3][1]),
      num(nephews[2][2] + nephews[3][2]),
      num(nephews[2][3] + nephews[3][3]),
    ],
  ];

  const judge = [
    [
      num(witnesses[0][0] + witnesses[1][0]),
      num(witnesses[0][1] + witnesses[1][1]),
      num(witnesses[0][2] + witnesses[1][2]),
      num(witnesses[0][3] + witnesses[1][3]),
    ],
  ];

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
          tetraRows={judge}
          start={15}
          group={false}
        />
        <br />
      </Container>
    </>
  );
}

export default GeomancyReading;
