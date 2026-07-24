// coords.js — turns engine positions (color + relPos) into (row, col)
// coordinates on a 15x15 grid, for SVG rendering. Purely a view-layer
// concern; the engine doesn't know anything about pixels/rows/cols.

import { absoluteCell, FINISH, PATH_LENGTH } from '@ludo/engine';

// The 52 shared-track cells, walked clockwise starting just outside
// red's base. Index i here corresponds to absolute cell i in the
// engine (see START_OFFSET in board.js — red=0, green=13, yellow=26,
// blue=39), so this list must stay in sync with that spacing.
export const PATH_COORDS = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7],
  [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14],
  [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7],
  [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0],
  [6, 0],
];

// Home column: 5 cells (relPos 52-56) leading into the shared center
// cell, one array per color, ordered from the outer edge inward.
export const HOME_COLUMN = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
};

export const CENTER = [7, 7];

// Small per-color nudge so finished tokens stacked in the center
// don't perfectly overlap.
const CENTER_OFFSET = {
  red: [-0.15, -0.15],
  green: [0.15, -0.15],
  yellow: [0.15, 0.15],
  blue: [-0.15, 0.15],
};

// 4 yard slot positions per color, inside that color's 6x6 base.
export const YARD_SLOTS = {
  red: [[1.3, 1.3], [1.3, 3.3], [3.3, 1.3], [3.3, 3.3]],
  green: [[1.3, 10.7], [1.3, 12.7], [3.3, 10.7], [3.3, 12.7]],
  yellow: [[10.7, 10.7], [10.7, 12.7], [12.7, 10.7], [12.7, 12.7]],
  blue: [[10.7, 1.3], [10.7, 3.3], [12.7, 1.3], [12.7, 3.3]],
};

/** Returns [row, col] (can be fractional) for a token at relPos. */
export function tokenCoord(color, relPos, tokenIndex) {
  if (relPos === 0) return YARD_SLOTS[color][tokenIndex];
  if (relPos === FINISH) {
    const [dr, dc] = CENTER_OFFSET[color];
    return [CENTER[0] + dr, CENTER[1] + dc];
  }
  if (relPos > PATH_LENGTH) {
    return HOME_COLUMN[color][relPos - PATH_LENGTH - 1];
  }
  const abs = absoluteCell(color, relPos);
  return PATH_COORDS[abs];
}
