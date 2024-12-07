import React from "react";
import Tiles from "@/components/Tiles";

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
  return <Tiles tiles={tiles} />;
}

export default Astrology;
