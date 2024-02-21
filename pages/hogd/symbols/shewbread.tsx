"use client";
import React from "react";

import {
  Button,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
} from "@mui/material";

import data from "../../../data/data";
import AppBar from "../../../components/AppBar";
import OpenSource from "../../../src/OpenSource";
import Symbols from "../symbols";
import SevenBranchedCandleStick from "../../../components/hogd/SevenBranchedCandleStick";
import TableOfShewbread from "../../../components/hogd/TableOfShewbread";
import CopyPasteExport from "../../../src/copyPasteExport";

export default function CandleStickPage() {
  const navParts = [{ title: "Symbols", url: "/hogd/symbols/" }];
  const ref = React.useRef(null);

  return (
    <>
      <AppBar title="Shewbread Table" navParts={navParts} />
      <Container sx={{ p: 2 }}>
        <TableOfShewbread ref={ref} />
        <CopyPasteExport
          ref={ref}
          filename="TableOfShewbread-magickli-export"
        />
        <OpenSource href="/pages/hogd/symbols/shewbread.tsx" />
      </Container>
    </>
  );
}
