// board.js
// Pure board geometry helpers.
// No game state mutation.
// Safe to import from both the client and the server.

export const COLORS = [
  "red",
  "green",
  "yellow",
  "blue",
];

export const START_OFFSET = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

export const SAFE_CELLS = [
  0,
  8,
  13,
  21,
  26,
  34,
  39,
  47,
];

export const PATH_LENGTH = 51;

export const HOME_LENGTH = 6;

export const FINISH = PATH_LENGTH + HOME_LENGTH;

/**
 * Convert a relative position to an absolute board cell.
 *
 * Yard -> null
 * Home column -> null
 * Finish -> null
 */
export function absoluteCell(color, relPos) {
  if (relPos < 1 || relPos > PATH_LENGTH) {
    return null;
  }

  return (
    (START_OFFSET[color] + relPos - 1) %
    52
  );
}

export function relativeFromAbsolute(
  color,
  absolute
) {
  return (
    ((absolute - START_OFFSET[color] + 52) % 52) +
    1
  );
}

export function isSafeAbsoluteCell(cell) {
  return SAFE_CELLS.includes(cell);
}

export function isInYard(relPos) {
  return relPos === 0;
}

export function isOnSharedTrack(relPos) {
  return (
    relPos >= 1 &&
    relPos <= PATH_LENGTH
  );
}

export function isInHomeColumn(relPos) {
  return (
    relPos > PATH_LENGTH &&
    relPos < FINISH
  );
}

export function isFinished(relPos) {
  return relPos === FINISH;
}

export function isHomeEntry(relPos) {
  return relPos === PATH_LENGTH;
}

export function canEnterHome(relPos, dice) {
  return (
    relPos >= PATH_LENGTH &&
    relPos + dice <= FINISH
  );
}

export function nextRelativePosition(
  relPos,
  dice
) {
  if (isFinished(relPos)) {
    return relPos;
  }

  return Math.min(
    relPos + dice,
    FINISH
  );
}

export function tokenState(relPos) {
  if (isInYard(relPos)) {
    return "yard";
  }

  if (isFinished(relPos)) {
    return "finish";
  }

  if (isInHomeColumn(relPos)) {
    return "home";
  }

  return "track";
}

export default {
  COLORS,
  START_OFFSET,
  SAFE_CELLS,
  PATH_LENGTH,
  HOME_LENGTH,
  FINISH,
  absoluteCell,
  relativeFromAbsolute,
  isSafeAbsoluteCell,
  isInYard,
  isOnSharedTrack,
  isInHomeColumn,
  isFinished,
  isHomeEntry,
  canEnterHome,
  nextRelativePosition,
  tokenState,
};