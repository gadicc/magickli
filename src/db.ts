import db, { Collection } from "gongo-client";
import HTTPTransport from "gongo-client/lib/transports/http";
import GongoAuth from "gongo-client/lib/auth";
import { StudySetStats } from "../pages/study/[_id]";
import type { User } from "./schemas/user";
import type { UserGroup } from "./schemas/userGroup";

db.extend("auth", GongoAuth);

function defineTransport() {
  db.extend("transport", HTTPTransport, {
    // pollInterval: 60 * 1000,
    pollInterval: false,
    pollWhenIdle: false,
    idleTimeout: 60 * 1000,
  });

  /*
   * A bit hacky (TODO, appropriate hook in Gongo)
   * If we previously created studySets before ever enabling network,
   * the documents won't have a userId.  So, before any poll, update
   * any docs without a userId with our userId.
   */
  // @ts-expect-error: ok
  const _origPoll = db.transport._poll.bind(db.transport);
  // @ts-expect-error: ok
  db.transport._poll = async function () {
    // @ts-expect-error: ok
    const userId = db.auth.getUserId();
    if (userId) {
      const result = db
        .collection("studySet")
        .update(
          { userId: { $exists: false } },
          { $set: { userId }, $push: { __ObjectIDs: "userId" } }
        );
      // console.log(result);
    }
    return await _origPoll();
  };
  // @ts-expect-error: ok
  db.transport.poll();
}

function enableNetwork() {
  // @ts-expect-error: ok
  if (db.transport) {
    console.warn("enableNetwork() called but transport already exists");
    return;
  }

  const network = db.gongoStore.findOne("network");
  if (network) db.gongoStore.update("network", { $set: { enabled: true } });
  else db.gongoStore.insert({ _id: "network", enabled: true });

  defineTransport();
}

if (typeof window !== "undefined")
  setTimeout(() => {
    db.idb.on("collectionsPopulated", () => {
      const network = db.gongoStore.findOne("network");
      if (network?.enabled) {
        console.log("gongoStore.network.enabled is set");
        defineTransport();
      }
    });
  }, 10);

/*
 */

db.subscribe("user");
db.collection("users").persist();
db.collection("userGroups").persist();

// db.subscribe("files");
// db.collection("files").persist();

// db.collection("cache", { isLocalCollection: true }).persist();

db.collection("studySet" /*{ isLocalCollection: true }*/).persist();

declare module "gongo-client" {
  class Database {
    collection(name: "studySet"): Collection<StudySetStats>;
    collection(name: "users"): Collection<User>;
    collection(name: "userGroups"): Collection<UserGroup>;
  }
}

// @ts-expect-error: i know
if (typeof window !== "undefined") window.db = db;

export { enableNetwork };
export default db;
