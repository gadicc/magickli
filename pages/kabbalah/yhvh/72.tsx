import React from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import AppBar from "../../../components/AppBar";
import angels from "../../../data/kabbalah/SeventyTwoAngels";
import angelicOrders from "../../../data/kabbalah/AngelicOrders";

const formatter = new Intl.DateTimeFormat("default", {
  month: "short",
  day: "numeric",
});
function formatDate({ month, day }: { month: number; day: number }) {
  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    month - 1,
    day,
    // Include time to avoid timezone issues
    now.getHours(),
    now.getMinutes()
  );
  return formatter.format(date);
}

function SevenyTwo() {
  const navParts = [{ title: "Kabbalah", url: "/kabbalah" }];

  return (
    <>
      <AppBar title="72 Angels" navParts={navParts} />
      <Container style={{ textAlign: "justify" }}>
        <p>TODO - general explanation</p>
        <details style={{ fontSize: "80%" }}>
          <summary>Important note on sources used.</summary>
          <p>
            The material here is taken from{" "}
            <a href="https://www.google.co.uk/books/edition/La_science_cabalistique/ZqgpxTZ43HkC?hl=en&gbpv=0">
              The Science of the Kabbalah
            </a>{" "}
            (English title) by Lazare Lenain (1823; digitized by Google Books),
            passed through OCRmyPDF (
            <a href="/docs/Lenain%20-%20La%20Science%20Cabalistique%20(1823)%20-%20Google.txt">
              output.txt
            </a>
            ), and translated with Google Translate. This was done in an effort
            to provide a Copyright-free version of this material, however, a
            much better translation exists:
          </p>
          <p>
            We highly recommend the{" "}
            <a href="https://www.amazon.co.uk/Science-Kabbalah-Lazare-Lenain/dp/1947907093/ref=sr_1_1?crid=L3H786IAH9D0&keywords=the+science+of+the+kabbalah&qid=1695585748&sprefix=the+science+of+the+kabbalah%2Caps%2C121&sr=8-1">
              translation by Piers A. Vaughan
            </a>{" "}
            (Amazon link), who has not only provided an outstanding work, but
            also provided free, high quality images of the sigils on his blog,
            in{" "}
            <a href="https://rosecirclebooks.com/the-science-of-the-kabbalah-lenain/">
              this post
            </a>{" "}
            and{" "}
            <a href="https://rosecirclebooks.com/levi-seals-for-shemhamephorash/">
              this post
            </a>
            .
          </p>
        </details>
        <p>The sigils will be added at a later time.</p>
      </Container>
      {angels.map((angel, i) => {
        const angelicOrder =
          angel.angelicOrderId && angelicOrders[angel.angelicOrderId];

        return (
          <Accordion key={i}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                {i + 1}. {angel.name.en}{" "}
                {angel.governs && (
                  <>
                    ({formatDate(angel.governs.startDate)} -{" "}
                    {formatDate(angel.governs.endDate)})
                  </>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table aria-label="simple table" size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ width: 150 }}>
                        Angel (genius):
                      </TableCell>
                      <TableCell>
                        {angel.name.en} | {angel.name.he}
                      </TableCell>
                    </TableRow>
                    {angelicOrder && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Angelic order:
                        </TableCell>
                        <TableCell>
                          {angelicOrder.name.roman} | {angelicOrder.name.he}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              <details style={{ fontSize: "80%" }}>
                <summary>Original text</summary>

                <div
                  style={{
                    marginTop: ".8em",
                    whiteSpace: "pre-wrap",
                    textAlign: "justify",
                  }}
                >
                  {angel.text.en}
                </div>
              </details>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
}

export default SevenyTwo;
