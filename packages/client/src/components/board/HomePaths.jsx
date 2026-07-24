import React from "react";
import { HOME_COLUMN } from "../../coords";

const COLORS = {
  red: "#ef5350",
  green: "#43a047",
  yellow: "#fbc02d",
  blue: "#1e88e5",
};

export default function HomePaths() {
  return (
    <>
      {Object.entries(HOME_COLUMN).map(([color, cells]) =>
        cells.map(([row, col], index) => (
          <g key={`${color}-${index}`}>
            {/* Cell Shadow */}
            <rect
              x={col + 0.05}
              y={row + 0.05}
              width="0.90"
              height="0.90"
              rx="0.15"
              fill="#000"
              opacity="0.08"
            />

            {/* Main Cell */}
            <rect
              x={col + 0.03}
              y={row + 0.03}
              width="0.94"
              height="0.94"
              rx="0.16"
              fill={COLORS[color]}
              opacity={0.35 + index * 0.12}
              stroke="#ffffff"
              strokeWidth="0.03"
            />

            {/* Gloss Highlight */}
            <rect
              x={col + 0.10}
              y={row + 0.10}
              width="0.80"
              height="0.20"
              rx="0.08"
              fill="#ffffff"
              opacity="0.22"
            />
          </g>
        ))
      )}
    </>
  );
}