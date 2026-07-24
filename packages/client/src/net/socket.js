import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

// Single shared socket for the whole app. autoConnect:false so we only
// open the connection once we actually enter online mode.
export const socket = io(SERVER_URL, { autoConnect: false });

export function ensureConnected() {
  if (!socket.connected) socket.connect();
  return socket;
}
