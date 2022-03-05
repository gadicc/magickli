import React from "react";
import { DateTime } from "luxon";

import retrogrades from "../../data/astrology/retrograde.json5";

function find() {
  const now = new Date();

  for (let row of retrogrades.mercury) {
    const start = new Date(row[0]);
    const end = new Date(row[1]);

    if (now < end) return { start, end };
  }
}

function MercuryDrawing({ phase, width, height }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 170 162"
      width={width}
      height={height}
      transform={`rotate(${inclination})`}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        className="back"
        d="m85,5 a20,20 0 1,1 0,150 a20,20 0 1,1 0,-150"
        style={{ fill: "white", filter: "url(#glow)" }}
      />
      <path
        className="back"
        d="m85,5 a20,20 0 1,1 0,150 a20,20 0 1,1 0,-150"
        style={{ fill: "black" }}
      />
      <path
        className="moon"
        d={`m85,5 a${mag},20 0 1,${sweep[0]} 0,150 a20,20 0 1,${sweep[1]} 0,-150`}
        style={{ fill: "#ebc815" }}
      />
    </svg>
  );
}

function MercuryWidget({ padding = "8px 0 7px 0" }) {
  const retrograde = find();
  const d = (d) =>
    DateTime.fromJSDate(d).toLocaleString({
      month: "short",
      day: "2-digit",
    });

  return (
    <div
      style={{
        textAlign: "center",
        background: "url(/night-sky.jpg)",
        backgroundSize: "cover",
        height: "100%",
      }}
    >
      <style jsx>{``}</style>
      <div style={{ padding }}>
        <img src="/pics/mercury.webp" height="85" />
      </div>
      <div style={{ color: "#cc5" }}>
        Retro {d(retrograde.start)} - {d(retrograde.end)}
      </div>
    </div>
  );
}

export default MercuryWidget;
