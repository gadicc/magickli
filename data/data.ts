import planet from "./astrology/Planets";
import zodiac from "./astrology/Zodiac";
import house from "./astrology/Houses";

import gdGrade from "./gd/Grades";

import tetragram from "./geomancy/Tetragrams";
import geomanicHouse from "./geomancy/Houses";

import angelicOrder from "./kabbalah/AngelicOrders";
import archangel from "./kabbalah/Archangels";
import fourWorlds from "./kabbalah/FourWorlds";
import godName from "./kabbalah/GodNames";
import kerub from "./kabbalah/Kerubim";
import tolPath from "./kabbalah/Paths";
import sephirah from "./kabbalah/Sephirot";

import alchemySymbol from "./alchemy/Symbols";
import alchemyTerm from "./alchemy/Terms";
import element from "./alchemy/Elements";
import elemental from "./alchemy/Elementals";

import hebrewLetter from "./HebrewLetters";

const allData = {
  // ASTROLOGY
  planet, // : require("./astrology/planets.json5").default,
  zodiac, // : require("./astrology/zodiac.json5").default,
  house,

  hebrewLetter, // : require("./hebrewLetters.json5").default,

  // ENOCHIAN
  enochianLetter: require("./enochian/letters.json5").default,

  // GEOMANCY
  // tetragram: require("./geomancy/tetragrams.json5").default,
  tetragram,
  geomanicHouse,

  gdGrade,

  // KABBALAH
  archangel,
  angelicOrder,
  fourWorlds,
  godName,
  kerub,
  sephirah,
  tolPath,
  soul: require("./kabbalah/souls.json5").default,

  chakra: require("./chakras.json5").default,

  // ALCHEMY
  alchemySymbol, // : require("./alchemy/symbols.json5").default,
  alchemyTerm,
  element,
  elemental,
};

function insertRefs(row) {
  Object.keys(row).forEach((key) => {
    if (key.substr(key.length - 2) == "Id") {
      const name = key.substr(0, key.length - 2);
      const value = row[key];
      if (allData[name] && allData[name][value]) {
        row[name] = allData[name][value];

        // move to end
        //let tmp = sephirah[key];
        //delete sephirah[key];
        //sephirah[key] = tmp;
      }
    } else if (
      typeof row[key + "Id"] === "undefined" &&
      typeof row[key] === "object"
    ) {
      insertRefs(row[key]);
    }
  });
}

for (const [set, data] of Object.entries(allData)) {
  if (Array.isArray(data)) continue;
  for (const row of Object.values(data)) {
    insertRefs(row);
  }
}

// @ts-expect-error: ok
if (typeof window !== "undefined") window.magickData = allData;

// module.exports = allData;
export default allData;

export { tetragram, geomanicHouse };
