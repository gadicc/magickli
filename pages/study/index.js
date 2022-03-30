import React from "react";
import { useGongoLive } from "gongo-client-react";
import { useRouter } from "next/router";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Link from "../../src/Link.js";
import AppBar from "../../components/AppBar.js";
import { sets as allSets } from "../../src/study/sets.js";

function dueCount(set) {
  let count = 0;
  const now = new Date();

  for (let card of Object.values(set.cards)) if (card.dueDate <= now) count++;

  return count;
}

export default function Study() {
  const router = useRouter();
  const currentSets = useGongoLive((db) => db.collection("studySet").find());

  return (
    <>
      <AppBar title="Study" />

      <Container sx={{ py: 1 }}>
        <Typography variant="h5" sx={{ paddingBottom: 1 }}>
          Current Sets
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Set</TableCell>
                <TableCell align="right">Grade</TableCell>
                <TableCell align="right">Due</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentSets.map((set) => (
                <TableRow
                  key={set._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => router.push("/study/" + set.setId)}
                >
                  <TableCell component="th" scope="row">
                    <Link href={"/study/" + set.setId}>{set.setId}</Link>
                  </TableCell>
                  <TableCell align="right">
                    {set.correct + set.incorrect > 0
                      ? Math.round(
                          (set.correct / (set.correct + set.incorrect)) * 100
                        ) + "%"
                      : "-"}
                  </TableCell>
                  <TableCell align="right">{dueCount(set)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br />

        <Typography variant="h5" sx={{ paddingBottom: 1 }}>
          All Sets
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Set</TableCell>
                <TableCell align="right"># Cards</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(allSets).map((name) => (
                <TableRow
                  key={name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => router.push("/study/" + name)}
                >
                  <TableCell component="th" scope="row">
                    <Link href={"/study/" + name}>{name}</Link>
                  </TableCell>
                  <TableCell align="right">
                    {Object.keys(allSets[name].data).length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
