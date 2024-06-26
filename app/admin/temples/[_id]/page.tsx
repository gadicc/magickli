"use client";
import React from "react";
import { useGongoSub, useGongoLive, db, useGongoOne } from "gongo-client-react";

import {
  Container,
  Icon,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import "@/db";
import { Temple } from "@/schemas";
import { Edit, Save } from "@mui/icons-material";
import { QRCode } from "react-qrcode";

function Users({ templeId }: { templeId: string }) {
  useGongoSub("usersForTempleAdmin", { _id: templeId });
  const memberships = useGongoLive((db) =>
    db.collection("templeMemberships").find({ templeId })
  );

  const users = React.useMemo(() => {
    return memberships.map((m) => ({
      ...db.collection("users").findOne({ _id: m.userId }),
      membership: m,
    }));
  }, [memberships]);

  return (
    <div>
      <Typography variant="h6">Users</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={50}>Grade</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.membership.grade}
                </TableCell>
                <TableCell>{user.displayName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function JoinInfo({ temple }: { temple: Temple }) {
  const joinUrl = location.origin + `/join/${temple.slug}/${temple.joinPass}`;
  const [editingJoinPass, setEditingJoinPass] = React.useState(false);
  const [joinPass, setJoinPass] = React.useState(temple.joinPass || "");

  return (
    <div>
      <Typography variant="h6">Join Info</Typography>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" width={100} align="right">
                Slug
              </TableCell>
              <TableCell>{temple?.slug}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row" align="right">
                Join Pass
              </TableCell>
              <TableCell>
                {" "}
                {editingJoinPass ? (
                  <div>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        console.log("update join pass");
                        db.collection("temples").update(temple._id, {
                          $set: { joinPass },
                        });
                        setEditingJoinPass(false);
                      }}
                    >
                      <TextField
                        size="small"
                        value={joinPass}
                        onChange={(e) => setJoinPass(e.target.value)}
                      />{" "}
                      <IconButton type="submit">
                        <Save />
                      </IconButton>
                    </form>
                  </div>
                ) : (
                  <div>
                    {temple?.joinPass || "(none)"}
                    <IconButton onClick={() => setEditingJoinPass(true)}>
                      <Edit />
                    </IconButton>
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <br />

      {temple.joinPass ? (
        <div>
          <QRCode value={joinUrl} style={{ float: "right" }} />
          <div>
            To have members join, have them <b>first</b> sign up on the sign,
            and <b>then</b> either 1) send them this link, 2) have them scan the
            QR code, or 3) have them click on their avatar, choose "Account", in
            the "Temple Memberships" section, enter the Slug and Join Pass.
          </div>
          <br />
          <div>
            <a href={joinUrl}>{joinUrl}</a>
          </div>
        </div>
      ) : (
        <div>Set a join pass above to show the invite link and QR code</div>
      )}
    </div>
  );
}

export default function AdminTemplesPage({ params: { _id } }) {
  useGongoSub("templeForTempleAdmin", { _id });
  const temple = useGongoOne((db) => db.collection("temples").find({ _id }));
  if (!temple) return <div>Temple loading or not found...</div>;

  return (
    <Container sx={{ my: 2 }}>
      <Typography variant="h5">{temple?.name} Temple</Typography>
      <br />
      <JoinInfo temple={temple} />
      <br />
      <Users templeId={_id} />
    </Container>
  );
}
