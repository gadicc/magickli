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
import Data from '../../data/data';

const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  },
});

export default function signs() {
  const classes = useStyles();
  const navParts = [ { title: 'Astrology', url: '/astrology' } ];

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
                {
                  Object.values(Data.zodiac).map(sign => (
                    <TableRow key={sign.id}>

                      <TableCell scope="row">
                        <Link href={"/astrology/sign/"+sign.id} color="secondary">
                          {sign.name.en} {sign.symbol}
                        </Link>
                      </TableCell>

                      <TableCell scope="row">
                        <Link href={"/astrology/sign/"+sign.id} color="secondary">
                          {sign.meaning.en}
                        </Link>
                      </TableCell>

                      <TableCell scope="row">
                        <Link href={"/astrology/sign/"+sign.id} color="secondary">
                          {JSON.stringify(sign.rulesFrom)}
                        </Link>
                      </TableCell>

                      <TableCell scope="row">
                        <Link href={"/astrology/sign/"+sign.id} color="secondary">
                          {sign.planet.name.en.en}
                        </Link>
                      </TableCell>

                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>

        </Box>
      </Container>
    </>
  );
}
