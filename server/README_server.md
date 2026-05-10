# Proxy Server

Express and WebSocket server that bridges browser clients to Telnet MUD servers.

## Run Commands

| Command | Purpose |
|---------|---------|
| `npm run dev:server` | Run the proxy with `tsx watch` |
| `npm run dev` | Run proxy and frontend together |
| `npm start` | Run built server output |

## Responsibilities

- Serve `GET /health`.
- Serve `GET /api/settings`.
- Serve built frontend assets from `dist/client`.
- Accept WebSocket connections at `/ws`.
- Open Telnet sockets with Node `net`.
- Negotiate Telnet options and parse MSDP updates.
- Map MSDP variables into partial `MudState` messages.

Public deployment hardening is still planned in the PRD and is not complete in the current server implementation.
