type AlchemyTermID =
  | "sol-philosophorum"
  | "luna-philosophorum"
  | "green-lion"
  | "black-dragon"
  | "king"
  | "queen";

type LangObject = { en: string };
type LangObjectArray = { en: string[] };

interface AlchemyTerm {
  id: AlchemyTermID;
  name: LangObject;
  terms: LangObjectArray;
  gdGrade?: number; // 1,
}

type AlchemyTerms = {
  [key in AlchemyTermID]: AlchemyTerm;
};

const alchemyTerms: AlchemyTerms = require("./terms.json5").default;

export type { AlchemyTerm, AlchemyTerms, AlchemyTermID };
export default alchemyTerms;
