import React from "react";
import { useGongoOne, useGongoUserId } from "gongo-client-react";

import { AdminPanelSettingsTwoTone } from "@mui/icons-material";
//import Link from '@mui/material/Link';

import Tiles from "@/components/Tiles";
import GDLogoSquished from "@/goldendawn-logo-squished.svg";
import MagicalTemple from "./img/magical-temple.webp";
import GeomancyImg from "@/app/img/geomancy.webp";
import StudyImg from "@/app/img/study.webp";
import AndroidMagician from "@/app/img/android-magician.png";

const tiles = [
  {
    title: "About",
    to: "/about",
    img: "/pics/about.png",
    alt: "About Icon",
  },
  {
    title: "Astrology",
    to: "/astrology",
    img: "/pics/astrology.jpg",
    alt: "Astrology Wheel",
  },
  {
    title: "Chat (MagickGPT)",
    to: "/chat",
    img: AndroidMagician,
    alt: "Android Magician",
  },
  {
    title: "Enochian",
    to: "/enochian/",
    img: "/pics/30aethyrs.jpg",
    alt: "Enochian Aethyrs",
  },
  {
    title: "Geomancy",
    to: "/geomancy/",
    img: GeomancyImg,
    alt: "A shaman pokes holes in the sand",
  },
  {
    title: "Golden Dawn",
    to: "/gd/",
    Component: () => <GDLogoSquished width="100%" />,
  },
  {
    title: "Kabbalah",
    to: "/kabbalah",
    img: "/pics/Tree_of_Life,_Medieval.jpg",
    alt: "Kabbalistic Tree of Life",
  },
  {
    title: "Magick Journal",
    to: "https://majou.app/",
    img: "/pics/magic-book.jpg",
    alt: "Glowing Magical Journal",
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
