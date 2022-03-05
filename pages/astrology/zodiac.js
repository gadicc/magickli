import React, { useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import makeStyles from "@mui/styles/makeStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Link from "../../src/Link";
import Copyright from "../../src/Copyright";

import AppBar from "../../components/AppBar";
import Data from "../../data/data";

const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  },
});

export default function signs() {
  const classes = useStyles();
  const navParts = [{ title: "Astrology", url: "/astrology" }];

  return (
    <>
      <AppBar title="Zodiac" navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Sign & Symbol</TableCell>
                  <TableCell>Meaning</TableCell>
                  <TableCell>Rules from</TableCell>
                  <TableCell>Ruled by</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {Object.values(Data.zodiac).map((sign) => (
                  <TableRow key={sign.id}>
                    <TableCell scope="row">
                      <Link
                        href={"/astrology/sign/" + sign.id}
                        color="secondary"
                      >
                        {sign.name.en} {sign.symbol}
                      </Link>
                    </TableCell>

                    <TableCell scope="row">
                      <Link
                        href={"/astrology/sign/" + sign.id}
                        color="secondary"
                      >
                        {sign.meaning.en}
                      </Link>
                    </TableCell>

                    <TableCell scope="row">
                      <Link
                        href={"/astrology/sign/" + sign.id}
                        color="secondary"
                      >
                        {JSON.stringify(sign.rulesFrom)}
                      </Link>
                    </TableCell>

                    <TableCell scope="row">
                      <Link
                        href={"/astrology/sign/" + sign.id}
                        color="secondary"
                      >
                        {sign.planet.name.en.en}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
}
