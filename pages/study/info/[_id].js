import React from "react";
import { useRouter } from "next/router";
import {
  useGongoOne,
  useGongoIsPopulated,
  useGongoSub,
} from "gongo-client-react";
import { formatDistance } from "date-fns";

import {
  Box,
  Container,
  Paper,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Typography,
} from "@mui/material";

import AppBar from "../../../components/AppBar";
import db from "../../../src/db.js";

const StudySetCol = db.collection("studySet");

export default function StudyInfo() {
  const router = useRouter();
  const { _id } = router.query;
  const isPopulated = useGongoIsPopulated();

  const studyData = useGongoOne((db) =>
    db.collection("studySet").find({ setId: _id })
  );
  useGongoSub("studySet");

  console.log({ studyData });

  if (!isPopulated) return <div>Initializing...</div>;
  if (!studyData) return <div>Loading...</div>;

  return (
    <Box>
      <AppBar title="Study Info" />

      <Container sx={{ p: 2 }}>
        <Typography variant="h4">{studyData.setId}</Typography>
        <br />
        <Typography variant="h6">Stats</Typography>
        <TableContainer component={Paper} sx={{ width: "200px" }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Total time:</TableCell>
                <TableCell>{formatDistance(0, studyData.time)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Correct:</TableCell>
                <TableCell>{studyData.correct}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Incorrect:</TableCell>
                <TableCell>{studyData.incorrect}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Grade:</TableCell>
                <TableCell>
                  {Math.round(
                    (studyData.correct /
                      (studyData.correct + studyData.incorrect)) *
                      100
                  ) + "%"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
