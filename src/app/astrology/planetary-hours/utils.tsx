import { format } from "date-fns";

export const formatFromTo = (from, to) =>
  format(from, "ccc LLL do h:mm") + " - " + format(to, "h:mm aaa");

export const UpcomingHours = ({ hours }) => {
  return (
    <ul>
      {hours.map(({ from, to }, i) => (
        <li key={i}>{formatFromTo(from, to)}</li>
      ))}
    </ul>
  );
};
