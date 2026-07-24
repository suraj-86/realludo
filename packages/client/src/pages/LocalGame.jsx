import { useParams } from "react-router-dom";

import BoardContainer from "../components/board/BoardContainer";
import GameLayout from "../components/layout/GameLayout";
import PlayerCard from "../components/player/PlayerCard";
import DiceButton from "../components/dice/DiceButton";

import useLocalGame from "../hooks/useLocalGame";

export default function LocalGame() {
  const { mode = "pass" } = useParams();

  const {
    players,
    board,
    currentPlayer,
    lastRoll,
    canRoll,
    move,
    roll,
    winner,
  } = useLocalGame(mode);

  return (
    <GameLayout
      topLeft={
        <PlayerCard
          player={players?.[1]}
          active={currentPlayer === 1}
        />
      }
      topRight={
        <DiceButton
          value={lastRoll}
          canRoll={canRoll}
          onRoll={roll}
        />
      }
      board={
        <BoardContainer
          board={board}
          players={players}
          currentPlayer={currentPlayer}
          onPawnClick={move}
        />
      }
      bottomLeft={
        <PlayerCard
          player={players?.[0]}
          active={currentPlayer === 0}
        />
      }
      bottomRight={
        <PlayerCard
          player={players?.[2]}
          active={currentPlayer === 2}
        />
      }
      status={
        winner ? (
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#fff",
            }}
          >
            🏆 {winner.name} Wins
          </div>
        ) : (
          <PlayerCard
            player={players?.[3]}
            active={currentPlayer === 3}
          />
        )
      }
    />
  );
}