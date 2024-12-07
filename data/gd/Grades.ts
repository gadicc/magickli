import type { Element, ElementId } from "../alchemy/Elements";
import type { Planet, PlanetId } from "../astrology/Planets";
import type { Sephirah, SephirahId } from "../kabbalah/Sephirot";

type GDGradeId =
  | "0=0"
  | "1=10"
  | "2=9"
  | "3=8"
  | "4=7"
  | "5=6"
  | "6=5"
  | "7=4"
  | "8=3"
  | "9=2"
  | "10=1";

type GDGrades = {
  [key in GDGradeId]: GDGrade;
};

interface GDGrade {
  id: GDGradeId;
  name: string;
  orderId: "1st" | "2nd" | "3rd";
  element?: Element;
  elementId: ElementId;
  planet?: Planet;
  planetId: PlanetId;
  degreeId: "1st" | "2nd" | "3rd";
  sephirah?: Sephirah;
  sephirahId: SephirahId;
  prev: GDGradeId;
  next: GDGradeId;
}

const grades: GDGrades = require("./grades.json5").default;

export default grades;
export type { GDGradeId, GDGrade, GDGrades };
