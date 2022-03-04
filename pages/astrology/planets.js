import React, { useState } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import Copyright from '../../src/Copyright';

import MercuryWidget from '../../components/astrology/Mercury';
import MoonWidget from '../../components/astrology/Moon';

import AppBar from '../../components/AppBar';
import Tiles from '../../components/Tiles';
import Data from '../../data/data';

const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  },
});

const tiles = [
  {
    Component: MoonWidget,
    title: 'Moon ☾',
    to: 'moon'
  },
  {
    Component: MercuryWidget,
    title: 'Mercury ☿',
    to: 'planet/mercury'
  },
];



export default function Planets() {
  const classes = useStyles();
  const navParts = [ { title: 'Astrology', url: '/astrology' } ];

  return (
    <>
      <AppBar title="Planets" navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>

          <Tiles tiles={tiles} />

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
                  Object.values(Data.planet).map(planet => (
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
