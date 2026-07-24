// botAI.js — lightweight heuristic bot. No search tree; Ludo has enough
// randomness (dice) that a heuristic plays reasonably and stays fast.

import { FINISH, absoluteCell, isSafeAbsoluteCell } from './board.js';
import { getValidMoveTokens } from './rules.js';

const RANDOMNESS = 0.15; // chance to ignore the heuristic and pick randomly

function wouldCapture(state, player, tokenIndex) {
  const diceValue = state.dice;
  const relPos = player.tokens[tokenIndex];
  const newPos = relPos === 0 ? 1 : relPos + diceValue;
  const absCell = absoluteCell(player.color, newPos);
  if (absCell === null || isSafeAbsoluteCell(absCell)) return false;
  return state.players.some(
    (opp) =>
      opp.color !== player.color &&
      opp.tokens.some((oRel) => absoluteCell(opp.color, oRel) === absCell)
  );
}

function isOnVulnerableCell(player, tokenIndex) {
  const relPos = player.tokens[tokenIndex];
  const absCell = absoluteCell(player.color, relPos);
  return absCell !== null && !isSafeAbsoluteCell(absCell);
}

/**
 * Given a state in phase 'MOVE' (dice already rolled), pick a token
 * index for the current (bot) player to move.
 */
export function decideBotMove(state) {
  const player = state.players[state.turnIndex];
  const valid = getValidMoveTokens(state, state.dice);
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];

  if (Math.random() < RANDOMNESS) {
    return valid[Math.floor(Math.random() * valid.length)];
  }

  // 1. Capture an opponent if possible.
  const capturing = valid.find((idx) => wouldCapture(state, player, idx));
  if (capturing !== undefined) return capturing;

  // 2. Bring a token out of the yard on a 6.
  const leavingYard = valid.find((idx) => player.tokens[idx] === 0);
  if (leavingYard !== undefined) return leavingYard;

  // 3. Move a token that's currently sitting exposed on a non-safe cell.
  const vulnerable = valid.filter((idx) => isOnVulnerableCell(player, idx));
  if (vulnerable.length > 0) {
    // among vulnerable tokens, prefer the one furthest along
    return vulnerable.reduce((best, idx) =>
      player.tokens[idx] > player.tokens[best] ? idx : best
    );
  }

  // 4. Otherwise, advance whichever token is closest to home.
  return valid.reduce((best, idx) =>
    player.tokens[idx] > player.tokens[best] ? idx : best
  );
}

export function botTurnDelay() {
  return 500 + Math.floor(Math.random() * 400); // feels less robotic
}

export { FINISH };
