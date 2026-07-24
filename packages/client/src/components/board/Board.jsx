import React from 'react';
import { SAFE_CELLS, getValidMoveTokens } from '@ludo/engine';
import { PATH_COORDS, HOME_COLUMN, CENTER, tokenCoord } from '../../coords.js';

const COLOR_HEX = {
  red: '#e6483c',
  green: '#3fae4a',
  yellow: '#e8c33a',
  blue: '#3b7fe6',
};

const BASE_RECTS = [
  { color: 'red', x: 0, y: 0 },
  { color: 'green', x: 9, y: 0 },
  { color: 'yellow', x: 9, y: 9 },
  { color: 'blue', x: 0, y: 9 },
];

export default function Board({ gameState, myColor, onTokenClick }) {
  const validMoves = React.useMemo(() => {
    if (!gameState || gameState.phase !== 'MOVE') return [];
    return getValidMoveTokens(gameState);
  }, [gameState]);

  return (
    <svg viewBox="0 0 15 15" className="board-svg" style={{ width: '100%', height: '100%' }}>
      <rect x="0" y="0" width="15" height="15" fill="#f4f1ea" />

      {/* Colored corner bases */}
      {BASE_RECTS.map(({ color, x, y }) => (
        <g key={color}>
          <rect x={x} y={y} width="6" height="6" fill={COLOR_HEX[color]} opacity="0.18" />
          <rect
            x={x + 0.9}
            y={y + 0.9}
            width="4.2"
            height="4.2"
            rx="0.4"
            fill="#fff"
          />
        </g>
      ))}

      {/* Shared 52-cell track */}
      {PATH_COORDS.map(([row, col], i) => (
        <rect
          key={`path-${i}`}
          x={col}
          y={row}
          width="1"
          height="1"
          fill={SAFE_CELLS.includes(i) ? '#e0ddd2' : '#ffffff'}
          stroke="#cfcabd"
          strokeWidth="0.03"
        />
      ))}
      {SAFE_CELLS.map((i) => {
        const [row, col] = PATH_COORDS[i];
        return (
          <text
            key={`star-${i}`}
            x={col + 0.5}
            y={row + 0.72}
            fontSize="0.6"
            textAnchor="middle"
            fill="#b8b199"
          >
            ★
          </text>
        );
      })}

      {/* Home columns */}
      {Object.entries(HOME_COLUMN).map(([color, cells]) =>
        cells.map(([row, col], i) => (
          <rect
            key={`${color}-home-${i}`}
            x={col}
            y={row}
            width="1"
            height="1"
            fill={COLOR_HEX[color]}
            opacity="0.55"
            stroke="#ffffff"
            strokeWidth="0.03"
          />
        ))
      )}

      {/* Center home */}
      <rect x={CENTER[1] - 0.5} y={CENTER[0] - 0.5} width="1" height="1" fill="#ddd" />

      {/* Tokens */}
      {gameState?.players.map((player) =>
        player.tokens.map((relPos, tokenIndex) => {
          const [row, col] = tokenCoord(player.color, relPos, tokenIndex);
          const isCurrentTurn =
            gameState.players[gameState.turnIndex]?.color === player.color;
          const clickable =
            isCurrentTurn &&
            gameState.phase === 'MOVE' &&
            (!myColor || myColor === player.color) &&
            validMoves.includes(tokenIndex);
          return (
            <circle
              key={`${player.color}-${tokenIndex}`}
              cx={col + 0.5}
              cy={row + 0.5}
              r="0.36"
              fill={COLOR_HEX[player.color]}
              stroke="#1b1f27"
              strokeWidth={clickable ? 0.07 : 0.03}
              style={{ cursor: clickable ? 'pointer' : 'default' }}
              onClick={() => clickable && onTokenClick?.(tokenIndex)}
            />
          );
        })
      )}
    </svg>
  );
}
