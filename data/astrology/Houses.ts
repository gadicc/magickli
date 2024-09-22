import { Zodiac, ZodiacId } from "./Zodiac";

type LangObject = { en?: string };

interface House {
  index: number;
  zodiacId: ZodiacId;
  zodiac?: Zodiac;
}

type Houses = House[];

const houses: Houses = require("./houses.json5").default;

export type { House, Houses };
export default houses;
