type LangObject = { en: string };

interface House {
  id: number;
  meaning: LangObject;
}

type Houses = House[];

const houses: Houses = require("./houses.json5").default;

export type { House, Houses };
export default houses;
