// https://stackoverflow.com/a/57518703/1839099
const english_ordinal_rules = new Intl.PluralRules("en", { type: "ordinal" });
const suffixes = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};
export function ordinal(number: number) {
  const category = english_ordinal_rules.select(number);
  const suffix = suffixes[category];
  return number + suffix;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
