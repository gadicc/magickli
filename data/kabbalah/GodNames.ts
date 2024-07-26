import type { Planet, PlanetId } from "../astrology/Planets";

type GodNameId =
  | "ehiyeh"
  | "yah"
  | "yhvh-elohim"
  | "el"
  | "elohim-gibor"
  | "yhvh-eloha-vedaat"
  | "yhvh-tzvaot"
  | "elohim-tzvaot"
  | "shadai-el-chai"
  | "adonai-haaretz";

type LangObject = { en: string; he: string; roman: string };

interface GodName {
  id: GodNameId;
  name: LangObject;
}

type GodNames = Record<GodNameId, GodName>;

const godNames: GodNames = require("./godNames.json5").default;

export type { GodName, GodNames, GodNameId };
export default godNames;
