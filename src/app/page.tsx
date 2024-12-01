import React from "react";
import Image from "next/image";
import { useGongoOne, useGongoUserId } from "gongo-client-react";

import {
  AdminPanelSettings,
  AdminPanelSettingsTwoTone,
} from "@mui/icons-material";
//import Link from '@mui/material/Link';

import Tiles from "@/components/Tiles";
import GDLogoSquished from "@/goldendawn-logo-squished.svg";
import GeomanticFigures from "@/app/geomancy/Geomantic_figures.svg";
import MagicalTemple from "./img/magical-temple.webp";
import GeomancyImg from "@/app/img/geomancy.webp";

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
    Component: () => (
      <Image
        src={GeomancyImg}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
        alt="A shaman pokes holes in the sand"
        sizes="(max-width: 1200px) 300px"
      />
    ),
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
    img: "/pics/study.jpg",
    title: "Study",
    to: "/study",
  },
  {
    title: "Temples",
    to: "/temples",
    Component: () => (
      <Image
        src={MagicalTemple}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
        alt="A Magical Temple"
        sizes="(max-width: 1200px) 300px"
      />
    ),
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
