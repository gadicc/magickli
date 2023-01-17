import React from "react";
//import Link from '@mui/material/Link';

import AppBar from "../components/AppBar";
import Tiles from "../components/Tiles";

import GDLogoSquished from "../src/goldendawn-logo-squished.svg";
import GeomanticFigures from "../src/geomancy/Geomantic_figures.svg";

const tiles = [
  {
    img: "/pics/about.png",
    title: "About",
    to: "/about",
  },
  {
    img: "/pics/astrology.jpg",
    title: "Astrology",
    to: "/astrology",
  },
  {
    img: "/pics/30aethyrs.jpg",
    title: "Enochian",
    to: "https://enochian.app/",
  },
  {
    Component: () => <GeomanticFigures width="100%" />,
    title: "Geomancy",
    to: "/geomancy/",
  },
  {
    Component: () => <GDLogoSquished width="100%" />,
    title: "Golden Dawn",
    to: "/hogd/",
  },
  {
    img: "/pics/Tree_of_Life,_Medieval.jpg",
    title: "Kabbalah",
    to: "/kabbalah",
  },
  {
    img: "/pics/study.jpg",
    title: "Study",
    to: "/study",
  },
];

function Index() {
  return (
    <>
      <AppBar title="Magick.li" />
      <Tiles tiles={tiles} />
    </>
  );
}

export default Index;
