import { useEffect, useReducer, useRef } from 'react';
import {
  createGame,
  rollDice,
  applyMove,
  decideBotMove,
  botTurnDelay,
} from '@ludo/engine';

const COLOR_ORDER = ['red', 'green', 'yellow', 'blue'];

function reducer(state, action) {
  switch (action.type) {
    case 'ROLL':
      return rollDice(state);
    case 'MOVE':
      return applyMove(state, action.tokenIndex);
    default:
      return state;
  }
}

/**
 * @param {'pass'|'bot'} mode
 * @param {number} playerCount 2-4
 */
export function useLocalGame(mode, playerCount = 4) {
  const initial = useRef(
    createGame(
      COLOR_ORDER.slice(0, playerCount).map((color, i) => ({
        color,
        name: mode === 'bot' && i > 0 ? `Bot ${i}` : `Player ${i + 1}`,
        isBot: mode === 'bot' && i > 0,
      }))
    )
  );
  const [state, dispatch] = useReducer(reducer, initial.current);

  const roll = () => dispatch({ type: 'ROLL' });
  const move = (tokenIndex) => dispatch({ type: 'MOVE', tokenIndex });

  // Drive bot turns automatically.
  useEffect(() => {
    const player = state.players[state.turnIndex];
    if (!player?.isBot || state.winner) return;

    const timer = setTimeout(() => {
      if (state.phase === 'ROLL') {
        dispatch({ type: 'ROLL' });
      } else if (state.phase === 'MOVE') {
        const tokenIndex = decideBotMove(state);
        if (tokenIndex != null) dispatch({ type: 'MOVE', tokenIndex });
      }
    }, botTurnDelay());

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return { state, roll, move };
}
