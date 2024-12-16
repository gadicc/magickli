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

import OpenSource from "@/OpenSource";
import SevenBranchedCandleStick from "@/components/gd/SevenBranchedCandleStick";
import CopyPasteExport from "@/copyPasteExport";

export default function CandleStickPage() {
  const navParts = [{ title: "Symbols", url: "/hogd/symbols/" }];
  const ref = React.useRef(null);

  return (
    <Container sx={{ p: 2 }}>
      <SevenBranchedCandleStick ref={ref} />
      <CopyPasteExport
        ref={ref}
        filename="SevenBranchedCandleStick-magickly-export"
      />
      <OpenSource
        files={[
          "/src/app/gd/symbols/candlestick/page.tsx",
          "/src/components/gd/SevenBranchedCandleStick.tsx",
        ]}
      />
    </Container>
  );
}
