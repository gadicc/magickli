import React from "react";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import Link from "../../src/Link.js";
import AppBar from "../../components/AppBar.js";
import { sets } from "../../src/study/sets.js";

export default function Study() {
  return (
    <>
      <AppBar title="Study" />
      <Container>
        <Typography variant="h5">Current Sets</Typography>
        <p>Coming one day.</p>
        <Typography variant="h5">All Sets</Typography>
        <div>
          {Object.keys(sets).map((name) => (
            <React.Fragment key={name}>
              <Chip component={Link} href={"/study/" + name} label={name} />{" "}
            </React.Fragment>
          ))}
        </div>
        <br />
        <Typography variant="h5">Requests</Typography>
        <Typography variant="body2">
          Happily taking requests for new sets, contact details on the{" "}
          <Link href="/about">About</Link> page. NB: I can only add data from
          public sources. Please don&apos;t send me any private Order documents.
          However, the heads of your order are welcome to make contact to have
          such data made available only to members of your order in a secure
          way.
        </Typography>
      </Container>
    </>
  );
}
