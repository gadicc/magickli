import React from "react";

import AppBar from "../../components/AppBar";
import enochianTablets, { EnochianTablet } from "../../data/enochian/Tablets";
import { is } from "date-fns/locale";
import { Container } from "@mui/material";
const navParts = [{ title: "Enochian", url: "/enochian" }];

function isCrossFromPosition(x: number, y: number) {
  if (x === 2 || x === 5 || x === 6 || x === 9) return true;
  if (y === 1 || y === 6 || y === 8) return true;
  return false;
}

function elementFromPosition(x: number, y: number) {
  if (x < 5) {
    if (y < 6) return "air";
    if (y > 6) return "earth";
  } else if (x > 6) {
    if (y < 6) return "water";
    if (y > 6) return "fire";
  }
  return "";
}

const elementColors = {
  air: "yellow",
  water: "#59f",
  fire: "orange",
  earth: "white",
};

function Tablet({ id }: { id: string }) {
  const tablet: EnochianTablet = enochianTablets[id];
  const size = 20;
  const border = 2;

  return (
    <svg viewBox={`0 0 ${size * 12 + border * 2} ${size * 13 + border * 2}`}>
      {tablet.grid.map((row, y) =>
        row.map((letter, x) => {
          const element = elementFromPosition(x, y);
          const isCross = isCrossFromPosition(x, y);
          const color = !isCross && elementColors[element];

          return (
            <>
              <rect
                key={`r-${y}-${x}`}
                x={x * size + border}
                y={y * size + border}
                width={size}
                height={size}
                style={{
                  strokeWidth: 1.2,
                  stroke: color ? "white" : "black",
                  fill: color ? "black" : "white",
                }}
              />
              <text
                key={`t-${y}-${x}`}
                x={x * size + size / 2 + border}
                y={y * size + size / 2 + 6 + border}
                style={{
                  fontSize: size - 2,
                  textAnchor: "middle",
                  fill: color,
                }}
              >
                {letter}
              </text>
            </>
          );
        })
      )}
      <rect
        x={0}
        y={0}
        width={size * 12 + border * 2}
        height={size * 13 + border * 2}
        style={{
          strokeWidth: border + 2,
          stroke: "black",
          fill: "none",
        }}
      />
    </svg>
  );
}

export default function Tablets() {
  return (
    <>
      <AppBar title="Tablets" navParts={navParts} />
      <Container sx={{ p: 2 }}>
        <Tablet id="earth" />
      </Container>
    </>
  );
}
