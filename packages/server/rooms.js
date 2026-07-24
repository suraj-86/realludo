// rooms.js
// In-memory room manager.

import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  6
);

const MAX_PLAYERS = 4;
const ROOM_TIMEOUT = 30 * 60 * 1000;

const COLORS = [
  "red",
  "green",
  "yellow",
  "blue",
];

const rooms = new Map();

export function createRoom() {
  const room = {
    id: nanoid(),
    players: [],
    state: null,
    started: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  rooms.set(room.id, room);

  return room;
}

export function getRoom(id) {
  if (!id) return null;
  return rooms.get(id.toUpperCase()) ?? null;
}

export function roomExists(id) {
  return rooms.has(id.toUpperCase());
}

export function updateRoom(room) {
  room.updatedAt = Date.now();
}

export function nextAvailableColor(room) {
  const used = new Set(
    room.players.map((p) => p.color)
  );

  return COLORS.find((c) => !used.has(c));
}

export function isRoomFull(room) {
  return room.players.length >= MAX_PLAYERS;
}

export function addPlayer(
  room,
  playerId,
  socketId,
  name
) {
  if (isRoomFull(room)) {
    return null;
  }

  const player = {
    id: playerId,
    socketId,
    name,
    color: nextAvailableColor(room),
    connected: true,
    isHost: room.players.length === 0,
  };

  room.players.push(player);

  updateRoom(room);

  return player;
}

export function reconnectPlayer(
  room,
  playerId,
  socketId
) {
  const player = room.players.find(
    (p) => p.id === playerId
  );

  if (!player) return null;

  player.socketId = socketId;
  player.connected = true;

  updateRoom(room);

  return player;
}

export function removeSocket(socketId) {
  for (const room of rooms.values()) {
    const player = room.players.find(
      (p) => p.socketId === socketId
    );

    if (!player) continue;

    player.connected = false;
    player.socketId = null;

    updateRoom(room);

    return {
      room,
      player,
    };
  }

  return null;
}

export function deleteRoom(id) {
  rooms.delete(id);
}

export function cleanupRooms() {
  const now = Date.now();

  for (const [id, room] of rooms.entries()) {
    if (now - room.updatedAt > ROOM_TIMEOUT) {
      rooms.delete(id);
    }
  }
}

export function getAllRooms() {
  return [...rooms.values()];
}

export {
  MAX_PLAYERS,
  COLORS,
};