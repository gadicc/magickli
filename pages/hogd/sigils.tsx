import React from "react";
import {
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { CheckBox } from "@mui/icons-material";

import AppBar from "../../components/AppBar";
import RoseSigil, { letterIJ } from "../../components/hogd/RoseSigil";

const navParts = [
  {
    title: "HOGD",
    url: "/hogd",
  },
];

export default function Sigils() {
  const [sigilText, setSigilText] = React.useState("גדי");
  const [showRose, setShowRose] = React.useState(true);

  const rectified = (function () {
    const text = sigilText;
    return text
      .replaceAll("ך", "כ")
      .replaceAll("ם", "מ")
      .replaceAll("ן", "נ")
      .replaceAll("ף", "פ")
      .replaceAll("ץ", "צ");
  })();

  const isValid = (function () {
    for (const letter of rectified) {
      if (letterIJ(letter)[0] < 0) return false;
    }
    return true;
  })();

  return (
    <div>
      <AppBar title="Sigils" navParts={navParts} />
      <Container sx={{ py: 2 }}>
        <TextField
          placeholder="Sigil text"
          size="small"
          value={sigilText}
          onChange={(e) => setSigilText(e.target.value)}
        />
        {!isValid && <div>Invalid characters</div>}
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={showRose}
                onChange={() => setShowRose(!showRose)}
              />
            }
            label="Show Rose"
          />
        </FormGroup>

        {rectified != sigilText && <div>Rectified text: {rectified}</div>}
        <RoseSigil sigilText={isValid ? rectified : ""} showRose={showRose} />
      </Container>
    </div>
  );
}
