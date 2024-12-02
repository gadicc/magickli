import React from "react";
import { useGongoOne, useGongoUserId } from "gongo-client-react";

import { AdminPanelSettingsTwoTone } from "@mui/icons-material";
//import Link from '@mui/material/Link';

import Tiles from "@/components/Tiles";
import GDLogoSquished from "@/goldendawn-logo-squished.svg";
import MagicalTemple from "./img/magical-temple.webp";
import GeomancyImg from "@/app/img/geomancy.webp";
import StudyImg from "@/app/img/study.webp";

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
    to: "/enochian/",
  },
  {
    title: "Geomancy",
    to: "/geomancy/",
    img: GeomancyImg,
    alt: "A shaman pokes holes in the sand",
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
    img: "/pics/magic-book.jpg",
    title: "Magick Journal",
    to: "https://majou.app/",
  },
  {
    title: "Study",
    to: "/study",
    img: StudyImg,
    alt: "Student Studying Magick",
  },
  {
    title: "Temples",
    to: "/temples",
    img: MagicalTemple,
    alt: "A Magical Temple",
  },
];

const adminTile = {
  Component: () => (
    <div style={{ textAlign: "center" }}>
      <AdminPanelSettingsTwoTone sx={{ color: "#555", fontSize: "700%" }} />
    </div>
  ),
  title: "Admin",
  to: "/admin",
};

function Index() {
  const userId = useGongoUserId();
  const user = useGongoOne((db) =>
    db.collection("users").find({ _id: userId })
  );

  const _tiles = user?.admin ? [adminTile, ...tiles] : tiles;

  return <Tiles tiles={_tiles} />;
}

export default Index;
