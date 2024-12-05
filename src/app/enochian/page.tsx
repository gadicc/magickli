import React from "react";

import { Box } from "@mui/material";

import Tiles from "@/components/Tiles";
//import aethyrs from './enochian/30aethyrs.jpg';
import orationThumb from "./img/oration-thumb.jpg";
import firstKey from "./img/enochianFirstKey.png";
import enochianAbc from "./img/enochianAbc.png";
import dictionaryImg from "./img/dictionary.jpg";
import Tablet from "@/components/enochian/Tablet";

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
    title: "Tablets",
    to: "/enochian/tablets",
    Component: () => (
      <Box height="100%" textAlign="center" marginTop={1}>
        <Tablet id="earth" height="100%" />
      </Box>
    ),
  },
];

function Enochian() {
  return <Tiles tiles={tiles} />;
}

export default Enochian;
