import React, { useState } from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import AppBar from '../../components/AppBar';
import GradeTree from '../../components/hogd/GradeTree';
import Data from '../../data/data';
import Link from '../../src/Link';

export default function Grades() {
  const navParts = [ { title: 'HOGD', url: '/hogd' } ];

  return (
    <>
      <AppBar title="Grades" navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>

          <GradeTree />

          <TableContainer component={Paper}>
            <Table aria-label="simple table">

              <TableHead>
                <TableRow>
                  <TableCell>Grade</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  Object.values(Data.gdGrade).map(grade => (
                    <TableRow key={grade.id}>

                      <TableCell scope="row">
                        <Link href={"/hogd/grade/"+grade.id} color="secondary">
                          {grade.id}
                        </Link>
                      </TableCell>

                      <TableCell scope="row">
                        <Link href={"/hogd/grade/"+grade.id} color="secondary">
                          {grade.name}
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
