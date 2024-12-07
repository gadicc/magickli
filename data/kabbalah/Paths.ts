import { HebrewLetter, HebrewLetterId } from "../HebrewLetters";

// TODO
type PathId = string;

interface Path {
  id: PathId;
  hermetic: {
    hebrewLetter?: HebrewLetter;
    hebrewLetterId: HebrewLetterId;
    pathNo: number;
    tarotId: string; // TODO
  };
  hebrew: {
    hebrewLetter?: HebrewLetter;
    hebrewLetterId: HebrewLetterId;
  };
}

type Paths = Record<PathId, Path>;

const paths: Paths = require("./paths.json5").default;

export type { Path, Paths, PathId };
export default paths;
