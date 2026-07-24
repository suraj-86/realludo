import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { registerSocketHandlers } from "./socketHandlers.js";
import { cleanupRooms } from "./rooms.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    service: "Ludo Server",
    status: "running",
  });
});

app.get("/health", (_, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  registerSocketHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

setInterval(() => {
  cleanupRooms();
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
==================================
🎲 Ludo Server Running
==================================
Port : ${PORT}
==================================
`);
});