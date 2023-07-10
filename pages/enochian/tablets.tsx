import React from "react";

import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import AppBar from "../../components/AppBar";
import enochianTablets, { EnochianTablet } from "../../data/enochian/Tablets";
import EnochianFont from "../../src/enochian/enochianFont";

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
  fire: "#f55",
  earth: "white",
};

function EarthSymbol() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
      <circle
        cx={0}
        cy={0}
        r={92}
        fill="none"
        stroke="black"
        strokeWidth={15}
      />
      {/* <circle cx={0} cy={0} r={1} fill="black" /> */}
      <path
        d={
          "M -10 -10 v -45 " +
          "c 0 -10, -10 -10, -20 -10" +
          "v -8 h 60 v 8" +
          "c -10 0, -20 0, -20 10" +
          "v 45 h -20"
        }
        fill="#c3b030"
        stroke="black"
      />
      <path
        d={
          "M -10 -10 v -45 " +
          "c 0 -10, -10 -10, -20 -10" +
          "v -8 h 60 v 8" +
          "c -10 0, -20 0, -20 10" +
          "v 45 h -20"
        }
        fill="#626e30"
        stroke="black"
        transform="rotate(90)"
      />
      <path
        d={
          "M -10 -10 v -45 " +
          "c 0 -10, -10 -10, -20 -10" +
          "v -8 h 60 v 8" +
          "c -10 0, -20 0, -20 10" +
          "v 45 h -20"
        }
        fill="black"
        stroke="black"
        transform="rotate(180)"
      />
      <path
        d={
          "M -10 -10 v -45 " +
          "c 0 -10, -10 -10, -20 -10" +
          "v -8 h 60 v 8" +
          "c -10 0, -20 0, -20 10" +
          "v 45 h -20"
        }
        fill="#993621"
        stroke="black"
        transform="rotate(270)"
      />
    </svg>
  );
}

function Grid({
  id,
  enochianFont = false,
}: {
  id: string;
  enochianFont?: boolean;
}) {
  const tablet: EnochianTablet = enochianTablets[id];
  const size = 20;
  const border = 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size * 12 + border * 2} ${size * 13 + border * 2}`}
    >
      {tablet.grid.map((row, y) =>
        row.map((letter, x) => {
          const element = elementFromPosition(x, y);
          const isCross = isCrossFromPosition(x, y);
          const color = !isCross && elementColors[element];

          return (
            <React.Fragment key={"grid-" + x + "," + y}>
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
                  fontWeight: enochianFont ? "bold" : undefined,
                  fontSize: size - 2 - (enochianFont ? 4 : 0),
                  textAnchor: "middle",
                  fill: color,
                  ...(enochianFont ? EnochianFont.style : {}),
                }}
              >
                {letter}
              </text>
            </React.Fragment>
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

const Tablet = React.forwardRef(function Tablet(
  {
    id,
    enochianFont = false,
  }: {
    id: string;
    enochianFont?: boolean;
  },
  ref: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-105 0 210 297"
      style={{ border: "1px solid black" }}
      ref={ref}
    >
      <g transform="translate(-31.5,-5) scale(0.3)">
        <EarthSymbol />
      </g>
      <g transform="translate(-94.5,48) scale(0.9)">
        <Grid id={id} enochianFont={enochianFont} />
      </g>
    </svg>
  );
});

export default function Tablets() {
  const [elementId, setElementId] = React.useState<string>("earth");
  const [enochianFont, setEnochianFont] = React.useState<boolean>(false);
  const ref = React.useRef<SVGSVGElement>(null);

  return (
    <>
      <AppBar title="Tablets" navParts={navParts} />

      <Container sx={{ p: 2 }}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Tablet</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={elementId}
            label="Tablet"
            onChange={(e) => setElementId(e.target.value)}
          >
            <MenuItem value="earth">Earth</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={() => setEnochianFont(!enochianFont)}>
          <span style={enochianFont ? {} : { color: "red" }}>A</span>
          &nbsp;
          <span
            style={{
              color: enochianFont ? "red" : undefined,
              ...EnochianFont.style,
            }}
          >
            A
          </span>
        </Button>
        <br />
        <br />

        <Tablet id={elementId} enochianFont={enochianFont} ref={ref} />
        <br />
      </Container>
    </>
  );
}
