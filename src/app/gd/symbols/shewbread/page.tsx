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
import TableOfShewbread from "@/components/gd/TableOfShewbread";
import CopyPasteExport from "@/copyPasteExport";

export default function CandleStickPage() {
  const navParts = [{ title: "Symbols", url: "/hogd/symbols/" }];
  const ref = React.useRef(null);

  return (
    <Container sx={{ p: 2 }}>
      <TableOfShewbread ref={ref} />
      <CopyPasteExport ref={ref} filename="TableOfShewbread-magickly-export" />
      <OpenSource
        files={[
          "/src/app/gd/symbols/shewbread/page.tsx",
          "/src/components/gd/TableOfShewbread.tsx",
        ]}
      />
    </Container>
  );
}
