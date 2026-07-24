// rooms.js — in-memory room store. No database. Rooms are ephemeral:
// created when someone hits "Create Room", garbage-collected after
// being idle for a while.

import { customAlphabet } from 'nanoid';

// Avoid ambiguous characters (0/O, 1/I) since this gets typed/shared.
const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

const MAX_PLAYERS = 4;
const IDLE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const COLOR_ORDER = ['red', 'green', 'yellow', 'blue'];

/** @type {Map<string, Room>} */
const rooms = new Map();

/**
 * @typedef {Object} Player
 * @property {string} id        stable client-generated id (survives refresh)
 * @property {string} name
 * @property {string} color
 * @property {string|null} socketId
 * @property {boolean} connected
 * @property {boolean} isHost
 */

export function createRoom() {
  const id = nanoid();
  const room = {
    id,
    players: /** @type {Player[]} */ ([]),
    state: null, // engine game state once started
    started: false,
    createdAt: Date.now(),
    lastActivity: Date.now(),
  };
  rooms.set(id, room);
  return room;
}

export function getRoom(id) {
  return rooms.get(id?.toUpperCase());
}

export function touch(room) {
  room.lastActivity = Date.now();
}

export function nextAvailableColor(room) {
  const used = new Set(room.players.map((p) => p.color));
  return COLOR_ORDER.find((c) => !used.has(c));
}

export function isFull(room) {
  return room.players.length >= MAX_PLAYERS;
}

export function removePlayerBySocket(socketId) {
  for (const room of rooms.values()) {
    const player = room.players.find((p) => p.socketId === socketId);
    if (player) {
      player.connected = false;
      player.socketId = null;
      touch(room);
      return { room, player };
    }
  }
  return null;
}

export function cleanupStaleRooms() {
  const now = Date.now();
  for (const [id, room] of rooms) {
    if (now - room.lastActivity > IDLE_TTL_MS) rooms.delete(id);
  }
}

export const MAX_PLAYERS_PER_ROOM = MAX_PLAYERS;
