import React from "react";
import { SAFE_CELLS } from "@ludo/engine";
import { PATH_COORDS } from "../../coords";

const COLORS = {
  safe: "#E8F4FF",
  normal: "#FFFFFF",
  border: "#CBD5E1",
};

export default function BoardGrid() {
  return (
    <>
      <defs>
        {/* Premium Board */}
        <linearGradient id="boardBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDFDFD" />
          <stop offset="100%" stopColor="#EEF2F7" />
        </linearGradient>

        {/* Cell Shadow */}
        <filter id="cellShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="0.05"
            stdDeviation="0.08"
            floodColor="#000"
            floodOpacity="0.18"
          />
        </filter>

        {/* Safe Cell Glow */}
        <radialGradient id="safeGlow">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#FACC15" />
        </radialGradient>
      </defs>

      {/* Board */}
      <rect
        x="0"
        y="0"
        width="15"
        height="15"
        rx="0.35"
        fill="url(#boardBg)"
      />

      {/* Track */}
      {PATH_COORDS.map(([row, col], index) => {
        const safe = SAFE_CELLS.includes(index);

        return (
          <g key={index}>
            <rect
              x={col + 0.05}
              y={row + 0.05}
              width="0.9"
              height="0.9"
              rx="0.18"
              fill={safe ? COLORS.safe : COLORS.normal}
              stroke={COLORS.border}
              strokeWidth="0.03"
              filter="url(#cellShadow)"
            />

            {safe && (
              <>
                <circle
                  cx={col + 0.5}
                  cy={row + 0.5}
                  r="0.22"
                  fill="url(#safeGlow)"
                  opacity="0.35"
                />

                <text
                  x={col + 0.5}
                  y={row + 0.68}
                  textAnchor="middle"
                  fontSize="0.45"
                  fill="#CA8A04"
                  fontWeight="700"
                >
                  ★
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Center Star */}
      <polygon
        points="
          7.5,6.3
          7.9,7.1
          8.8,7.2
          8.1,7.8
          8.3,8.7
          7.5,8.2
          6.7,8.7
          6.9,7.8
          6.2,7.2
          7.1,7.1
        "
        fill="#FACC15"
        stroke="#FFFFFF"
        strokeWidth="0.05"
      />
    </>
  );
}