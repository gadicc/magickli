type TetragramID =
  | "via"
  | "cauda_draconis"
  | "puer"
  | "fortuna_minor"
  | "puella"
  | "carcer"
  | "laetitia"
  | "caput_draconis"
  | "conjunctio"
  | "acquisitio"
  | "rubeus"
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
