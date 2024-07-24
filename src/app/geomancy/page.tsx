import React from "react";
//import Link from '@mui/material/Link';

import Tiles from "@/components/Tiles";
import GeomanticFigures from "./Geomantic_figures.svg";

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

function GeomancyPage() {
  return (
    <>
      <Tiles tiles={tiles} />
    </>
  );
}

export default GeomancyPage;
