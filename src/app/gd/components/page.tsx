import Lamen from "./lamen";

export default function GDComponentTest() {
  return [
    "imperator",
    "praemonstrator",
    "cancellarius",
    "hierophant",
    "hegemon",
    "hiereus",
    "dadouchos",
    "stolistes",
    "keryx",
    "sentinel",
  ].map((officer) => (
    <>
      <Lamen officer={officer} />
      <br />
    </>
  ));
}
