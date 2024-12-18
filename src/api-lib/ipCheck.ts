// import IPData from "ipdata";
import type { NextRequest } from "next/server";
import { ipAddress } from "@vercel/functions";

/*
let ipdata: IPData | null = null;
if (typeof window !== "object") {
  if (!process.env.IPDATA_API_KEY)
    throw new Error("IPDATA_API_KEY not set in env");

  ipdata = new IPData(process.env.IPDATA_API_KEY);
}
*/

// taken from gongo;
// TODO: export a method like this from gongo-server, that accepts x-fw number.
function ipFromReq(req: NextRequest) {
  return ipAddress(req);
  /*
  if ("ip" in req && req.ip) {
    console.log("req.ip", (req as NextRequest).ip);
    return (req as NextRequest).ip;
  }

  // TODO, doesn't work on edge.
  let ip;
  if (req.headers instanceof Headers) {
    ip = req.headers.get("x-forwarded-for");
    if (ip) ip = ip.split(",")[0].trim();
  } else if (req.headers["x-forwarded-for"]) {
    if (typeof req.headers["x-forwarded-for"] === "string")
      ip = req.headers["x-forwarded-for"].split(",")[0].trim();
    else ip = req.headers["x-forwarded-for"][0];
  } else if ("socket" in req && req.socket.remoteAddress) {
    ip = req.socket.remoteAddress;
  } else if (
    "connection" in req &&
    req.connection !== null &&
    typeof req.connection === "object"
  ) {
    ip = req.connection.remoteAddress;
  }
  if (!ip)
    throw new Error("Could not get IP from req.{headers,socket,connection}");
  return ip;
  */
}

async function ipPass(_ip: string) {
  // pass all for now.
  return true;

  /*
  if (!ipdata) return false;
  const data = await ipdata.lookup(ip);
  const { threat } = data;
  console.log(data);

  if (threat.is_threat) return false;
  if (threat.is_known_abuser) return false;
  if (threat.is_known_attacker) return false;

  // @ts-expect-error: does exist
  const scores = threat.scores;
  // Trust: < 40 high risk, 40-60 medium, > 60 low
  if (scores.trust_score < 40) return false; /// was 60
  if (scores.threat_score > 50) return false; // was 30

  // Temporarily ban Iran during current attack.
  if (data.country_code === "IR") return false;

  // @ts-expect-error: does exist
  if (threat.is_datacenter) return false;
  if (data.asn.name.match(/DigitalOcean|Hetzner|OVH/)) return false;

  return true;
  */
}

export { ipFromReq, ipPass };
