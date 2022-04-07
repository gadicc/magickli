import React, { useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import AppBar from "../../components/AppBar";
import Data from "../../data/data";
import Link from "../../src/Link";

const docs = [
  {
    id: "neophyte",
    name: "0=0 Grade of the Neophyte",
  },
];

export default function Grades() {
  const navParts = [{ title: "HOGD", url: "/hogd" }];

  return (
    <>
      <AppBar title="Rituals" navParts={navParts} />
      <Container maxWidth="sm">
        <Box>
          <p>
            A collection of well publicized documents, remodelled for clearer
            visibility and various form factors (e.g. mobile).
          </p>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {docs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell scope="row">
                      <Link href={"/doc/" + doc.id} color="secondary">
                        {doc.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <p>
            Note: You'll only find material here that is readily available
            elsewhere. However, if you're the head of an order and want private
            materials made available securely to your members, please contact
            me.
          </p>
          <p>
            Image credit:{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Anxfisa_Golden_Dawn_Robes.jpg">
              Anxfisa Golden Dawn Robes.jpg
            </a>{" "}
            (CC BY-SA 3.0).
          </p>
        </Box>
      </Container>
    </>
  );
}
