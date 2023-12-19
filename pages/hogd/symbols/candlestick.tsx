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

export default function CandleStickPage() {
  const navParts = [{ title: "Symbols", url: "/hogd/symbols/" }];

  return (
    <>
      <AppBar title="Fylfot Cross" navParts={navParts} />
      <Container sx={{ p: 2 }}>
        <SevenBranchedCandleStick />
        <OpenSource href="/pages/hogd/symbols/candlestick.tsx" />
      </Container>
    </>
  );
}
