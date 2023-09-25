import React from "react";
//import Link from '@mui/material/Link';

import AppBar from "../../components/AppBar";
import Tiles from "../../components/Tiles";
import GradeTree from "../../components/hogd/GradeTree";

const tiles = [
  {
    Component: () => <GradeTree height="120%" />,
    title: "Grades",
    to: "/hogd/grades",
  },
  {
    img: "/pics/Anxfisa_Golden_Dawn_Robes.jpg",
    title: "Rituals",
    to: "/hogd/rituals",
  },
  {
    Component: () => (
      <div
        style={{
          marginTop: 50,
          textAlign: "center",
          fontSize: "200%",
          color: "black",
          textDecoration: "none",
        }}
      >
        Sigils
      </div>
    ),
    title: "Sigils",
    to: "/hogd/sigils",
  },
  {
    Component: () => (
      <div
        style={{
          marginTop: 30,
          textAlign: "center",
          fontSize: "300%",
          color: "black",
          textDecoration: "none",
        }}
      >
        ✭
      </div>
    ),
    title: "Symbols",
    to: "/hogd/symbols",
  },
];

function HOGD() {
  return (
    <>
      <AppBar title="HOGD" />
      <Tiles tiles={tiles} />
    </>
  );
}

export default HOGD;
