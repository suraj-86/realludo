import { useEffect, useReducer, useRef, useMemo } from "react";
import {
  createGame,
  rollDice,
  applyMove,
  decideBotMove,
  botTurnDelay,
} from "@ludo/engine";

const COLOR_ORDER = ["red", "green", "yellow", "blue"];

function reducer(state, action) {
  switch (action.type) {
    case "ROLL":
      return rollDice(state);

    case "MOVE":
      return applyMove(state, action.tokenIndex);

    default:
      return state;
  }
}

/**
 * Local Game Hook
 *
 * mode:
 *  - pass
 *  - bot
 *
 * playerCount:
 *  - 2
 *  - 3
 *  - 4
 */
export default function useLocalGame(
  mode = "pass",
  playerCount = 4
) {
  const initialState = useRef(
    createGame(
      COLOR_ORDER.slice(0, playerCount).map((color, index) => ({
        color,
        name:
          mode === "bot" && index > 0
            ? `Bot ${index}`
            : `Player ${index + 1}`,
        isBot: mode === "bot" && index > 0,
      }))
    )
  );

  const [state, dispatch] = useReducer(
    reducer,
    initialState.current
  );

  const currentPlayer = useMemo(
    () => state.players[state.turnIndex],
    [state]
  );

  const canRoll =
    !state.winner &&
    state.phase === "ROLL" &&
    !currentPlayer?.isBot;

  const canMove =
    !state.winner &&
    state.phase === "MOVE" &&
    !currentPlayer?.isBot;

  const roll = () => {
    if (!canRoll) return;

    dispatch({
      type: "ROLL",
    });
  };

  const move = (tokenIndex) => {
    if (!canMove) return;

    dispatch({
      type: "MOVE",
      tokenIndex,
    });
  };

  useEffect(() => {
    if (!currentPlayer) return;
    if (!currentPlayer.isBot) return;
    if (state.winner) return;

    const timer = setTimeout(() => {
      if (state.phase === "ROLL") {
        dispatch({
          type: "ROLL",
        });
        return;
      }

      if (state.phase === "MOVE") {
        const tokenIndex = decideBotMove(state);

        if (tokenIndex != null) {
          dispatch({
            type: "MOVE",
            tokenIndex,
          });
        }
      }
    }, botTurnDelay());

    return () => clearTimeout(timer);
  }, [state, currentPlayer]);

  return {
    state,

    // Actions
    roll,
    move,

    // Current Player
    currentPlayer: state.turnIndex,
    currentPlayerData: currentPlayer,

    // Game Data
    players: state.players,
    board: state.board,
    phase: state.phase,
    winner: state.winner,
    lastRoll: state.lastRoll,

    // UI Flags
    canRoll,
    canMove,
    rolling: state.phase === "ROLL",
  };
}