# Luminari Web

First-party React and Node web MUD client for LuminariMUD-compatible games, with a browser UI, WebSocket-to-Telnet proxy, and MSDP-driven HUD state.

## Quick Start

Install dependencies once:

```bash
npm install
```

Run the frontend and proxy together:

```bash
npm run dev
```

Default local services:

- Frontend: `http://localhost:5190`
- Proxy/API server: `http://localhost:5191`
- Health check: `http://localhost:5191/health`

## Repository Structure

```text
.
|-- src/                 # React browser client
|-- server/              # Express and WebSocket-to-Telnet proxy
|-- shared/              # Shared app settings and MUD protocol types
|-- public/              # Static browser assets
|-- docs/                # Project documentation
|-- .spec_system/        # Product requirements, phase plans, and workflow state
|-- package.json         # npm scripts and dependencies
\-- vite.config.ts       # Vite frontend and dev proxy configuration
```

## Documentation

- [Onboarding](docs/onboarding.md)
- [Development Guide](docs/development.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Environments](docs/environments.md)
- [Deployment](docs/deployment.md)
- [API and WebSocket Contracts](docs/api/http-and-websocket.md)
- [Contributing](CONTRIBUTING.md)
- [Product Requirements](.spec_system/PRD/PRD.md)

## Current Capabilities

- Browser terminal output rendered from Telnet text and ANSI sequences.
- React HUD and side panels for character, combat, quest, group, and affects data when matching MSDP values arrive.
- Command input with history, tab completion, numpad movement, aliases, triggers, and import/export for client configuration.
- Runtime app settings endpoint at `/api/settings`.
- WebSocket endpoint at `/ws` that bridges browser messages to a Telnet MUD connection.
- Telnet negotiation for MSDP, TTYPE, NAWS, ECHO, and SGA, with MCCP, MXP, and CHARSET currently rejected.
- Curated MUD presets plus manual host and port input.

## Protocol Status

The code currently requests and maps several MSDP variables. The product plan records that some defaults, including `TITLE`, `QUEST_INFO`, save fields, and live `MINIMAP`, are not confirmed as emitted by the audited Luminari-Source server. Phase 00 is planned to align defaults with confirmed source variables and make missing data states explicit.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| TypeScript | Shared frontend, server, and protocol typing |
| React | Browser client UI |
| Vite | Frontend development server and production build |
| Express | HTTP server for health, settings, and static assets |
| `ws` | Browser WebSocket server |
| Node `net` | Telnet socket from proxy to MUD server |
| `ansi-to-html` | Current terminal text rendering |

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Run frontend and proxy together |
| `npm run dev:client` | Run Vite only |
| `npm run dev:server` | Run the proxy server only |
| `npm run lint` | Run ESLint |
| `npm run build` | Type-check and build client/server output |
| `npm run preview` | Preview built client assets |
| `npm start` | Run the built server from `dist/server/index.js` |

## Configuration

Primary defaults live in [shared/app-settings.ts](shared/app-settings.ts). The browser loads those settings at runtime from `/api/settings`.

Environment overrides:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `5191` | HTTP/WebSocket server port |
| `VITE_WS_URL` | same-origin `/ws` | Browser WebSocket target override |

## Project Status

The spec system is active. Current roadmap and phase status are tracked in [.spec_system/PRD/PRD.md](.spec_system/PRD/PRD.md) and [.spec_system/state.json](.spec_system/state.json).
