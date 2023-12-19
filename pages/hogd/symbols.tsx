import React from "react";
//import Link from '@mui/material/Link';

import AppBar from "../../components/AppBar";
import Tiles from "../../components/Tiles";
import SevenBranchedCandleStick from "../../components/hogd/SevenBranchedCandleStick";
// import { FylfotCross } from "../../pages/hogd/symbols/fylfot-cross";

const tiles = [
  {
    Component: () => (
      <div
        style={{
          marginTop: 10,
          fontSize: "500%",
          textAlign: "center",
          color: "black",
        }}
      >
        卍
      </div>
    ),
    // img: "/pics/treeOfLife.jpg",
    title: "Fylfot Cross",
    to: "symbols/fylfot-cross",
  },
  {
    Component: () => <SevenBranchedCandleStick />,
    // img: "/pics/treeOfLife.jpg",
    title: "7B Candlestick",
    to: "symbols/candlestick",
  },
];

function Symbols() {
  return (
    <>
      <AppBar title="Symbols" navParts={[{ title: "HOGD", url: "/hogd" }]} />
      <Tiles tiles={tiles} />
    </>
  );
}

export default Symbols;
