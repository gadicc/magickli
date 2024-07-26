type TribeOfIsraelId =
  | "reuben"
  | "simeon"
  | "levi"
  | "judah"
  | "dan"
  | "naphtali"
  | "gad"
  | "asher"
  | "issachar"
  | "zabulon"
  | "joseph"
  | "benjamin";

type LangObject = { he: string; en: string };

interface TribeOfIsrael {
  id: TribeOfIsraelId;
  name: LangObject;
}

type TribesOfIsrael = Record<TribeOfIsraelId, TribeOfIsrael>;

const tribesOfIsrael: TribesOfIsrael =
  require("./tribesOfIsrael.json5").default;

export type { TribeOfIsrael, TribesOfIsrael, TribeOfIsraelId };
export default tribesOfIsrael;
