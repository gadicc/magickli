type EnochianTabletID = "earth" | "air" | "water" | "fire";

type EnochianTablets = {
  [key in EnochianTabletID]: EnochianTablet;
};

interface EnochianTablet {
  id: EnochianTabletID;
  grid: string[][]; // 12x13 grid of letters
}

const tablets: EnochianTablets = require("./tablets.json5").default;

export default tablets;
export type { EnochianTabletID, EnochianTablet, EnochianTablets };
