// socketHandlers.js — all realtime events live here. The server is the
// authority: it runs the shared @ludo/engine and only ever broadcasts
// the resulting state. Clients never mutate game state themselves in
// online mode — they just render whatever they're sent.

import { createGame, rollDice, applyMove } from '@ludo/engine';
import {
  createRoom,
  getRoom,
  touch,
  nextAvailableColor,
  isFull,
  removePlayerBySocket,
} from './rooms.js';

function publicPlayers(room) {
  return room.players.map(({ id, name, color, connected, isHost }) => ({
    id,
    name,
    color,
    connected,
    isHost,
  }));
}

function isPlayersTurn(room, playerId) {
  if (!room.state) return false;
  const current = room.state.players[room.state.turnIndex];
  const player = room.players.find((p) => p.id === playerId);
  return player && current && current.color === player.color;
}

export function registerSocketHandlers(io, socket) {
  socket.on('create-room', ({ name }, cb) => {
    const room = createRoom();
    const player = {
      id: socket.id + '-' + Date.now(), // stable id, independent of socket
      name: name?.slice(0, 20) || 'Player 1',
      color: nextAvailableColor(room),
      socketId: socket.id,
      connected: true,
      isHost: true,
    };
    room.players.push(player);
    socket.join(room.id);
    cb?.({ ok: true, roomId: room.id, playerId: player.id, color: player.color });
  });

  socket.on('join-room', ({ roomId, name, playerId }, cb) => {
    const room = getRoom(roomId);
    if (!room) return cb?.({ ok: false, error: 'Room not found' });

    // Reconnect case: same playerId rejoining (e.g. page refresh).
    const existing = room.players.find((p) => p.id === playerId);
    if (existing) {
      existing.socketId = socket.id;
      existing.connected = true;
      socket.join(room.id);
      touch(room);
      io.to(room.id).emit('room-update', publicPlayers(room));
      return cb?.({
        ok: true,
        roomId: room.id,
        playerId: existing.id,
        color: existing.color,
        state: room.state,
      });
    }

    if (room.started) return cb?.({ ok: false, error: 'Game already started' });
    if (isFull(room)) return cb?.({ ok: false, error: 'Room is full' });

    const player = {
      id: socket.id + '-' + Date.now(),
      name: name?.slice(0, 20) || `Player ${room.players.length + 1}`,
      color: nextAvailableColor(room),
      socketId: socket.id,
      connected: true,
      isHost: false,
    };
    room.players.push(player);
    socket.join(room.id);
    touch(room);
    io.to(room.id).emit('room-update', publicPlayers(room));
    cb?.({ ok: true, roomId: room.id, playerId: player.id, color: player.color });
  });

  socket.on('start-game', ({ roomId, playerId }) => {
    const room = getRoom(roomId);
    if (!room) return;
    const player = room.players.find((p) => p.id === playerId);
    if (!player?.isHost) return;
    if (room.players.length < 2) return;

    room.started = true;
    room.state = createGame(room.players.map((p) => ({ color: p.color, name: p.name })));
    touch(room);
    io.to(room.id).emit('game-started', room.state);
  });

  socket.on('roll-dice', ({ roomId, playerId }) => {
    const room = getRoom(roomId);
    if (!room?.state) return;
    if (!isPlayersTurn(room, playerId)) return;
    room.state = rollDice(room.state);
    touch(room);
    io.to(room.id).emit('game-state', room.state);
  });

  socket.on('move-token', ({ roomId, playerId, tokenIndex }) => {
    const room = getRoom(roomId);
    if (!room?.state) return;
    if (!isPlayersTurn(room, playerId)) return;
    room.state = applyMove(room.state, tokenIndex);
    touch(room);
    io.to(room.id).emit('game-state', room.state);
  });

  socket.on('leave-room', ({ roomId, playerId }) => {
    const room = getRoom(roomId);
    if (!room) return;
    const player = room.players.find((p) => p.id === playerId);
    if (player) {
      player.connected = false;
      player.socketId = null;
      touch(room);
      io.to(room.id).emit('room-update', publicPlayers(room));
    }
  });

  socket.on('disconnect', () => {
    const result = removePlayerBySocket(socket.id);
    if (result) {
      io.to(result.room.id).emit('room-update', publicPlayers(result.room));
    }
  });
}
