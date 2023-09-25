import React from "react";
//import Link from '@mui/material/Link';

import AppBar from "../../../components/AppBar";
import Tiles from "../../../components/Tiles";

const tiles = [
  {
    Component: () => (
      <div style={{ margin: "auto", textAlign: "center" }}>72 Angels</div>
    ),
    title: "72 Angels",
    to: "/kabbalah/yhvh/72angels",
  },
];

function Kabbalah() {
  const navParts = [{ title: "Kabbalah", url: "/kabbalah" }];

  return (
    <>
      <AppBar title="Shem Hamephorash" navParts={navParts} />
      <Tiles tiles={tiles} />
    </>
  );
}

export default Kabbalah;
