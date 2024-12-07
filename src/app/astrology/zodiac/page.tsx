"use client";
import React from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Link from "@/lib/link";
import Data from "@/../data/data";

export default function signs() {
  const navParts = [{ title: "Astrology", url: "/astrology" }];

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
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
                    <Link href={"/astrology/sign/" + sign.id}>
                      {sign.name.en} {sign.symbol}
                    </Link>
                  </TableCell>

                  <TableCell scope="row">
                    <Link href={"/astrology/sign/" + sign.id}>
                      {sign.meaning.en}
                    </Link>
                  </TableCell>

                  <TableCell scope="row">
                    <Link href={"/astrology/sign/" + sign.id}>
                      {JSON.stringify(sign.rulesFrom)}
                    </Link>
                  </TableCell>

                  <TableCell scope="row">
                    <Link href={"/astrology/sign/" + sign.id}>
                      {sign.planet?.name.en.en}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
