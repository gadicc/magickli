import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Discourse from "discourse2";

const discourse = new Discourse("https://forums.magick.ly", {
  "Api-Key": process.env.DISCOURSE_API_KEY,
  "Api-Username": "system",
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ $error: { code: "NOT_LOGGED_IN" } });
  if (!session.user.admin)
    return NextResponse.json({ $error: { code: "NOT_ADMIN" } });

  return NextResponse.json({ $error: { code: "NOT_IMPLEMENTED" } });
} /*

/*
gs.method("syncDiscourse", async (db, opts = {}, { auth }) => {
  const userId = await auth.userId();
  if (!userId) return { success: false, message: "Not logged in" };

  const user = await db.collection("users").findOne({ _id: userId });
  if (!user?.admin) return { success: false, message: "Not an admin" };

  const templeIdStr = opts.templeId;
  if (!templeIdStr) return { success: false, message: "No templeId" };
  const templeId = new ObjectId(templeIdStr);

  const memberships = await db
    .collection("templeMemberships")
    .find({ templeId })
    .toArray();

  const users = await db
    .collection("users")
    .find({ _id: { $in: memberships.map((m) => m.userId) } })
    .toArray();

  console.log("users", users);

  /*
  const users = await db.collection("users").find().toArray();
  for (const user of users) {
    if (user.discourseUsername) {
      await discourse.syncGroups(user.discourseUsername, user.groupIds);
    }
  }
  */ /*

  return { success: true, message: "Success" };
});


*/
