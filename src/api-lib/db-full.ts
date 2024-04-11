import GongoServer from "gongo-server/lib/serverless";
import MongoDBA from "gongo-server-db-mongo";
import Auth from "gongo-server/lib/auth-class";
import Database, { /* Collection, */ ObjectId } from "gongo-server-db-mongo";
import { MongoClient } from "mongodb";

import type { User } from "../schemas";

const env = process.env;
const MONGO_URL = env.MONGO_URL || "mongodb://127.0.0.1";

const gs = new GongoServer({
  dba: new MongoDBA(MONGO_URL, "magickli", MongoClient),
});

const db = gs.dba;
const dba = gs.dba;

export { db, dba, Auth, Database, ObjectId, User };
export default gs;
