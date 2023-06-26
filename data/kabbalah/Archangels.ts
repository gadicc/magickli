import type { Planet, PlanetId } from "../astrology/Planets";

type ArchangelId =
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
  id: ArchangelId;
  name: LangObject;
  planetId: PlanetId;
  planet?: Planet;
}

type Archangels = {
  [key in ArchangelId]: Archangel;
};

const archangels: Archangels = require("./archangels.json5").default;

export type { Archangel, Archangels, ArchangelId };
export default archangels;
