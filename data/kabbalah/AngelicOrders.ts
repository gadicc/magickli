type AngelicOrderId =
  | "chayot-hakodesh"
  | "auphanim"
  | "aralim"
  | "chashmalim"
  | "seraphim"
  | "malachim"
  | "elohim"
  | "bnei-elohim"
  | "kerubim"
  | "ishim";

type LangObject = { he: string; en: string; roman: string };

interface AngelicOrder {
  id: AngelicOrderId;
  name: LangObject;
}

type AngelicOrders = {
  [key in AngelicOrderId]: AngelicOrder;
};

const angelicOrders: AngelicOrders = require("./angelicOrders.json5").default;

export type { AngelicOrder, AngelicOrders, AngelicOrderId };
export default angelicOrders;
