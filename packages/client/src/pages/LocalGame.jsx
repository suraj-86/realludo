import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Board from "../components/board/Board.jsx";
import GameLayout from "../components/layout/GameLayout.jsx";

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
  const { state, move } = useLocalGame(mode, playerCount);

  return (
    <div className="page game-page">
      <GameLayout
        topLeft={<div>🔴 Top Left</div>}
        topRight={<div>🟢 Top Right</div>}
        board={
          <div className="board-wrap">
            <Board gameState={state} onTokenClick={move} />
          </div>
        }
        bottomLeft={<div>🟡 Bottom Left</div>}
        bottomRight={<div>🔵 Bottom Right</div>}
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

        <p className="subtitle">How many players?</p>

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

        <button className="btn" onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    );
  }

  return <LocalGameBoard mode={mode} playerCount={playerCount} />;
}