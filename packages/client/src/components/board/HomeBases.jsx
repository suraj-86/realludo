import React from "react";

const BASES = [
  {
    color: "red",
    x: 0,
    y: 0,
    fill: "#ef5350",
    slots: [
      [1.5, 1.5],
      [3.5, 1.5],
      [1.5, 3.5],
      [3.5, 3.5],
    ],
  },
  {
    color: "green",
    x: 9,
    y: 0,
    fill: "#43a047",
    slots: [
      [10.5, 1.5],
      [12.5, 1.5],
      [10.5, 3.5],
      [12.5, 3.5],
    ],
  },
  {
    color: "yellow",
    x: 9,
    y: 9,
    fill: "#fbc02d",
    slots: [
      [10.5, 10.5],
      [12.5, 10.5],
      [10.5, 12.5],
      [12.5, 12.5],
    ],
  },
  {
    color: "blue",
    x: 0,
    y: 9,
    fill: "#1e88e5",
    slots: [
      [1.5, 10.5],
      [3.5, 10.5],
      [1.5, 12.5],
      [3.5, 12.5],
    ],
  },
];

export default function HomeBases() {
  return (
    <>
      {BASES.map((base) => (
        <g key={base.color}>
          {/* Outer Base */}
          <rect
            x={base.x}
            y={base.y}
            width="6"
            height="6"
            rx="0.5"
            fill={base.fill}
            opacity="0.18"
          />

          {/* Inner White Area */}
          <rect
            x={base.x + 0.6}
            y={base.y + 0.6}
            width="4.8"
            height="4.8"
            rx="0.45"
            fill="#ffffff"
            stroke="#d7d7d7"
            strokeWidth="0.05"
          />

          {/* Pawn Slots */}
          {base.slots.map(([cx, cy], i) => (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r="0.45"
                fill={base.fill}
                opacity="0.18"
              />

              <circle
                cx={cx}
                cy={cy}
                r="0.30"
                fill="#ffffff"
                stroke={base.fill}
                strokeWidth="0.05"
              />
            </g>
          ))}
        </g>
      ))}
    </>
  );
}