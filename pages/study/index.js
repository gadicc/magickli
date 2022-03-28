import React from "react";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

import Link from "../../src/Link.js";
import AppBar from "../../components/AppBar.js";
import { sets } from "../../src/study/sets.js";

export default function Study() {
  return (
    <>
      <AppBar title="Study" />
      <Container>
        <h1>Current Sets</h1>
        <h1>All Sets</h1>
        {Object.keys(sets).map((name) => (
          <React.Fragment key={name}>
            <Chip component={Link} href={"/study/" + name} label={name} />{" "}
          </React.Fragment>
        ))}
      </Container>
    </>
  );
}
