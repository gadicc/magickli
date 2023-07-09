import React from "react";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Container,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Button,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import AppBar from "../../components/AppBar";
import keys, { EnochianKey } from "../../data/enochian/Keys";
import EnochianFont from "../../src/enochian/enochianFont";

function KeyText({
  enochianKey,
  lang,
  enochianFont,
}: {
  enochianKey: EnochianKey;
  lang: "enochian" | "english" | "both";
  enochianFont: boolean;
}) {
  if (lang === "english")
    return (
      <div style={{ textAlign: "justify" }}>
        {enochianKey.subkeys.map((subkey) => (
          <React.Fragment key={subkey.subkey}>
            <span>{subkey.english}</span>{" "}
          </React.Fragment>
        ))}
      </div>
    );

  if (lang === "enochian")
    return (
      <div
        style={{ textAlign: "justify" }}
        className={enochianFont ? EnochianFont.className : undefined}
      >
        {enochianKey.subkeys.map((subkey) => (
          <React.Fragment key={subkey.subkey}>
            <span>{subkey.enochianLatin}</span>{" "}
          </React.Fragment>
        ))}
      </div>
    );

  if (lang === "both")
    return (
      <table>
        <tbody>
          {enochianKey.subkeys.map(
            (subkey) =>
              subkey.subkey > 0 && (
                <tr key={subkey.subkey}>
                  <td>
                    {enochianKey.key}.{subkey.subkey}
                  </td>
                  <td
                    className={
                      enochianFont ? EnochianFont.className : undefined
                    }
                  >
                    {subkey.enochianLatin}
                  </td>
                  <td>{subkey.english}</td>
                </tr>
              )
          )}
        </tbody>
      </table>
    );

  return <div></div>;
}

type EnochianLang = "enochian" | "english" | "both";
const navParts = [{ title: "Enochian", url: "/enochian" }];

export default function Keys() {
  const [lang, setLang] = React.useState<EnochianLang>("english");
  const [enochianFont, setEnochianFont] = React.useState<boolean>(false);

  return (
    <>
      <AppBar title="Keys / Calls" navParts={navParts} />

      <Container>
        <FormControl>
          {/*
          <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
          */}
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={lang}
            onChange={(e) => setLang(e.target.value as EnochianLang)}
            row
          >
            <FormControlLabel
              value="english"
              control={<Radio />}
              label="English"
            />
            <FormControlLabel
              value="enochian"
              control={<Radio />}
              label="Enochian"
            />
            <FormControlLabel value="both" control={<Radio />} label="Both" />
            {["enochian", "both"].includes(lang) && (
              <Button onClick={() => setEnochianFont(!enochianFont)}>
                <span style={{ color: enochianFont ? undefined : "red" }}>
                  A
                </span>
                &nbsp;
                <span
                  style={{ color: enochianFont ? "red" : undefined }}
                  className={EnochianFont.className}
                >
                  A
                </span>
              </Button>
            )}
          </RadioGroup>
        </FormControl>
      </Container>

      <Container>
        {keys.map(
          (key) =>
            key.key > 0 && (
              <Accordion key={key.key}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Key {key.key}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <KeyText
                    enochianKey={key}
                    lang={lang}
                    enochianFont={enochianFont}
                  />
                </AccordionDetails>
              </Accordion>
            )
        )}
      </Container>
    </>
  );
}
