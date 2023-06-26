import type { Elemental, ElementalId } from "./Elementals";

type ElementId = "earth" | "air" | "fire" | "water";

type LangObject = { en: string };

interface Element {
  id: ElementId;
  name: LangObject;
  symbol: string;
  elementalId: ElementalId;
  elemental?: Elemental;
}

type Elements = {
  [key in ElementId]: Element;
};

const elements: Elements = require("./elements.json5").default;

export type { Element, Elements, ElementId };
export default elements;
