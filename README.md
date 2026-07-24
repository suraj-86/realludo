# Ludo — Hybrid Online

No login. No sign-up. Three ways to play:
- **Pass & Play** — one device, 2–4 players take turns
- **Vs Bot** — play against a simple heuristic bot
- **Online room** — create a room, share the link (WhatsApp etc.), 2–4 people join and play in real time, no accounts

> ⚠️ **This code was written but not run/tested** — the build environment it was written in has no network access, so `npm install` was never executed. The logic and structure are sound, but expect to fix a stray import path or dependency-version hiccup on first run. Treat this as a strong, complete first draft.

## Project structure

```
ludo/
├── packages/
│   ├── engine/   pure game rules — shared by client & server, no UI/network code
│   ├── server/   Express + Socket.IO room server (in-memory, no database)
│   └── client/   React + Vite frontend
```

The **engine** is the single source of truth for Ludo rules. Local modes (Pass & Play, Vs Bot) run it directly in the browser. Online mode runs it on the server; the server is authoritative and clients just render whatever state it broadcasts — this is what keeps 4 phones in sync without a database.

## Setup

```bash
# from the repo root
npm install          # installs all 3 workspaces at once (needs network)
```

Create your env files:

```bash
cp packages/server/.env.example packages/server/.env
cp packages/client/.env.example packages/client/.env
```

Defaults are already set for local dev (server on :4000, client on :5173).

## Run locally

Two terminals:

```bash
npm run dev:server     # starts the Socket.IO server on :4000
npm run dev:client     # starts Vite dev server on :5173
```

Open `http://localhost:5173`. To test on your phone during dev, make sure your phone is on the same WiFi and open `http://<your-computer's-LAN-IP>:5173` — `vite.config.js` already has `host: true` so it's exposed on the LAN. You'll also need to point `VITE_SERVER_URL` at your computer's LAN IP (not `localhost`) for the phone to reach the server.

## How each mode works

- **Pass & Play / Vs Bot** (`src/hooks/useLocalGame.js`) — a `useReducer` wrapping the engine directly. Vs Bot just runs `decideBotMove()` on a timer when it's a bot's turn.
- **Online** (`src/pages/OnlineRoom.jsx`) — creates/joins a room via Socket.IO, then every dice roll / token move is an emit to the server; the server runs the engine and broadcasts the resulting state back to everyone in the room. The client never trusts its own guess of the game state in this mode.

## Known rough edges to expect / polish

1. **Board coordinates** (`src/coords.js`) — a standard 15×15 Ludo layout, but hand-placed. Once you see it rendered, you'll likely want to nudge the yard-slot or home-column positions slightly for visual polish.
2. **Reconnect on refresh** — handled via `sessionStorage` (`playerId` + `color` per room), but only lightly exercised; test refreshing mid-game on a phone browser (especially WhatsApp's in-app browser) specifically.
3. **No disconnect→bot takeover** — if someone leaves an online game mid-match, the game currently just waits on their turn. Worth adding "auto-skip after N seconds" or "convert to bot" if you want to harden this.
4. **No unit tests yet** — `packages/engine` is pure functions and is the highest-value place to add tests (dice/move logic, capture logic, win condition) before you trust it fully.
5. **CORS/env** — `CLIENT_URL` on the server must exactly match wherever the client is hosted, or Socket.IO's CORS check will silently reject connections.

## Deploying

- **Client** → Vercel or Netlify. Set `VITE_SERVER_URL` to your deployed server's URL.
- **Server** → Render, Railway, or Fly.io — needs a persistent process (not a serverless function) because Socket.IO holds long-lived connections. Set `CLIENT_URL` to your deployed client's URL.
- If you scale the server beyond one instance, either enable sticky sessions or add the Socket.IO Redis adapter — right now room state lives in a single process's memory (`packages/server/rooms.js`).

## Adding persistence later (optional)

Nothing here needs a database for v1. If you later want win/loss stats or leaderboards, add Postgres and write a row only when a game finishes (`applyMove` in `packages/engine/rules.js` sets `state.winner` — that's your hook point) keyed by an anonymous device-generated ID. It's additive; it doesn't touch the realtime path.
