import React, { useState } from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import Copyright from '../../src/Copyright';

import AppBar from '../../components/AppBar';
import planets from '../../data/astrology/planets.json5';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function Planets() {
  const classes = useStyles();
  const navParts = [ { title: 'Astrology', url: '/astrology' } ];
  console.log(planets);

  return (
    <>
      <AppBar title="Sephirot" navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>

          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">

              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell>English</TableCell>
                  <TableCell>Hebrew</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  Object.values(planets).map(planet => (
                    <TableRow key={planet.id}>

                      <TableCell scope="row">
                        <Link href={"/astrology/planet/"+planet.id} color="secondary">
                          {planet.symbol}
                        </Link>
                      </TableCell>

                      <TableCell scope="row">
                        <Link href={"/astrology/planet/"+planet.id} color="secondary">
                          {planet.name.en.en}
                        </Link>
                      </TableCell>

                      <TableCell scope="row">
                        <Link href={"/astrology/planet/"+planet.id} color="secondary">
                          {planet.name.he ? planet.name.he.roman : ""}
                        </Link>
                      </TableCell>

                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>

          <br />

          <div>
            <b>Image credit:</b>
            <a href="https://en.wikipedia.org/wiki/File:Planets2013.svg">
              Planet2013.svg
            </a>
            {" "}
            from Wikimedia Commons, released under CC-BY-SA 2.5.
          </div>

        </Box>
      </Container>
    </>
  );
}
