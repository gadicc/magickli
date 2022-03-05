import React from "react";
//import Link from '@mui/material/Link';

import AppBar from "../../components/AppBar";
import Tiles from "../../components/Tiles";

const tiles = [
  {
    img: "/pics/treeOfLife.jpg",
    title: "Tree of Life",
    to: "/kabbalah/tree",
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
