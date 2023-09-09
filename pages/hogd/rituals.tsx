import React, { useState } from "react";
import {
  db,
  useGongoOne,
  useGongoUserId,
  useGongoSub,
  useGongoLive,
} from "gongo-client-react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

import AppBar from "../../components/AppBar";
import Data from "../../data/data";
import Link from "../../src/Link";
import { prepare } from "../../src/doc/prepare";

const builtInDocs = [
  {
    _id: "neophyte",
    title: "0=0 Grade of the Neophyte",
  },
  {
    _id: "zelator",
    title: "1=10 Grade of the Zelator",
  },
];

function DocAdmin() {
  const userId = useGongoUserId() as string;
  const user = useGongoOne((db) =>
    db.collection("users").find({ _id: userId })
  );

  const groups = useGongoLive((db) => db.collection("userGroups").find());
  useGongoSub("userGroups");

  const [title, setTitle] = React.useState("");
  const [groupId, setGroupId] = React.useState("");

  if (!(user && user.groupAdminIds && user.groupAdminIds.length)) return null;

  function addNew(event: React.SyntheticEvent) {
    event.preventDefault();

    const doc = {
      title,
      doc: { children: [] },
      userId,
      groupId,
      createdAt: new Date(),
    } as {
      title: string;
      doc: { children: [] }; // TODO
      userId: string;
      groupId?: string;
      createdAt: Date;
    };
    if (!groupId || groupId === "" || groupId === "public") delete doc.groupId;

    console.log(doc);
    // @ts-expect-error: todo optId in gongo
    db.collection("docs").insert(doc);
    setTitle("");
  }

  return (
    <Box>
      <br />
      <Typography variant="h6" sx={{ my: 1 }}>
        Create Doc
      </Typography>
      <form onSubmit={addNew}>
        <TextField
          label="Title"
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />{" "}
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel id="select-label-groupId">Group</InputLabel>
          <Select
            value={groupId}
            labelId="select-label-groupId"
            label="Group"
            onChange={(e) => setGroupId(e.target.value)}
          >
            <MenuItem value="none">None (Public)</MenuItem>
            {user &&
              user.groupAdminIds &&
              user.groupAdminIds.map((gid) => (
                <MenuItem key={gid} value={gid}>
                  {db.collection("userGroups").findOne(gid)?.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button type="submit" disabled={title === ""}>
          Add
        </Button>
      </form>
    </Box>
  );
}

async function editDoc(id) {
  const contents = prompt("Paste contents");
  if (!contents) return;

  const prepared = prepare(contents);
  db.collection("docs").update(id, {
    $set: {
      doc: prepared,
    },
  });
}

export default function Rituals() {
  const userId = useGongoUserId() as string;
  const user = useGongoOne((db) =>
    db.collection("users").find({ _id: userId })
  );

  useGongoSub("docs");
  const navParts = [{ title: "HOGD", url: "/hogd" }];
  const dbDocs = useGongoLive((db) => db.collection("docs").find());
  const docs = [...builtInDocs, ...dbDocs] as unknown as typeof dbDocs;

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
                  <TableRow key={doc._id}>
                    <TableCell scope="row">
                      <Link href={"/doc/" + doc._id} color="secondary">
                        {doc.title}
                      </Link>{" "}
                      {user &&
                        user.groupAdminIds &&
                        user.groupAdminIds.includes(doc.groupId) && (
                          <IconButton
                            size="small"
                            onClick={() => editDoc(doc._id)}
                          >
                            <Edit />
                          </IconButton>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <DocAdmin />
          <br />
          <p>
            Note: You&apos;ll only find material here that is readily available
            elsewhere. However, if you&apos;re the head of an order and want
            private materials made available securely to your members, please
            contact me.
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
