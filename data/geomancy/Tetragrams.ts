type TetragramID =
  | "acquisitio"
  | "amissio"
  | "albus"
  | "rubeus"
  | "puella"
  | "puer"
  | "laetitia"
  | "tristitia"
  | "caput_draconis"
  | "cauda_draconis"
  | "populus"
  | "via"
  | "conjunctio"
  | "carcer"
  | "fortuna_minor"
  | "fortuna_major";

type LangObject = { en: string };

interface Tetragram {
  id: TetragramID;
  rows: (1 | 2)[];
  title: LangObject;
  translation: LangObject;
  meaning: LangObject;
  meanings: LangObject[];
}

type Tetragrams = {
  [key in TetragramID]: Tetragram;
};

const tetragrams: Tetragrams = require("./tetragrams.json5").default;

export type { Tetragram, Tetragrams, TetragramID };
export default tetragrams;
