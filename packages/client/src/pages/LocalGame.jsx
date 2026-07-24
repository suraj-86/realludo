import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Board from "../components/board/Board.jsx";
import GameLayout from "../components/layout/GameLayout.jsx";
import PlayerCard from "../components/player/PlayerCard.jsx";

import { useLocalGame } from "../hooks/useLocalGame.js";

function statusText(state, mode) {
  if (state.winner) {
    const winner = state.players.find((p) => p.color === state.winner);
    return `${winner.name} wins! 🎉`;
  }

  const player = state.players[state.turnIndex];

  const who =
    mode === "pass"
      ? player.name
      : player.isBot
      ? player.name
      : "Your";

  if (state.phase === "ROLL") {
    return `${who} turn — roll the dice`;
  }

  return `${who} — pick a token to move`;
}

function LocalGameBoard({ mode, playerCount }) {
  const { state, move, roll } = useLocalGame(mode, playerCount);

  const players = state.players;

  const canRoll = (index) =>
    state.turnIndex === index &&
    state.phase === "ROLL" &&
    !state.winner;

  return (
    <div className="page game-page">
      <GameLayout
        topLeft={
          <PlayerCard
            player={players[0]}
            active={state.turnIndex === 0}
            dice={state.dice}
            canRoll={canRoll(0)}
            onRoll={roll}
          />
        }
        topRight={
          <PlayerCard
            player={players[1]}
            active={state.turnIndex === 1}
            dice={state.dice}
            canRoll={canRoll(1)}
            onRoll={roll}
          />
        }
        board={
          <div className="board-wrap">
            <Board
              gameState={state}
              onTokenClick={move}
            />
          </div>
        }
        bottomLeft={
          <PlayerCard
            player={players[2]}
            active={state.turnIndex === 2}
            dice={state.dice}
            canRoll={canRoll(2)}
            onRoll={roll}
          />
        }
        bottomRight={
          <PlayerCard
            player={players[3]}
            active={state.turnIndex === 3}
            dice={state.dice}
            canRoll={canRoll(3)}
            onRoll={roll}
          />
        }
        status={
          <p className="status-line">
            {statusText(state, mode)}
          </p>
        }
      />
    </div>
  );
}

export default function LocalGame() {
  const { mode } = useParams();
  const navigate = useNavigate();

  const [playerCount, setPlayerCount] = useState(null);

  if (!playerCount) {
    return (
      <div className="page">
        <h1 className="title">
          {mode === "bot" ? "Vs Bot" : "Pass & Play"}
        </h1>

        <p className="subtitle">
          How many players?
        </p>

        <div
          className="card"
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              className="btn primary"
              onClick={() => setPlayerCount(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          className="btn"
          onClick={() => navigate("/")}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <LocalGameBoard
      mode={mode}
      playerCount={playerCount}
    />
  );
}