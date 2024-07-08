"use client";
import React from "react";
import { useGongoSub, useGongoLive, db, useGongoOne } from "gongo-client-react";

import {
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
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
import {
  AdminPanelSettings,
  CheckBox,
  ContentCopy,
  Edit,
  Save,
  Share,
} from "@mui/icons-material";
import { QRCode } from "react-qrcode";

function JoinInfo({ temple }: { temple: Temple }) {
  const joinUrl =
    location.origin + `/temples/join/${temple.slug}/${temple.joinPass}`;
  const [editingJoinPass, setEditingJoinPass] = React.useState(false);
  const [joinPass, setJoinPass] = React.useState(temple.joinPass || "");
  const [justCopied, setJustCopied] = React.useState(false);

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
            To have members join, either:
            <ul>
              <li>Let them scan the adjacent QR code</li>
              <li>Send them the link below</li>
              <li>
                Direct them to the website, click on &quot;Temples&quot;, and
                enter the <i>slug</i> and <i>join pass</i> above.
              </li>
            </ul>
          </div>
          <div>
            <a href={joinUrl}>{joinUrl}</a>
            <IconButton
              disabled={justCopied}
              onClick={() => {
                navigator.clipboard.writeText(joinUrl);
                setJustCopied(true);
                setTimeout(() => setJustCopied(false), 2000);
              }}
            >
              {justCopied ? <CheckBox /> : <ContentCopy />}
            </IconButton>
            {"share" in navigator ? (
              <IconButton
                disabled={justCopied}
                onClick={() => {
                  const data = {
                    title: "Magick.ly",
                    text: "Join " + temple.name + " Temple",
                    url: joinUrl,
                  };
                  console.log(data);
                  navigator.share(data);
                }}
              >
                <Share />
              </IconButton>
            ) : null}
          </div>
        </div>
      ) : (
        <div>Set a join pass above to show the invite link and QR code</div>
      )}
    </div>
  );
}

function Users({ templeId }: { templeId: string }) {
  const [sortBy, setSortBy] = React.useState("addedAt");
  const [useMotto, setUseMotto] = React.useState(false);

  useGongoSub("userTemplesAndMemberships");
  useGongoSub("usersForTempleAdmin", { _id: templeId });

  const memberships = useGongoLive((db) =>
    db.collection("templeMemberships").find({ templeId })
  );

  const _users = React.useMemo(() => {
    return memberships.map((m) => ({
      ...db.collection("users").findOne({ _id: m.userId }),
      membership: m,
    }));
  }, [memberships]);

  const users = React.useMemo(() => {
    const users = [..._users];
    // @ts-expect-error: huh?
    users.sort((a, b) => {
      if (sortBy === "addedAt") {
        return a.membership.addedAt.getTime() - b.membership.addedAt.getTime();
      } else if (sortBy === "grade") {
        return a.membership.grade - b.membership.grade;
      } else if (sortBy === "name") {
        if (useMotto)
          return (
            (a.membership.motto || "").localeCompare(
              b.membership.motto || ""
            ) || (a.displayName || "").localeCompare(b.displayName || "")
          );
        return (a.displayName || "").localeCompare(b.displayName || "");
      }
    });
    return users;
  }, [_users, sortBy, useMotto]);

  return (
    <div>
      <Typography variant="h6">Users</Typography>
      <FormControl>
        <FormLabel id="sortBy-radio-buttons-group-label">Sort By</FormLabel>
        <RadioGroup
          aria-labelledby="sortBy-radio-buttons-group-label"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          name="radio-buttons-group"
          row
        >
          <FormControlLabel
            value="addedAt"
            control={<Radio />}
            label="Added at"
          />
          <FormControlLabel value="grade" control={<Radio />} label="Grade" />
          <FormControlLabel value="name" control={<Radio />} label="Name" />
        </RadioGroup>
      </FormControl>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={useMotto}
              onChange={(e) => setUseMotto(e.target.checked)}
            />
          }
          label="Motto"
        />
      </FormGroup>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={50}>Grade</TableCell>
              <TableCell>{useMotto ? "Motto" : "Name"}</TableCell>
              <TableCell>Added</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.membership.grade}{" "}
                  {user.membership.admin ? (
                    <AdminPanelSettings
                      fontSize="small"
                      sx={{ verticalAlign: "bottom" }}
                    />
                  ) : null}
                </TableCell>
                <TableCell>
                  {useMotto
                    ? user.membership.motto || "(" + user.displayName + ")"
                    : user.displayName}{" "}
                </TableCell>
                <TableCell>
                  {user.membership.addedAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    href={`/temples/admin/${templeId}/membership/${user.membership._id}`}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default function AdminTemplesPage({ params: { _id } }) {
  useGongoSub("templeForTempleAdmin", { _id });
  const temple = useGongoOne((db) => db.collection("temples").find({ _id }));
  if (!temple) return <div>Temple loading or not found...</div>;

  return (
    <>
      <Container sx={{ my: 2 }}>
        <Typography variant="h5">{temple?.name} Temple</Typography>
        <br />
        <JoinInfo temple={temple} />
        <br />
        <Users templeId={_id} />
      </Container>
    </>
  );
}
