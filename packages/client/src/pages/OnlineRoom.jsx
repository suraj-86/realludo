import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board.jsx';
import Dice from '../components/Dice.jsx';
import PlayerPanel from '../components/PlayerPanel.jsx';
import { ensureConnected, socket } from '../net/socket.js';

function loadIdentity(roomId) {
  try {
    return JSON.parse(sessionStorage.getItem(`ludo-room-${roomId}`) || 'null');
  } catch {
    return null;
  }
}

function saveIdentity(roomId, identity) {
  sessionStorage.setItem(`ludo-room-${roomId}`, JSON.stringify(identity));
}

function shareUrl(roomId) {
  return `${window.location.origin}/room/${roomId}`;
}

function statusText(state, myColor) {
  if (!state) return '';
  if (state.winner) {
    const winner = state.players.find((p) => p.color === state.winner);
    return `${winner.name} wins! 🎉`;
  }
  const player = state.players[state.turnIndex];
  const mine = player.color === myColor;
  if (state.phase === 'ROLL') return mine ? 'Your turn — roll the dice' : `${player.name}'s turn`;
  return mine ? 'Pick a token to move' : `${player.name} is moving…`;
}

export default function OnlineRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [me, setMe] = useState(loadIdentity(roomId));
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    ensureConnected();

    const onRoomUpdate = (p) => setPlayers(p);
    const onGameStarted = (s) => setGameState(s);
    const onGameState = (s) => setGameState(s);

    socket.on('room-update', onRoomUpdate);
    socket.on('game-started', onGameStarted);
    socket.on('game-state', onGameState);

    // If we already have an identity for this room (e.g. we created it,
    // or we're rejoining after a refresh), join automatically.
    if (me) {
      socket.emit(
        'join-room',
        { roomId, playerId: me.playerId, name: me.name },
        (res) => {
          if (res?.ok) {
            setPlayers((prev) => prev); // room-update event will follow
            if (res.state) setGameState(res.state);
          } else if (res?.error) {
            setError(res.error);
          }
        }
      );
    }

    return () => {
      socket.off('room-update', onRoomUpdate);
      socket.off('game-started', onGameStarted);
      socket.off('game-state', onGameState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const join = () => {
    setJoining(true);
    ensureConnected();
    socket.emit('join-room', { roomId, name: name || undefined }, (res) => {
      setJoining(false);
      if (!res?.ok) return setError(res?.error || 'Could not join room');
      const identity = { playerId: res.playerId, color: res.color, name };
      saveIdentity(roomId, identity);
      setMe(identity);
      if (res.state) setGameState(res.state);
    });
  };

  const startGame = () => {
    socket.emit('start-game', { roomId, playerId: me.playerId });
  };

  const roll = () => socket.emit('roll-dice', { roomId, playerId: me.playerId });
  const move = (tokenIndex) =>
    socket.emit('move-token', { roomId, playerId: me.playerId, tokenIndex });

  const copyLink = async () => {
    const url = shareUrl(roomId);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join my Ludo game', url });
        return;
      } catch {
        /* user cancelled share sheet, fall through to clipboard */
      }
    }
    await navigator.clipboard.writeText(url);
    alert('Link copied — paste it into WhatsApp!');
  };

  if (error) {
    return (
      <div className="page">
        <h1 className="title">Hmm</h1>
        <p className="subtitle">{error}</p>
        <button className="btn" onClick={() => navigate('/')}>
          Back home
        </button>
      </div>
    );
  }

  // Not joined yet: show a name prompt.
  if (!me) {
    return (
      <div className="page">
        <h1 className="title">Join Room {roomId}</h1>
        <div className="card">
          <div className="row" style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
          </div>
          <button className="btn primary" onClick={join} disabled={joining}>
            {joining ? 'Joining…' : 'Join Game'}
          </button>
        </div>
      </div>
    );
  }

  // Joined, but game hasn't started: lobby.
  if (!gameState) {
    const isHost = players.find((p) => p.id === me.playerId)?.isHost;
    return (
      <div className="page">
        <h1 className="title">Room {roomId}</h1>
        <div className="card">
          <p className="subtitle" style={{ marginTop: 0 }}>
            Share this link on WhatsApp — friends can join without any sign-up.
          </p>
          <p className="share-link">{shareUrl(roomId)}</p>
          <button className="btn primary" onClick={copyLink} style={{ marginTop: 10 }}>
            Share Link
          </button>
        </div>

        <div className="card">
          <p className="subtitle" style={{ marginTop: 0 }}>
            Players ({players.length}/4)
          </p>
          <div className="player-panel">
            {players.map((p) => (
              <div key={p.id} className="player-chip active">
                <span className={`dot ${p.color}`} />
                {p.name}
                {p.id === me.playerId ? ' (you)' : ''}
                {!p.connected ? ' (left)' : ''}
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <button
            className="btn primary"
            onClick={startGame}
            disabled={players.length < 2}
          >
            {players.length < 2 ? 'Waiting for more players…' : 'Start Game'}
          </button>
        ) : (
          <p className="status-line">Waiting for host to start the game…</p>
        )}
      </div>
    );
  }

  // Game in progress.
  const canRoll =
    gameState.phase === 'ROLL' &&
    !gameState.winner &&
    gameState.players[gameState.turnIndex]?.color === me.color;

  return (
    <div className="page">
      <PlayerPanel players={gameState.players} turnIndex={gameState.turnIndex} myColor={me.color} />
      <div className="board-wrap">
        <Board gameState={gameState} myColor={me.color} onTokenClick={move} />
      </div>
      <div className="dice-area">
        <Dice value={gameState.dice} canRoll={canRoll} onRoll={roll} />
      </div>
      <p className="status-line">{statusText(gameState, me.color)}</p>
    </div>
  );
}
