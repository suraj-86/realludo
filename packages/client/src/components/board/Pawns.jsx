import React from "react";
import { motion } from "framer-motion";
import { tokenCoord } from "../../coords";

const COLORS = {
  red: "#ef5350",
  green: "#43a047",
  yellow: "#fbc02d",
  blue: "#1e88e5",
};

export default function Pawns({
  gameState,
  myColor,
  validMoves,
  onTokenClick,
}) {
  if (!gameState) return null;

  const currentPlayer =
    gameState.players[gameState.turnIndex];

  return (
    <>
      {gameState.players.map((player) =>
        player.tokens.map((relPos, tokenIndex) => {
          const [row, col] = tokenCoord(
            player.color,
            relPos,
            tokenIndex
          );

          const clickable =
            currentPlayer?.color === player.color &&
            gameState.phase === "MOVE" &&
            (!myColor || myColor === player.color) &&
            validMoves.includes(tokenIndex);

          return (
            <motion.g
              key={`${player.color}-${tokenIndex}`}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
              }}
              transition={{
                duration: 0.25,
              }}
              style={{
                cursor: clickable
                  ? "pointer"
                  : "default",
              }}
              onClick={() =>
                clickable &&
                onTokenClick?.(tokenIndex)
              }
            >
              {/* Glow */}
              {clickable && (
                <circle
                  cx={col + 0.5}
                  cy={row + 0.5}
                  r="0.44"
                  fill={COLORS[player.color]}
                  opacity="0.22"
                />
              )}

              {/* Shadow */}
              <circle
                cx={col + 0.53}
                cy={row + 0.56}
                r="0.28"
                fill="#000"
                opacity="0.15"
              />

              {/* Pawn */}
              <circle
                cx={col + 0.5}
                cy={row + 0.5}
                r="0.30"
                fill={COLORS[player.color]}
                stroke="#ffffff"
                strokeWidth="0.05"
              />

              {/* Highlight */}
              <circle
                cx={col + 0.42}
                cy={row + 0.42}
                r="0.08"
                fill="#ffffff"
                opacity="0.65"
              />

              {/* Active Ring */}
              {clickable && (
                <circle
                  cx={col + 0.5}
                  cy={row + 0.5}
                  r="0.38"
                  fill="none"
                  stroke="#ffd54f"
                  strokeWidth="0.05"
                />
              )}
            </motion.g>
          );
        })
      )}
    </>
  );
}