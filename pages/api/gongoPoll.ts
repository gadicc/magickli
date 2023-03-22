import gs, { ObjectId /* User */ } from "../../src/api-lib/db";
import {
  CollectionEventProps,
  userIsAdmin,
  userIdMatches,
} from "gongo-server-db-mongo/lib/collection";

// gs.db.Users.ensureAdmin("dragon@wastelands.net", "initialPassword");

gs.publish("studySet", async (db, opts, { auth }) => {
  const userId = await auth.userId();
  console.log({ userId });
  if (!userId) return [];

  const cursor = db
    .collection("studySet")
    .find({ userId: new ObjectId(userId) });

  const results = await cursor.toArray();
  console.log({ results });

  return cursor;
});

// TODO, don't publish secrets :)
gs.publish("accounts", (db) => db.collection("accounts").find());

gs.publish("files", (db) => db.collection("files").find());

gs.publish("file", async (db, opts) => {
  // TODO, filter opts for sourceUrl, sha256, filename, etc
  //return db.collection("files").find(opts).limit(1);   TODO gongo-server
  const file = await db.collection("files").findOne(opts);
  return [{ coll: "files", entries: [file] }];
});

gs.publish("user", async (db, opts, { auth }) => {
  const userId = await auth.userId();
  if (!userId) return [];

  const fullUser = await db.collection("users").findOne({ _id: userId });
  const user = { ...fullUser };
  delete user.services;
  delete user.password;

  return [
    {
      coll: "users",
      entries: [user],
    },
  ];
});

gs.publish("users", async (db, opts, { auth }) => {
  const userId = await auth.userId();
  if (!userId) return [];

  const user = await db.collection("users").findOne({ _id: userId });
  if (!user.admin) return [];

  const query = {};
  const realUsers = await db.collection("users").getReal();
  const users = await realUsers
    .find(query, {
      projection: {
        _id: true,
        emails: true,
        displayName: true,
        admin: true,
        groupIds: true,
        groupAdminIds: true,
        __updatedAt: true,
      },
    })
    .toArray();

  return users.length
    ? [
        {
          coll: "users",
          entries: users,
        },
      ]
    : [];
});

gs.publish("userGroups", async (db, opts, { auth }) => {
  const userId = await auth.userId();
  if (!userId) return [];

  const user = await db.collection("users").findOne({ _id: userId });
  if (!user.admin) return [];

  return db.collection("userGroups").find();
});

if (gs.dba) {
  const db = gs.dba;

  const studySet = db.collection("studySet");
  studySet.allow("insert", userIdMatches);
  studySet.allow("update", userIdMatches);
  studySet.allow("remove", userIdMatches);

  for (const collName of ["users", "userGroups"]) {
    const coll = db.collection(collName);
    coll.allow("insert", userIsAdmin);
    coll.allow("update", userIsAdmin);
    coll.allow("remove", userIsAdmin);
  }
}

module.exports = gs.expressPost();
