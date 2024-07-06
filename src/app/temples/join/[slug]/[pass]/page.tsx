import React from "react";
import { Container, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { headers as _headers } from "next/headers";
import { db, ObjectId } from "@/api-lib/db";

function Page({ message, error }: { message: string; error?: boolean }) {
  return (
    <Container sx={{ my: 2 }}>
      <Typography variant="h5">Join Temple</Typography>
      <p style={{ color: error ? "red" : "" }}>{message}</p>
      <a href="/temples">Back to temples page.</a>
    </Container>
  );
}

export default async function TemplesJoinPage({
  params: { slug, pass },
}: {
  params: { slug: string; pass: string };
}) {
  const session = await getServerSession(authOptions);
  console.log({ session });

  if (!session) {
    const callbackUrl = "/temples/join/" + slug + "/" + pass;
    const searchParams = new URLSearchParams({ callbackUrl });
    const url = "/api/auth/signin?" + searchParams.toString();
    redirect(url);
  }

  const temple = await db
    .collection("temples")
    .findOne({ slug, joinPass: pass });

  if (!temple) return <Page error message="No such temple and/or code." />;

  const userId = new ObjectId(session.user.id);

  const exinstingMembership = await db
    .collection("templeMemberships")
    .findOne({ templeId: temple._id, userId });

  console.log(exinstingMembership);

  if (exinstingMembership)
    return <Page error message="You are already a member of this temple." />;

  await db.collection("templeMemberships").insertOne({
    userId,
    templeId: temple._id,
    grade: 0,
  });

  return <Page message="You have successfully joined the temple." />;
}
