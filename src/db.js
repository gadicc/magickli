import db from "gongo-client";
// import HTTPTransport from "gongo-client/lib/transports/http";
// import GongoAuth from "gongo-client/lib/auth";

/*
db.extend("auth", GongoAuth);
db.extend("transport", HTTPTransport, {
  pollInterval: 60 * 1000,
  pollWhenIdle: false,
  idleTimeout: 60 * 1000,
});
*/

//db.subscribe("user");
// db.collection("users").persist();

// db.subscribe("files");
// db.collection("files").persist();

// db.collection("cache", { isLocalCollection: true }).persist();

db.collection("studySet", { isLocalCollection: true }).persist();

if (typeof window !== "undefined") window.db = db;

export default db;
