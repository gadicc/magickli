import { HebrewLetter, HebrewLetterId } from "../HebrewLetters";
import { Archangel, ArchangelId } from "../kabbalah/Archangels";
import { GodNameId } from "../kabbalah/GodNames";

type PlanetId =
  | "sol"
  | "mercury"
  | "venus"
  | "earth"
  | "luna"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "rahu"
  | "ketu";

type LangObject = { en?: string; roman?: string; he?: string };

interface Planet {
  id: PlanetId;
  symbol: string;
  hebrewLetterId: HebrewLetterId;
  hebrewLetter?: HebrewLetter;
  name: {
    en: LangObject;
    he: LangObject;
  };
  godNameId: GodNameId;
  archangelId: ArchangelId;
  archangel?: Archangel;
  intelligenceId?: string;
  spiritId?: string;
  magickTypes?: {
    en: string;
  };
}

type Planets = {
  [key in PlanetId]: Planet;
};

const planets: Planets = require("./planets.json5").default;

export type { Planet, Planets, PlanetId };
export default planets;
