import type { Planet, PlanetID } from "../astrology/Planets";

type ArchangelID =
  | "kassiel"
  | "sachiel"
  | "zamael"
  | "michael"
  | "anael"
  | "raphael"
  | "gabriel"
  | "uriel";

type LangObject = { he: string; roman: string };

interface Archangel {
  id: ArchangelID;
  name: LangObject;
  planetId: PlanetID;
  planet?: Planet;
}

type Archangels = {
  [key in ArchangelID]: Archangel;
};

const archangels: Archangels = require("./archangels.json5").default;

export type { Archangel, Archangels, ArchangelID };
export default archangels;
