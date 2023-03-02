type PlanetID =
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

type LangObject = { en?: string; roman?: string };

interface Planet {
  id: PlanetID;
  symbol: string;
  hebrewLetterId: string; // TODO, HebrewLetterID
  name: {
    en: LangObject;
    he: LangObject;
  };
  godNameId: string; // TODO, GodNameID
}

type Planets = {
  [key in PlanetID]: Planet;
};

const planets: Planets = require("./planets.json5").default;

export type { Planet, Planets, PlanetID };
export default planets;
