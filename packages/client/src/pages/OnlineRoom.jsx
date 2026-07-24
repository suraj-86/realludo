import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import GameLayout from "../components/layout/GameLayout";
import BoardContainer from "../components/board/BoardContainer";
import PlayerCard from "../components/player/PlayerCard";
import DiceButton from "../components/dice/DiceButton";

import { ensureConnected, socket } from "../net/socket";

function loadIdentity(roomId) {
  try {
    return JSON.parse(sessionStorage.getItem(`ludo-room-${roomId}`) || "null");
  } catch {
    return null;
  }
}

function saveIdentity(roomId, identity) {
  sessionStorage.setItem(
    `ludo-room-${roomId}`,
    JSON.stringify(identity)
  );
}

function shareUrl(roomId) {
  return `${window.location.origin}/room/${roomId}`;
}

export default function OnlineRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [players, setPlayers] = useState([]);

  const [gameState, setGameState] = useState(null);

  const [me, setMe] = useState(loadIdentity(roomId));

  const [joining, setJoining] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    ensureConnected();

    const handleRoomUpdate = (payload) => setPlayers(payload);

    const handleGameStarted = (payload) => setGameState(payload);

    const handleGameState = (payload) => setGameState(payload);

    socket.on("room-update", handleRoomUpdate);
    socket.on("game-started", handleGameStarted);
    socket.on("game-state", handleGameState);

    if (me) {
      socket.emit(
        "join-room",
        {
          roomId,
          playerId: me.playerId,
          name: me.name,
        },
        (res) => {
          if (!res?.ok) {
            setError(res?.error ?? "Unable to reconnect");
            return;
          }

          if (res.state) {
            setGameState(res.state);
          }
        }
      );
    }

    return () => {
      socket.off("room-update", handleRoomUpdate);
      socket.off("game-started", handleGameStarted);
      socket.off("game-state", handleGameState);
    };
  }, [roomId]);

  const join = () => {
    setJoining(true);

    socket.emit(
      "join-room",
      {
        roomId,
        name: name || undefined,
      },
      (res) => {
        setJoining(false);

        if (!res?.ok) {
          setError(res?.error || "Unable to join room");
          return;
        }

        const identity = {
          playerId: res.playerId,
          color: res.color,
          name: name || "Player",
        };

        saveIdentity(roomId, identity);

        setMe(identity);

        if (res.state) {
          setGameState(res.state);
        }
      }
    );
  };

  const startGame = () => {
    socket.emit("start-game", {
      roomId,
      playerId: me.playerId,
    });
  };

  const roll = () =>
    socket.emit("roll-dice", {
      roomId,
      playerId: me.playerId,
    });

  const move = (tokenIndex) =>
    socket.emit("move-token", {
      roomId,
      playerId: me.playerId,
      tokenIndex,
    });

  const copyLink = async () => {
    const url = shareUrl(roomId);

    try {
      await navigator.clipboard.writeText(url);
      alert("Room link copied.");
    } catch {}
  };

  if (error) {
    return (
      <div className="page">

        <div className="card" style={{ padding: 40 }}>

          <h2>{error}</h2>

          <button
            style={{ marginTop: 20 }}
            onClick={() => navigate("/")}
          >
            Back
          </button>

        </div>

      </div>
    );
  }

  if (!me) {
    return (
      <div className="page">

        <div
          className="card"
          style={{
            width: 420,
            padding: 40,
          }}
        >

          <h1 className="title">

            Join Room

          </h1>

          <p className="subtitle">

            Room : {roomId}

          </p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            style={{
              marginTop: 25,
              padding: 16,
              borderRadius: 12,
              border: "none",
              width: "100%",
            }}
          />

          <button
            onClick={join}
            disabled={joining}
            style={{
              marginTop: 20,
              width: "100%",
              padding: 16,
            }}
          >
            {joining ? "Joining..." : "Join Game"}
          </button>

        </div>

      </div>
    );
  }

  if (!gameState) {
    const isHost =
      players.find((p) => p.id === me.playerId)?.isHost ?? false;

    return (
      <div className="page">

        <div
          className="card"
          style={{
            width: 700,
            padding: 40,
          }}
        >

          <h1 className="title">

            Room {roomId}

          </h1>

          <p
            className="subtitle"
            style={{
              marginTop: 20,
            }}
          >
            Share this room with your friends.
          </p>

          <button
            onClick={copyLink}
            style={{
              marginTop: 20,
            }}
          >
            Copy Invite Link
          </button>

          <div
            style={{
              display: "grid",
              gap: 16,
              marginTop: 30,
            }}
          >
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                active={player.id === me.playerId}
              />
            ))}
          </div>

          {isHost && (
            <button
              style={{
                marginTop: 30,
              }}
              disabled={players.length < 2}
              onClick={startGame}
            >
              Start Game
            </button>
          )}

        </div>

      </div>
    );
  }

  const currentTurn = gameState.turnIndex;

  const canRoll =
    !gameState.winner &&
    gameState.phase === "ROLL" &&
    gameState.players[currentTurn]?.color === me.color;

  return (
    <GameLayout
      topLeft={
        <PlayerCard
          player={gameState.players[0]}
          active={currentTurn === 0}
        />
      }
      topRight={
        <PlayerCard
          player={gameState.players[1]}
          active={currentTurn === 1}
        />
      }
      bottomLeft={
        <PlayerCard
          player={gameState.players[2]}
          active={currentTurn === 2}
        />
      }
      bottomRight={
        <PlayerCard
          player={gameState.players[3]}
          active={currentTurn === 3}
        />
      }
      board={
        <BoardContainer
          board={gameState.board}
          players={gameState.players}
          currentPlayer={currentTurn}
          onPawnClick={move}
        />
      }
      status={
        <DiceButton
          value={gameState.dice}
          canRoll={canRoll}
          onRoll={roll}
        />
      }
    />
  );
}