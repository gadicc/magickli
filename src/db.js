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
}

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

export { defineTransport };
export default db;
