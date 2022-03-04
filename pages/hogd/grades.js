import React, { useState } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
