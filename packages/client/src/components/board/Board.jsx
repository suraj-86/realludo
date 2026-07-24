import React from "react";
import { SAFE_CELLS, getValidMoveTokens } from "@ludo/engine";
import { PATH_COORDS, HOME_COLUMN, CENTER, tokenCoord } from "../../coords.js";

const COLORS = {
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#facc15",
  blue: "#3b82f6",
};

const BASES = [
  { color: "red", x: 0, y: 0 },
  { color: "green", x: 9, y: 0 },
  { color: "yellow", x: 9, y: 9 },
  { color: "blue", x: 0, y: 9 },
];

export default function Board({ gameState, myColor, onTokenClick }) {
  const validMoves = React.useMemo(() => {
    if (!gameState || gameState.phase !== "MOVE") return [];
    return getValidMoveTokens(gameState);
  }, [gameState]);

  return (
    <svg
      viewBox="0 0 15 15"
      className="board-svg"
      style={{ width: "100%", height: "100%" }}
    >
      <rect width="15" height="15" rx="0.3" fill="#f8fafc" />

      {/* Bases */}
      {BASES.map(({ color, x, y }) => (
        <g key={color}>
          <rect
            x={x}
            y={y}
            width="6"
            height="6"
            fill={COLORS[color]}
            opacity=".18"
          />

          <rect
            x={x + .7}
            y={y + .7}
            width="4.6"
            height="4.6"
            rx=".35"
            fill="white"
            stroke={COLORS[color]}
            strokeWidth=".08"
          />
        </g>
      ))}

      {/* Track */}
      {PATH_COORDS.map(([r, c], i) => (
        <rect
          key={i}
          x={c}
          y={r}
          width="1"
          height="1"
          fill={SAFE_CELLS.includes(i) ? "#dbeafe" : "#ffffff"}
          stroke="#d1d5db"
          strokeWidth=".03"
        />
      ))}

      {/* Safe stars */}
      {SAFE_CELLS.map((i) => {
        const [r, c] = PATH_COORDS[i];

        return (
          <text
            key={i}
            x={c + .5}
            y={r + .68}
            textAnchor="middle"
            fontSize=".55"
            fill="#64748b"
          >
            ★
          </text>
        );
      })}

      {/* Home paths */}
      {Object.entries(HOME_COLUMN).map(([color, cells]) =>
        cells.map(([r, c], i) => (
          <rect
            key={`${color}-${i}`}
            x={c}
            y={r}
            width="1"
            height="1"
            fill={COLORS[color]}
            opacity=".55"
            stroke="white"
            strokeWidth=".03"
          />
        ))
      )}

      {/* Center */}
      <polygon
        points="
7.5,6
9,7.5
7.5,9
6,7.5
"
        fill="#fbbf24"
        stroke="#ffffff"
        strokeWidth=".08"
      />

      {/* Tokens */}
      {gameState?.players.map((player) =>
        player.tokens.map((pos, index) => {
          const [r, c] = tokenCoord(player.color, pos, index);

          const clickable =
            gameState.players[gameState.turnIndex]?.color === player.color &&
            gameState.phase === "MOVE" &&
            (!myColor || myColor === player.color) &&
            validMoves.includes(index);

          return (
            <g
              key={`${player.color}-${index}`}
              onClick={() => clickable && onTokenClick?.(index)}
              style={{
                cursor: clickable ? "pointer" : "default",
              }}
            >
              {clickable && (
                <circle
                  cx={c + .5}
                  cy={r + .5}
                  r=".46"
                  fill={COLORS[player.color]}
                  opacity=".25"
                />
              )}

              <circle
                cx={c + .5}
                cy={r + .5}
                r=".34"
                fill={COLORS[player.color]}
                stroke="white"
                strokeWidth=".06"
              />

              <circle
                cx={c + .38}
                cy={r + .38}
                r=".09"
                fill="rgba(255,255,255,.65)"
              />
            </g>
          );
        })
      )}
    </svg>
  );
}