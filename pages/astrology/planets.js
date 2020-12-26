import React, { useState } from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

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

import MercuryWidget from '../../components/astrology/Mercury';
import MoonWidget from '../../components/astrology/Moon';

import AppBar from '../../components/AppBar';
import Data from '../../data/data';

const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  },
});

const tileData = [
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

          <GridList cellHeight={180} className={classes.gridList} spacing={0}>
            {tileData.map(tile => (
              <GridListTile key={tile.to} component={Link} href={tile.to}>
                {
                  tile.img
                  ? <img src={tile.img} alt={tile.title} />
                  : <tile.Component />
                }
                <GridListTileBar className={classes.tileBar} title={tile.title} />
              </GridListTile>
            ))}
          </GridList>

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
