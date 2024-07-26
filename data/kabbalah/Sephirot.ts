import type { Zodiac, ZodiacId } from "../astrology/Zodiac";
import type { Element, ElementId } from "../alchemy/Elements";
import { GodName, GodNameId } from "./GodNames";
import { Planet, PlanetId } from "../astrology/Planets";
import { Archangel, ArchangelId } from "./Archangels";
import { AngelicOrder, AngelicOrderId } from "./AngelicOrders";

type SephirahId =
  | "keter"
  | "chochmah"
  | "binah"
  | "hesed"
  | "gevurah"
  | "tiferet"
  | "netzach"
  | "hod"
  | "yesod"
  | "malchut";

interface Sephirah {
  id: SephirahId;
  index: number;
  name: { en: string; he: string; roman: string };
  color: {
    king: string;
    kingWeb: string;
    queen: string;
    queenWeb: string;
    queenWebText: string;
  };
  chakraId: string; // TODO, ChakraId
  godNameId: GodNameId;
  godName?: GodName;
  scent: string;
  body: string;
  bodyPos: string;
  planetId: PlanetId;
  planet?: Planet;
  tenHeavens: { en: string; he: string; roman: string };
  stone: string;
  archangelId: ArchangelId;
  archangel?: Archangel;
  soulId: string;
  angelicOrderId: AngelicOrderId;
  angelicOrder?: AngelicOrder;
  gdGradeId: string;
  prev?: string;
}

type Sephirot = Record<SephirahId, Sephirah>;

const sephirot: Sephirot = require("./sephirot.json5").default;

export type { Sephirah, Sephirot, SephirahId };
export default sephirot;
