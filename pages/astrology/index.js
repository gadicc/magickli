import React from "react";
import Link from "../../src/Link";
import withStyles from "@mui/styles/withStyles";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import AppBar from "../../components/AppBar";
import Tiles from "../../components/Tiles";

const tiles = [
  {
    img: "/pics/clock-in-the-solar-system.jpg",
    title: "Planetary Hours",
    to: "/astrology/planetary-hours",
  },
  {
    img: "/pics/planets2013.jpg",
    title: "Planets",
    to: "/astrology/planets",
  },
  {
    img: "/pics/astrology.jpg",
    title: "Zodiac",
    to: "/astrology/zodiac",
  },
];

function Astrology() {
  return (
    <>
      <AppBar title="Astrology" />
      <Tiles tiles={tiles} />
    </>
  );
}

export default Astrology;
