type RetrogradeId = "mercury";

type RetrogradeList = [[number, number, number], [number, number, number]];

type Retrogrades = {
  [key in RetrogradeId]: RetrogradeList;
};

const retrogrades: Retrogrades = require("./retrograde.json5").default;

export type { RetrogradeList, Retrogrades, RetrogradeId };
export default retrogrades;
