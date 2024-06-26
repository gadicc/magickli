import type { Filter, Document } from "mongodb";
import {
  CollectionEventProps,
  userIsAdmin,
  userIdMatches,
} from "gongo-server-db-mongo/lib/collection";
import gs, { ObjectId /* User */ } from "../../src/api-lib/db";
import { ChangeSetUpdate } from "gongo-server/lib/DatabaseAdapter";

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

gs.publish("docs", async (db, opts, { auth }) => {
  const userId = await auth.userId();
  const user =
    userId && (await db.collection("users").findOne({ _id: userId }));

  let query = { groupId: { $exists: false } } as Filter<Document>;

  if (user && user.groupIds)
    query = { $or: [query, { groupId: { $in: user.groupIds } }] };

  return db.collection("docs").find(query);
});

// TODO, don't publish secrets :)
// gs.publish("accounts", (db) => db.collection("accounts").find());
gs.publish("accounts", (db) => []);

gs.publish("files", (db) => db.collection("files").find());

/*
gs.publish("file", async (db, opts) => {
  // TODO, filter opts for sourceUrl, sha256, filename, etc
  //return db.collection("files").find(opts).limit(1);   TODO gongo-server
  const file = await db.collection("files").findOne(opts);
  return [{ coll: "files", entries: [file] }];
});
*/

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
  if (!user?.admin) return [];

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

  if (user?.admin) return db.collection("userGroups").find();

  if (user?.groupAdminIds)
    return db
      .collection("userGroups")
      .find({ _id: { $in: user.groupAdminIds.map(ObjectId) } });
  else return [];

  if (!user?.admin) return [];
});

gs.publish("doc", async (db, opts, { auth }) => {
  const userId = await auth.userId();
  if (!userId) return [];

  const _id = opts && opts._id;
  const user = await db.collection("users").findOne({ _id: userId });
  const doc = await db.collection("docs").findOne({ _id });
  if (!doc) return [];

  if (!doc.groupId || user?.admin || user?.groupIds.includes(doc.groupId))
    return [
      {
        coll: "docs",
        entries: [doc],
      },
    ];

  return [];
});

async function templeAdminHelper(auth, db, templeIdStr) {
  const userId = await auth.userId();
  if (!userId) return { userId, isTempleAdmin: false };

  const templeId = new ObjectId(templeIdStr);

  const membership = await db.collection("templeMemberships").findOne({
    userId,
    templeId,
  });
  let isTempleAdmin = membership?.admin || false;

  if (!isTempleAdmin) {
    const user = await db.collection("users").findOne({ _id: userId });
    if (user.admin) isTempleAdmin = true;
  }

  return { userId, isTempleAdmin, templeId };
}

gs.publish("templesForAdmins", async (db, opts, { auth }) => {
  const userId = await auth.userId();
  if (!userId) return [];

  const user = await db.collection("users").findOne({ _id: userId });
  if (user?.admin) return db.collection("temples").find();

  const templeIds = (
    await db
      .collection("templeMemberships")
      .find({ userId, admin: true })
      .project({ templeId: true })
      .toArray()
  ).map((tm) => tm.templeId);

  return db.collection("temples").find({ _id: { $in: templeIds } });
});

gs.publish("templeForTempleAdmin", async (db, { _id }, { auth }) => {
  const { isTempleAdmin, templeId } = await templeAdminHelper(auth, db, _id);
  if (!isTempleAdmin) return [];
  return db.collection("temples").find({ _id: templeId }).limit(1);
});

gs.publish("usersForTempleAdmin", async (db, { _id }, { auth }) => {
  const { userId, isTempleAdmin } = await templeAdminHelper(auth, db, _id);
  if (!isTempleAdmin) return [];

  const memberships = await db
    .collection("templeMemberships")
    .find({ templeId: new ObjectId(_id), userId: { $ne: userId } })
    .toArray();

  return [
    {
      coll: "templeMemberships",
      entries: memberships,
    },
    {
      coll: "users",
      entries: await db
        .collection("users")
        .find({ _id: { $in: memberships.map((m) => m.userId) } })
        .project({ _id: true, displayName: true, emails: true })
        .toArray(),
    },
  ];
});

async function userIsGroupAdmin(
  doc: Document | ChangeSetUpdate | string,
  { dba, auth, collection }: CollectionEventProps
) {
  const userId = await auth.userId();
  if (!userId) return "NOT_LOGGED_IN";

  const user = await dba.collection("users").findOne({ _id: userId });
  if (!user) return "USER_NOT_FOUND";

  if (typeof doc === "object" && "patch" in doc) {
    // Update
    const existingDoc = await collection.findOne(doc._id);
    if (!existingDoc) return "NO_EXISTING_DOC";
    // return userId.equals(existingDoc.userId) || "doc.userId !== userId";
    // @ts-expect-error: ok
    return doc.groupId &&
      // @ts-expect-error: ok
      !(user.groupAdminIds && user.groupAdminIds.includes(doc.groupId))
      ? "not in group"
      : true;
  }

  // DELETES (doc is an ObjectId)
  if (doc instanceof ObjectId || typeof doc === "string") {
    const docId = typeof doc === "string" ? new ObjectId(doc) : doc;
    const existingDoc = await collection.findOne(docId);
    if (!existingDoc) return "NO_EXISTING_DOC";
    return (
      userId.equals(existingDoc.userId) || "doc.userId !== userId (for delete)"
    );
  }

  console.log({ doc, userId });
  // return userId.equals(doc.userId) || "doc.userId !== userId";
  return doc.groupId &&
    !(user.groupAdminIds && user.groupAdminIds.includes(doc.groupId))
    ? "not in group"
    : true;
}

if (gs.dba) {
  const db = gs.dba;

  const studySet = db.collection("studySet");
  studySet.allow("insert", userIdMatches);
  studySet.allow("update", userIdMatches);
  studySet.allow("remove", userIdMatches);

  for (const collName of ["users", "userGroups", "temples"]) {
    const coll = db.collection(collName);
    coll.allow("insert", userIsAdmin);
    coll.allow("update", userIsAdmin);
    coll.allow("remove", userIsAdmin);
  }

  const docs = db.collection("docs");
  docs.allow("insert", userIsGroupAdmin);
  docs.allow("update", userIsGroupAdmin);
  docs.allow("remove", userIsGroupAdmin);
}

const handler = gs.expressPost();
export default handler;
