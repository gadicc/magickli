import React from "react";
import AppBar from "../components/AppBar";
import { tetragram } from "../data/data";

function Tetragram({
  rows,
  width,
  height = 50,
}: {
  rows: (1 | 2)[];
  width: number;
  height: number;
}) {
  const radius = 3;
  const padding = 3;

  const rowHeight = padding + 2 * radius;
  const viewBoxHeight = rows.length * rowHeight + padding;
  const viewBoxWidth = 4 * (radius + padding);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      // viewBox="0 0 316 600"
      // viewBox={"0 0 " + canvasWidth + " " + canvasHeight}
      viewBox={`-${viewBoxWidth / 2} 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={width}
      height={height}
      // style={{ border: "1px solid black" }}
    >
      {rows.map((n, i) =>
        n === 2 ? (
          <g key={i}>
            <circle
              cx={-(radius + padding) + 1.5}
              cy={padding + radius + i * rowHeight}
              r={radius}
            />
            <circle
              cx={radius + padding - 1.5}
              cy={padding + radius + i * rowHeight}
              r={radius}
            />
          </g>
        ) : (
          <circle
            key={i}
            cx={0}
            cy={padding + radius + i * rowHeight}
            r={radius}
          />
        )
      )}
    </svg>
  );
}

export default function Geomancy() {
  return (
    <>
      <AppBar title="Geomancy" navParts={[]} />
      <div>hi</div>
      {Object.values(tetragram).map((t) => (
        <div>
          {t.rows.join(",")}
          <br />
          <Tetragram rows={t.rows} />
          <br />
        </div>
      ))}
    </>
  );
}
