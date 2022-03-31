import db from "gongo-client";
import HTTPTransport from "gongo-client/lib/transports/http";
import GongoAuth from "gongo-client/lib/auth";

db.extend("auth", GongoAuth);

function defineTransport() {
  db.extend("transport", HTTPTransport, {
    // pollInterval: 60 * 1000,
    pollInterval: false,
    pollWhenIdle: false,
    idleTimeout: 60 * 1000,
  });

  const _origPoll = db.transport._poll.bind(db.transport);
  db.transport._poll = async function () {
    const userId = db.auth.getUserId();
    if (userId) {
      const result = db
        .collection("studySet")
        .update({ userId: { $exists: false } }, { $set: { userId } });
      console.log(result);
    }
    return await _origPoll();
  };
}

function enableNetwork() {
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

//db.subscribe("user");
// db.collection("users").persist();

// db.subscribe("files");
// db.collection("files").persist();

// db.collection("cache", { isLocalCollection: true }).persist();

db.collection("studySet" /*{ isLocalCollection: true }*/).persist();

if (typeof window !== "undefined") window.db = db;

export { enableNetwork };
export default db;
