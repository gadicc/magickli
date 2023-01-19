import React from "react";
//import Link from '@mui/material/Link';

import AppBar from "../../components/AppBar";
import Tiles from "../../components/Tiles";
import GeomanticFigures from "../../src/geomancy/Geomantic_figures.svg";

const tiles = [
  {
    Component: () => <GeomanticFigures width="100%" />,
    title: "Reference",
    to: "/geomancy/reference",
  },
  {
    Component: () => <GeomanticFigures width="100%" />,
    title: "Reading",
    to: "/geomancy/reading",
  },
];

function Kabbalah() {
  return (
    <>
      <AppBar title="Kabbalah" />
      <Tiles tiles={tiles} />
    </>
  );
}

export default Kabbalah;
