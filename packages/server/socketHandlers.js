// socketHandlers.js
// All realtime Socket.IO events.

import {
  createGame,
  rollDice,
  applyMove,
} from "@ludo/engine";

import {
  createRoom,
  getRoom,
  updateRoom,
  nextAvailableColor,
  isRoomFull,
  removeSocket,
} from "./rooms.js";

function publicPlayers(room) {
  return room.players.map(
    ({
      id,
      name,
      color,
      connected,
      isHost,
    }) => ({
      id,
      name,
      color,
      connected,
      isHost,
    })
  );
}

function isPlayersTurn(room, playerId) {
  if (!room.state) return false;

  const current =
    room.state.players[room.state.turnIndex];

  const player = room.players.find(
    (p) => p.id === playerId
  );

  return (
    player &&
    current &&
    current.color === player.color
  );
}

export function registerSocketHandlers(
  io,
  socket
) {
  socket.on(
    "create-room",
    ({ name }, callback) => {
      const room = createRoom();

      const player = {
        id: `${socket.id}-${Date.now()}`,
        name:
          name?.trim().slice(0, 20) ||
          "Player 1",
        color: nextAvailableColor(room),
        socketId: socket.id,
        connected: true,
        isHost: true,
      };

      room.players.push(player);

      socket.join(room.id);

      callback?.({
        ok: true,
        roomId: room.id,
        playerId: player.id,
        color: player.color,
      });
    }
  );

  socket.on(
    "join-room",
    (
      {
        roomId,
        name,
        playerId,
      },
      callback
    ) => {
      const room = getRoom(roomId);

      if (!room) {
        return callback?.({
          ok: false,
          error: "Room not found",
        });
      }

      const existing =
        room.players.find(
          (p) => p.id === playerId
        );

      if (existing) {
        existing.socketId = socket.id;
        existing.connected = true;

        socket.join(room.id);

        updateRoom(room);

        io.to(room.id).emit(
          "room-update",
          publicPlayers(room)
        );

        return callback?.({
          ok: true,
          roomId: room.id,
          playerId: existing.id,
          color: existing.color,
          state: room.state,
        });
      }

      if (room.started) {
        return callback?.({
          ok: false,
          error: "Game already started",
        });
      }

      if (isRoomFull(room)) {
        return callback?.({
          ok: false,
          error: "Room is full",
        });
      }

      const player = {
        id: `${socket.id}-${Date.now()}`,
        name:
          name?.trim().slice(0, 20) ||
          `Player ${room.players.length + 1}`,
        color: nextAvailableColor(room),
        socketId: socket.id,
        connected: true,
        isHost: false,
      };

      room.players.push(player);

      socket.join(room.id);

      updateRoom(room);

      io.to(room.id).emit(
        "room-update",
        publicPlayers(room)
      );

      callback?.({
        ok: true,
        roomId: room.id,
        playerId: player.id,
        color: player.color,
      });
    }
  );

  socket.on(
    "start-game",
    ({ roomId, playerId }) => {
      const room = getRoom(roomId);

      if (!room) return;

      const player =
        room.players.find(
          (p) => p.id === playerId
        );

      if (!player?.isHost) return;

      if (room.players.length < 2) return;

      room.started = true;

      room.state = createGame(
        room.players.map((p) => ({
          color: p.color,
          name: p.name,
        }))
      );

      updateRoom(room);

      io.to(room.id).emit(
        "game-started",
        room.state
      );
    }
  );

  socket.on(
    "roll-dice",
    ({ roomId, playerId }) => {
      const room = getRoom(roomId);

      if (!room?.state) return;

      if (
        !isPlayersTurn(room, playerId)
      )
        return;

      room.state = rollDice(room.state);

      updateRoom(room);

      io.to(room.id).emit(
        "game-state",
        room.state
      );
    }
  );

  socket.on(
    "move-token",
    ({
      roomId,
      playerId,
      tokenIndex,
    }) => {
      const room = getRoom(roomId);

      if (!room?.state) return;

      if (
        !isPlayersTurn(room, playerId)
      )
        return;

      room.state = applyMove(
        room.state,
        tokenIndex
      );

      updateRoom(room);

      io.to(room.id).emit(
        "game-state",
        room.state
      );
    }
  );

  socket.on(
    "leave-room",
    ({ roomId, playerId }) => {
      const room = getRoom(roomId);

      if (!room) return;

      const player =
        room.players.find(
          (p) => p.id === playerId
        );

      if (!player) return;

      player.connected = false;
      player.socketId = null;

      updateRoom(room);

      io.to(room.id).emit(
        "room-update",
        publicPlayers(room)
      );
    }
  );

  socket.on("disconnect", () => {
    const result =
      removeSocket(socket.id);

    if (!result) return;

    io.to(result.room.id).emit(
      "room-update",
      publicPlayers(result.room)
    );
  });
}