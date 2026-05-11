# Proxy Server

Express and WebSocket server that bridges browser clients to Telnet MUD servers.

## Run Commands

| Command              | Purpose                         |
| -------------------- | ------------------------------- |
| `npm run dev:server` | Run the proxy with `tsx watch`  |
| `npm run dev`        | Run proxy and frontend together |
| `npm start`          | Run built server output         |

## Responsibilities

- Serve `GET /health`.
- Serve `GET /api/settings`.
- Serve built frontend assets from `dist/client`.
- Accept WebSocket connections at `/ws`.
- Validate browser WebSocket origins in public mode before acquiring proxy resources.
- Validate connect destinations against curated presets, server allowlists, banned ports, direct IP rules, DNS results, and unsafe network classifications before opening a TCP socket.
- Open Telnet sockets with Node `net`.
- Negotiate Telnet options and parse MSDP updates.
- Map MSDP variables into partial `MudState` messages through `shared/msdp-state.ts`.
- Limit HTTP request rates, active WebSocket connections per IP, command bursts per socket, duplicate in-flight connects, connect duration, and idle duration.
- Send stable sanitized connection statuses for policy, timeout, and connection failures.
- Avoid logging player command text by default.

## Public Deployment Controls

The server defaults to public mode through `PROXY_PUBLIC_MODE=true`. Public mode
allows curated MUD presets and server-only `PROXY_ALLOWED_DESTINATIONS` entries.
Production operators should also set `PROXY_ALLOWED_ORIGINS` to the deployed
HTTPS origin.

`PROXY_ALLOW_CUSTOM_DESTINATIONS=true` and `PROXY_PUBLIC_MODE=false` are operator
decisions for trusted or externally controlled deployments. They do not disable
unsafe-network or banned-port checks.

The first-party React app requires this integrated server for `/ws`. Blind
WebSocket-to-TCP bridges can be operated only as separate raw transport paths;
they do not replace the app protocol or MSDP state mapping.
