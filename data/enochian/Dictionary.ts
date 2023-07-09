interface EnochianDictionary {
  [key: string]: {
    gematria: number[];
    meanings: {
      meaning: string;
      source: string;
      source2?: string;
      note?: string;
    }[];
    pronounciations: {
      pronounciation: string;
      source: string;
    }[];
  };
}

const dictionary: EnochianDictionary = require("./dictionary.json5").default;

export default dictionary;
