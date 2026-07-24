// rules.js — the authoritative Ludo rules engine.
// Pure functions: (state, ...) => newState. No I/O, no randomness leaks
// outside rollDice. Safe to run identically on client (local modes) and
// server (online mode, as source of truth).

import {
  FINISH,
  PATH_LENGTH,
  absoluteCell,
  isSafeAbsoluteCell,
} from './board.js';

const TOKENS_PER_PLAYER = 4;

/**
 * @param {Array<{color:string,isBot?:boolean,name?:string}>} playerInfos
 */
export function createGame(playerInfos) {
  return {
    players: playerInfos.map((p) => ({
      color: p.color,
      name: p.name ?? p.color,
      isBot: !!p.isBot,
      tokens: Array(TOKENS_PER_PLAYER).fill(0), // 0 = in yard
      finished: false,
    })),
    turnIndex: 0,
    dice: null,
    consecutiveSixes: 0,
    phase: 'ROLL', // 'ROLL' | 'MOVE' | 'GAME_OVER'
    winner: null,
    lastCapture: null, // {color, tokenIndex} for UI flourish, cleared each roll
    log: [],
  };
}

function currentPlayer(state) {
  return state.players[state.turnIndex];
}

function pushLog(state, message) {
  state.log = [...state.log.slice(-49), message];
}

/** Returns token indexes (0-3) belonging to the current player that
 * can legally move with the given dice value. */
export function getValidMoveTokens(state, diceValue = state.dice) {
  const player = currentPlayer(state);
  if (!player || diceValue == null) return [];
  const moves = [];
  player.tokens.forEach((relPos, idx) => {
    if (relPos === FINISH) return; // already home
    if (relPos === 0) {
      if (diceValue === 6) moves.push(idx); // need a 6 to leave the yard
      return;
    }
    const newPos = relPos + diceValue;
    if (newPos <= FINISH) moves.push(idx); // can't overshoot home
  });
  return moves;
}

function advanceToNextPlayer(state) {
  const n = state.players.length;
  let next = state.turnIndex;
  for (let i = 0; i < n; i++) {
    next = (next + 1) % n;
    if (!state.players[next].finished) break;
  }
  state.turnIndex = next;
  state.dice = null;
  state.consecutiveSixes = 0;
  state.phase = 'ROLL';
}

/**
 * Roll the dice for the current player. Handles: three-6-forfeit,
 * and auto-passing the turn when the roll leaves no legal move.
 */
export function rollDice(state, forcedValue = null) {
  const next = structuredClone(state);
  if (next.phase !== 'ROLL' || next.winner) return next;

  const value = forcedValue ?? 1 + Math.floor(Math.random() * 6);
  next.dice = value;
  next.lastCapture = null;

  if (value === 6) {
    next.consecutiveSixes += 1;
  } else {
    next.consecutiveSixes = 0;
  }

  if (next.consecutiveSixes === 3) {
    pushLog(next, `${currentPlayer(next).name} rolled three 6s in a row — turn forfeited.`);
    advanceToNextPlayer(next);
    return next;
  }

  const moves = getValidMoveTokens(next, value);
  if (moves.length === 0) {
    pushLog(next, `${currentPlayer(next).name} rolled a ${value} — no valid move.`);
    advanceToNextPlayer(next);
    return next;
  }

  next.phase = 'MOVE';
  return next;
}

/**
 * Move `tokenIndex` for the current player, using the dice value
 * already rolled in state.dice. Handles captures, entering the home
 * column, finishing, extra turns, and win detection.
 */
export function applyMove(state, tokenIndex) {
  const next = structuredClone(state);
  if (next.phase !== 'MOVE' || next.winner) return next;

  const player = currentPlayer(next);
  const diceValue = next.dice;
  const validMoves = getValidMoveTokens(next, diceValue);
  if (!validMoves.includes(tokenIndex)) return next; // illegal, ignore

  const relPos = player.tokens[tokenIndex];
  const newPos = relPos === 0 ? 1 : relPos + diceValue;
  player.tokens[tokenIndex] = newPos;

  let captured = false;
  const absCell = absoluteCell(player.color, newPos);
  if (absCell !== null && !isSafeAbsoluteCell(absCell)) {
    for (const opponent of next.players) {
      if (opponent.color === player.color) continue;
      opponent.tokens.forEach((oRelPos, oIdx) => {
        const oAbs = absoluteCell(opponent.color, oRelPos);
        if (oAbs !== null && oAbs === absCell) {
          opponent.tokens[oIdx] = 0; // sent back to yard
          captured = true;
          next.lastCapture = { color: opponent.color, tokenIndex: oIdx };
          pushLog(next, `${player.name} captured ${opponent.name}'s token!`);
        }
      });
    }
  }

  const justFinished = newPos === FINISH;
  if (justFinished) {
    pushLog(next, `${player.name} got a token home!`);
  }

  if (player.tokens.every((t) => t === FINISH)) {
    player.finished = true;
    next.winner = player.color;
    next.phase = 'GAME_OVER';
    pushLog(next, `${player.name} wins!`);
    return next;
  }

  const extraTurn = diceValue === 6 || captured || justFinished;
  if (extraTurn) {
    next.dice = null;
    next.phase = 'ROLL';
    // consecutiveSixes only tracked across actual dice==6 rolls,
    // already incremented in rollDice — leave as-is.
  } else {
    advanceToNextPlayer(next);
  }

  return next;
}

export const TOKENS_PER_PLAYER_COUNT = TOKENS_PER_PLAYER;
export { PATH_LENGTH, FINISH };
