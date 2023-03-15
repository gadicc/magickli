const GongoServer = require("gongo-server/lib/serverless").default;
const Database = require("gongo-server-db-mongo").default;
const ObjectID = require("gongo-server-db-mongo").ObjectID;

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1";

const gs = new GongoServer({
  db: new Database(MONGO_URL, "magickli"),
});

// gs.db.Users.ensureAdmin("dragon@wastelands.net", "initialPassword");

gs.publish("studySet", async (db, opts, updatedAt, auth, req) => {
  const userId = await auth.userId();
  console.log({ userId });
  if (!userId) return [];

  const cursor = db.collection("studySet").find({ userId: ObjectID(userId) });

  const results = await cursor.toArray();
  console.log({ results });

  return cursor;
});

// TODO, don't publish secrets :)
gs.publish("accounts", (db) => db.collection("accounts").find());

gs.publish("files", (db) => db.collection("files").find());

gs.publish("file", async (db, opts, updatedAt, auth, req) => {
  // TODO, filter opts for sourceUrl, sha256, filename, etc
  //return db.collection("files").find(opts).limit(1);   TODO gongo-server
  const file = await db.collection("files").findOne(opts);
  return [{ coll: "files", entries: [file] }];
});

gs.publish("user", async (db, opts, updatedAt, auth, req) => {
  const userId = await auth.userId();
  if (!userId) return [];

  const fullUser = await db.collection("users").findOne({ _id: userId });
  const user = { ...fullUser };
  delete user.services;

  return [
    {
      coll: "users",
      entries: [user],
    },
  ];
});

module.exports = gs.express();
