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

export default function CandleStickPage() {
  const navParts = [{ title: "Symbols", url: "/hogd/symbols/" }];

  return (
    <>
      <AppBar title="Shewbread Table" navParts={navParts} />
      <Container sx={{ p: 2 }}>
        <TableOfShewbread />
        <OpenSource href="/pages/hogd/symbols/shewbread.tsx" />
      </Container>
    </>
  );
}
