import React from "react";

import AppBar from "../../components/AppBar";
import Tiles from "../../components/Tiles";

//import aethyrs from './enochian/30aethyrs.jpg';
import orationThumb from "../../src/enochian/img/oration-thumb.jpg";
import firstKey from "../../src/enochian/img/enochianFirstKey.png";
import enochianAbc from "../../src/enochian/img/enochianAbc.png";
import dictionaryImg from "../../src/enochian/img/dictionary.jpg";
import { Box } from "@mui/material";

const tiles = [
  {
    img: orationThumb,
    title: "Oration to God",
    to: "/enochian/oration",
  },
  {
    img: firstKey,
    title: "Keys / Calls",
    to: "/enochian/keys",
  },
  {
    img: enochianAbc,
    title: "Learn",
    to: "/study?tags=enochian",
  },
  {
    img: dictionaryImg,
    title: "Dictionary",
    to: "/enochian/dictionary",
  },
  {
    Component: () => <Box>Tablets</Box>,
    title: "Tablets",
    to: "/enochian/tablets",
  },
];

function Enochian() {
  return (
    <>
      <AppBar title="Enochian" />
      <Tiles tiles={tiles} />
    </>
  );
}

export default Enochian;
