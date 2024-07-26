import type { Zodiac, ZodiacId } from "../astrology/Zodiac";
import type { Element, ElementId } from "../alchemy/Elements";

type KerubId = "earth" | "air" | "water" | "fire";

interface Kerub {
  id: KerubId;
  title: { en: string };
  face: { en: string; he: string; roman: string };
  zodiacId: ZodiacId;
  zodiac?: Zodiac;
  elementId: ElementId;
  element?: Element;
}

type Kerubim = Record<KerubId, Kerub>;

const kerubim: Kerubim = require("./kerubim.json5").default;

export type { Kerub, Kerubim, KerubId };
export default kerubim;
