type FourWorldId = "atzilut" | "briah" | "yetzirah" | "assiah";

interface FourWorld {
  id: FourWorldId;
  name: { en: string; he: string; roman: string };
  desc: { en: string };
  residentsTitle: { en: string };
}

type FourWorlds = {
  [key in FourWorldId]: FourWorld;
};

const fourWorlds: FourWorlds = require("./fourWorlds.json5").default;

export type { FourWorld, FourWorlds, FourWorldId };
export default fourWorlds;
