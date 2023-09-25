// import type { AngelicOrder } from "./AngelicOrders";

// type LangObject = { he: string; roman: string };

interface Angel {
  name: { en: string; he: string };
  text: { en: string; fr: string };
  attribute: { en: string };
  presidesOver: [number, number][];
  godName?: string;
  angelicOrderId: string;
  // angelicOrder: AngelicOrder;
}

type Angels = Angel[];

const angels: Angels = require("./seventyTwoAngels.json5").default;

export type { Angel, Angels };
export default angels;
