// board.js — pure board geometry/math. No rendering, no state mutation.

export const COLORS = ['red', 'green', 'yellow', 'blue'];

// Absolute index (0-51) on the shared 52-cell outer track where each
// color's token enters the track after leaving its yard.
// Colors are spaced 13 apart (52 / 4 colors) and laid out clockwise:
// red (top-left) -> green (top-right) -> yellow (bottom-right) -> blue (bottom-left).
export const START_OFFSET = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Cells that are "safe" — a token sitting here cannot be captured.
// Standard Ludo: each color's own start square, plus one star cell
// roughly opposite each start.
export const SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];

// A token's position is tracked as a single integer, relative to its
// own color, called `relPos`:
//   0            -> still in the yard (not on the board)
//   1 - 51       -> on the shared outer track (51 relative steps)
//   52 - 56      -> in this color's private home column (5 cells)
//   57 (FINISH)  -> home / finished
export const PATH_LENGTH = 51;
export const HOME_LENGTH = 6;
export const FINISH = PATH_LENGTH + HOME_LENGTH; // 57

/**
 * Convert a color + relative position (1-51) into an absolute cell
 * index (0-51) on the shared outer track. Returns null if the token
 * is in the yard or already in its home column (i.e. not on the
 * shared track, so it can't be captured / doesn't share a cell with
 * other colors).
 */
export function absoluteCell(color, relPos) {
  if (relPos < 1 || relPos > PATH_LENGTH) return null;
  return (START_OFFSET[color] + relPos - 1) % 52;
}

export function isSafeAbsoluteCell(absCell) {
  return SAFE_CELLS.includes(absCell);
}

export function isInYard(relPos) {
  return relPos === 0;
}

export function isOnSharedTrack(relPos) {
  return relPos >= 1 && relPos <= PATH_LENGTH;
}

export function isInHomeColumn(relPos) {
  return relPos > PATH_LENGTH && relPos < FINISH;
}

export function isFinished(relPos) {
  return relPos === FINISH;
}
