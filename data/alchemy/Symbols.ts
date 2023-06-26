import { PlanetId } from "../astrology/Planets";

type AlchemySymbolID =
  | "sulphur"
  | "mercury"
  | "salt"
  | "lead"
  | "tin"
  | "iron"
  | "gold"
  | "copper"
  | "quicksilver"
  | "silver";

type LangObject = { en?: string };

interface AlchemySymbol {
  id: AlchemySymbolID;
  symbol: string; // "🜩",
  altSymbol: string; // "♃",
  name: {
    en: string;
  };
  category: "planets" | "principles";
  planetId?: PlanetId;
  gdGrade?: number; // 1,
}

type AlchemySymbols = {
  [key in AlchemySymbolID]: AlchemySymbol;
};

const alchemySymbols: AlchemySymbols = require("./symbols.json5").default;

export type { AlchemySymbol, AlchemySymbols, AlchemySymbolID };
export default alchemySymbols;
