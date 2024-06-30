"use client";
import React from "react";
import { useGongoSub, useGongoLive, db } from "gongo-client-react";
import slug from "slug";

import { Container, Typography } from "@mui/material";

import "@/db";

export default function AdminTemplesPage() {
  useGongoSub("templesForAdmins");
  const temples = useGongoLive((db) => db.collection("temples").find());
  const [newTempleName, setNewTempleName] = React.useState("");

  function addTemple() {
    const insertedDoc = db
      .collection("temples")
      .insert({ name: newTempleName, slug: slug(newTempleName) });
    setNewTempleName("");
  }

  return (
    <Container sx={{ my: 2 }}>
      <Typography variant="h5">Temples</Typography>
      <ol>
        {temples.map((temple) => (
          <li key={temple._id} style={{ marginBottom: 5 }}>
            <a href={"/admin/temples/" + temple._id}>{temple.name}</a>
          </li>
        ))}
        <li>
          <input
            type="text"
            value={newTempleName}
            onChange={(e) => setNewTempleName(e.target.value)}
          />{" "}
          <button onClick={addTemple} disabled={!newTempleName}>
            Add
          </button>
        </li>
      </ol>
    </Container>
  );
}
