import React from "react";

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

function angleInDegreesBetween(point1: Point, point2: Point) {
  return (Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180) / Math.PI;
}

function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

function dotProduct2D(p1: Point, p2: Point) {
  return p1.x * p2.x + p1.y * p2.y;
}

function lengthBetweenTwoPoints(p1: Point, p2: Point) {
  return Math.sqrt(((p1.x - p2.x) ^ 2) + ((p1.y - p2.y) ^ 2));
}

// Subtract vertex from p1,p2 to normalize on x-axis and calc angle
function angleBetweenTwoPointsAndVertex(p1: Point, p2: Point, vertex: Point) {
  return (
    Math.atan2(p2.y - vertex.y, p2.x - vertex.x) -
    Math.atan2(p1.y - vertex.y, p1.x - vertex.x)
  );
}

function pointAtFractionOfLine(p1: Point, p2: Point, frac: number): Point {
  return {
    x: p1.x + (p2.x - p1.x) * frac,
    y: p1.y + (p2.y - p1.y) * frac,
  };
}

function pointFromEndOfLine(p1: Point, p2: Point, distance: number): Point {
  const length = lengthBetweenTwoPoints(p1, p2);
  const frac = distance / length;
  return pointAtFractionOfLine(p1, p2, 1 - frac);
}

export default React.forwardRef(function RoseSigil(
  {
    sigilText,
    showRose = true,
    animate = true,
  }: {
    sigilText: string;
    showRose: boolean;
    animate: boolean;
  },
  ref: React.Ref<SVGSVGElement>
) {
  const sigilTokens = sigilText.split("");
  const pathRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    if (pathRef.current) {
      const animationDuration = sigilTokens.length / 4;
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = animate ? length.toString() : "";
      pathRef.current.style.strokeDashoffset = animate ? length.toString() : "";
      // pathRef.current.style.animation = `dash ${animationDuration}s linear 1s forwards 1`; // + ++renderCount.current;
      pathRef.current.classList.remove("path");
      // @ts-expect-error: trick to trigger reflow
      void pathRef.current.offsetWidth;
      if (animate) pathRef.current.classList.add("path");
    }
  }, [sigilText]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="-50 -50 100 100"
      ref={ref}
    >
      <style jsx>
        {`
          .path {
            animation: dash ${sigilTokens.length / 4}s linear 0s forwards 1;
          }

          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
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
              <React.Fragment key={i}>
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
              </React.Fragment>
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

        // Connecting line
        let d = "M " + points[0].x + "," + points[0].y + " ";
        for (let i = 1; i < points.length; i++) {
          const p = points[i],
            prev = points[i - 1],
            next = points[i + 1];

          if (next) {
            if (prev) {
              const slope = (prev.y - p.y) / (prev.x - p.x);

              // On (near-) straight lines, do a loop to emphasize that the
              // point is indeed part of the sigil and we're not just passing
              // through.
              const range = 10;
              const angle = toDegrees(
                angleBetweenTwoPointsAndVertex(prev, next, p)
              );
              if (angle > 180 - range && angle < 180 + range) {
                const r = 1;
                const justBefore = pointAtFractionOfLine(prev, p, 0.9);

                d += "L " + justBefore.x + "," + justBefore.y + " ";
                d += `A ${r},${r} 0 1,1 ${p.x},${p.y} `;
                d += `A ${r},${r} 0 1,1 ${justBefore.x},${justBefore.y} `;
                d += `A ${r},${r} 0 1,1 ${p.x},${p.y} `;
                continue;
              } /* if (near-) straight line */

              // If the next token is the same token, do a squiqqle
              if (next && sigilTokens[i] == sigilTokens[i + 1]) {
                const r = 1;
                const justBefore = pointFromEndOfLine(prev, p, 0.7);
                const justBefore2 = pointFromEndOfLine(prev, p, 0.35);
                const nextNext = points[i + 2];
                const nextAngle =
                  nextNext &&
                  toDegrees(angleBetweenTwoPointsAndVertex(prev, nextNext, p));
                const side = nextAngle < 0 ? "1" : "0";
                d += "L " + justBefore.x + "," + justBefore.y + " ";
                d += `A 2,1 0 1,${side} ${justBefore2.x},${justBefore2.y}`;
                d += `A 2,1 0 1,${side} ${p.x},${p.y}`;
                i++;
                continue;
              }
            } /* if (prev) */
          } /* if (next) */

          d += "L " + p.x + "," + p.y + " ";
        } /* for (point) */

        // Small perpendicular line at the end
        const lastPoint = points[points.length - 1];
        const secondLastPoint =
          points[
            points.length -
              (sigilText[points.length - 1] === sigilText[points.length - 2] &&
              points.length > 2
                ? 3
                : 2)
          ];
        const finalPoints = calculatePerpendicularPointsAtEnd(
          { x: secondLastPoint.x, y: secondLastPoint.y },
          { x: lastPoint.x, y: lastPoint.y },
          2
        );

        d += "L " + finalPoints.map((p) => p.x + "," + p.y).join(" L ");

        return (
          <>
            <circle
              // Circle before starting point
              cx={startCircle.x}
              cy={startCircle.y}
              r={startCircle.radius}
              stroke="red"
              fill="none"
            />

            <path
              // Connecting path
              stroke="red"
              fill="none"
              ref={pathRef}
              d={d}
            />
          </>
        );
      })()}
    </svg>
  );
});
