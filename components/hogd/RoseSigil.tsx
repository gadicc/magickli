const letters = [
  ["א", "מ", "ש"],
  ["פ", "ר", "ב", "ד", "ג", "ת", "כ"],
  ["ה", "ו", "ז", "ח", "ט", "י", "ל", "נ", "ס", "ע", "צ", "ק"],
];

export function letterIJ(letter: string) {
  for (let i = 0; i < letters.length; i++) {
    const row = letters[i];
    const j = row.indexOf(letter);
    if (j >= 0) {
      return [i, j];
    }
  }
  return [-1, -1];
}

interface Point {
  x: number;
  y: number;
}

function letterPoint(letter: string): Point {
  const [i, j] = letterIJ(letter);
  const points = letters[i].length;
  const slice = (2 * Math.PI) / points;
  const offset = -Math.PI / 2 - (i == 1 ? slice / 2 : 0);
  const angle = offset - slice * j;
  const radius = 10 * (i + 2) - 5;
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
}

function calculatePerpendicularPointsAtEnd(
  point1: Point,
  point2: Point,
  distance: number
): [Point, Point] {
  // Calculate slope of original line
  const slope = (point2.y - point1.y) / (point2.x - point1.x);

  // Calculate slope of perpendicular line
  const perpSlope = -1 / slope;

  // Choose a point on the original line
  const targetPoint = point2;

  // Calculate y-intercept of perpendicular line
  const yIntercept = targetPoint.y - perpSlope * targetPoint.x;

  // Calculate two points on perpendicular line
  const pointA = {
    x: targetPoint.x + distance / Math.sqrt(1 + perpSlope ** 2),
    y:
      perpSlope * (targetPoint.x + distance / Math.sqrt(1 + perpSlope ** 2)) +
      yIntercept,
  };
  const pointB = {
    x: targetPoint.x - distance / Math.sqrt(1 + perpSlope ** 2),
    y:
      perpSlope * (targetPoint.x - distance / Math.sqrt(1 + perpSlope ** 2)) +
      yIntercept,
  };

  return [pointA, pointB];
}

export default function RoseSigil({
  sigilText,
  showRose = true,
}: {
  sigilText: string;
  showRose: boolean;
}) {
  const sigilTokens = sigilText.split("");
  return (
    <svg viewBox="-50 -50 100 100">
      {showRose && (
        <>
          {" "}
          <circle
            cx={0}
            cy={0}
            r={10}
            stroke="black"
            strokeWidth={0.5}
            fill="none"
          />
          {letters.map((row, i) => {
            const points = row.length;
            const slice = (2 * Math.PI) / points;
            const offset = -Math.PI / 2 - (i == 1 ? slice / 2 : 0);
            const radius = 10 * (i + 1) + 5;
            return (
              <>
                <circle
                  key={i}
                  cx={0}
                  cy={0}
                  r={10 * (i + 2)}
                  stroke="black"
                  strokeWidth={0.5}
                  fill="none"
                />
                {row.map((letter, j) => {
                  const angle = offset - slice * j;
                  return (
                    <text
                      key={j}
                      x={radius * Math.cos(angle)}
                      y={radius * Math.sin(angle)}
                      textAnchor="middle"
                      fontSize={10}
                      dominantBaseline="middle"
                    >
                      {letter}
                    </text>
                  );
                })}
              </>
            );
          })}
        </>
      )}

      {(function () {
        const points = sigilTokens.map((letter) => letterPoint(letter));
        if (points.length < 2) return null;

        // Circle at the start
        const startCircle = { x: 0, y: 0, radius: 2 };
        const firstPoint = points[0];
        const secondPoint = points[1];
        const lengthFromFirstToSecond = Math.sqrt(
          (points[1].x - points[0].x) ** 2 + (points[1].y - points[0].y) ** 2
        );
        const destLength = lengthFromFirstToSecond + startCircle.radius;
        const ratio = destLength / lengthFromFirstToSecond;
        startCircle.x = (1 - ratio) * secondPoint.x + ratio * firstPoint.x;
        startCircle.y = (1 - ratio) * secondPoint.y + ratio * firstPoint.y;

        // Small perpendicular line at the end
        const lastPoint = points[points.length - 1];
        const secondLastPoint = points[points.length - 2];
        const finalPoints = calculatePerpendicularPointsAtEnd(
          { x: secondLastPoint.x, y: secondLastPoint.y },
          { x: lastPoint.x, y: lastPoint.y },
          2
        );

        return (
          <>
            <circle
              cx={startCircle.x}
              cy={startCircle.y}
              r={startCircle.radius}
              stroke="red"
              fill="none"
            />

            <path
              stroke="red"
              fill="none"
              d={"M " + points.map((p) => `${p.x},${p.y}`).join(" L ")}
            />
            <path
              stroke="red"
              fill="none"
              d={
                "M" +
                finalPoints.map((point) => point.x + "," + point.y).join(" L ")
              }
            />
          </>
        );
      })()}
    </svg>
  );
}
