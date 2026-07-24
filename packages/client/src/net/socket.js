import { io } from "socket.io-client";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

export const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

let connecting = false;

export function ensureConnected() {
  if (socket.connected || connecting) return;

  connecting = true;

  socket.connect();

  socket.once("connect", () => {
    connecting = false;
    console.log("[socket] connected:", socket.id);
  });

  socket.once("disconnect", (reason) => {
    console.log("[socket] disconnected:", reason);
  });

  socket.io.on("reconnect", (attempt) => {
    console.log("[socket] reconnected:", attempt);
  });

  socket.io.on("reconnect_attempt", () => {
    console.log("[socket] reconnecting...");
  });

  socket.io.on("error", (err) => {
    console.error("[socket]", err);
  });
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export function emit(event, payload = {}) {
  return new Promise((resolve) => {
    socket.emit(event, payload, (response) => {
      resolve(response);
    });
  });
}

export function on(event, handler) {
  socket.on(event, handler);

  return () => socket.off(event, handler);
}

export function once(event, handler) {
  socket.once(event, handler);
}

export function off(event, handler) {
  socket.off(event, handler);
}

export default socket;