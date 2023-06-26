import type { Element, ElementId } from "./Elements";

type ElementalId = "gnome" | "sylph" | "undine" | "salamander";

type LangObject = { en: string };

interface Elemental {
  id: ElementalId;
  name: LangObject;
  namePlural: LangObject;
  title: LangObject;
  elementId: ElementId;
  element?: Element;
}

type Elementals = {
  [key in ElementalId]: Elemental;
};

const elementals: Elementals = require("./elementals.json5").default;

export type { Elemental, Elementals, ElementalId };
export default elementals;
