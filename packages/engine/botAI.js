// botAI.js — lightweight heuristic bot. No search tree; Ludo has enough
// randomness (dice) that a heuristic plays reasonably and stays fast.

import { FINISH, absoluteCell, isSafeAbsoluteCell } from "./board.js";
import { getValidMoveTokens } from "./rules.js";

const RANDOMNESS = 0.15;

function wouldCapture(state, player, tokenIndex) {
  const diceValue = state.dice;
  const relPos = player.tokens[tokenIndex];
  const newPos = relPos === 0 ? 1 : relPos + diceValue;

  const absCell = absoluteCell(player.color, newPos);

  if (absCell === null || isSafeAbsoluteCell(absCell)) {
    return false;
  }

  return state.players.some(
    (opponent) =>
      opponent.color !== player.color &&
      opponent.tokens.some(
        (token) => absoluteCell(opponent.color, token) === absCell
      )
  );
}

function isOnVulnerableCell(player, tokenIndex) {
  const relPos = player.tokens[tokenIndex];
  const absCell = absoluteCell(player.color, relPos);

  return absCell !== null && !isSafeAbsoluteCell(absCell);
}

export function decideBotMove(state) {
  const player = state.players[state.turnIndex];
  const validMoves = getValidMoveTokens(state, state.dice);

  if (validMoves.length === 0) return null;

  if (validMoves.length === 1) return validMoves[0];

  if (Math.random() < RANDOMNESS) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  const captureMove = validMoves.find((idx) =>
    wouldCapture(state, player, idx)
  );

  if (captureMove !== undefined) {
    return captureMove;
  }

  const leaveYardMove = validMoves.find(
    (idx) => player.tokens[idx] === 0
  );

  if (leaveYardMove !== undefined) {
    return leaveYardMove;
  }

  const vulnerableMoves = validMoves.filter((idx) =>
    isOnVulnerableCell(player, idx)
  );

  if (vulnerableMoves.length > 0) {
    return vulnerableMoves.reduce((best, idx) =>
      player.tokens[idx] > player.tokens[best] ? idx : best
    );
  }

  return validMoves.reduce((best, idx) =>
    player.tokens[idx] > player.tokens[best] ? idx : best
  );
}

export function botTurnDelay() {
  return 500 + Math.floor(Math.random() * 400);
}

export { FINISH };