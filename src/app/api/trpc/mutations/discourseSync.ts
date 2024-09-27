import { auth } from "@/auth";
import Discourse from "discourse2";
import { z } from "zod";

import { publicProcedure } from "../trpc";
import { db, ObjectId } from "@/api-lib/db";

const discourse = new Discourse("https://forums.magick.ly", {
  "Api-Key": process.env.DISCOURSE_API_KEY,
  "Api-Username": "system",
});

export const discourseSync = publicProcedure
  .input(z.object({ templeId: z.string() }))
  .mutation(async function* ({ input: { templeId: templeIdStr } }) {
    const session = await auth();
    if (!session) return yield { message: "No session" };

    const { user } = session;
    if (!user) return yield { message: "Not logged in" };
    if (!user?.admin) return yield { message: "Not an admin" };

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
    */
    return yield { message: "Complete" };
  });
