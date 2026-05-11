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
- [Bridge Deployment Options](docs/bridge-deployment-options.md)
- [Bridge Fallback Runbook](docs/runbooks/bridge-fallback.md)
- [Protocol Feature Checklist](docs/protocol-feature-checklist.md)
- [API and WebSocket Contracts](docs/api/http-and-websocket.md)
- [Tests](tests/README.md)
- [Contributing](CONTRIBUTING.md)
- [Product Requirements](.spec_system/PRD/PRD.md)

## Current Capabilities

- Browser terminal output rendered from Telnet text and ANSI sequences.
- React HUD and side panels for character, combat, group, affects, inventory, room, map, and quest data when matching MSDP values arrive.
- Command input with history, tab completion, numpad movement, aliases, triggers, and import/export for client configuration.
- Dynamic terminal resize updates the proxy NAWS state when the server has negotiated support.
- Runtime app settings endpoint at `/api/settings`.
- WebSocket endpoint at `/ws` that bridges browser messages to a Telnet MUD connection.
- Telnet negotiation for MSDP, TTYPE, NAWS, ECHO, and SGA, with MCCP, MXP, and CHARSET currently rejected.
- Protocol status checklist and inspector coverage for supported, partial, rejected, deferred, and validation-gap protocol claims.
- Public proxy guardrails for origin checks, destination allowlists, banned ports, DNS/IP safety, quotas, and timeouts.
- Fixture-backed MSDP mapping tests and normalized shared state helpers for parser and state coverage.
- Curated MUD presets plus manual host and port input for private or operator-approved routing.

## Protocol Status

Phase 00 aligned the client with confirmed Luminari-Source MSDP data and made unsupported data states explicit. Phase 01 hardened the Telnet parser, reconnect lifecycle, resize handling, renderer decision, and public proxy safety. Phase 02 added the character, combat, group, affects, inventory, room, map, and quest fallback panels. Phase 03 records protocol support boundaries in the [Protocol Feature Checklist](docs/protocol-feature-checklist.md). The product plan still tracks source-level protocol work in later phases.

## Tech Stack

| Technology     | Purpose                                             |
| -------------- | --------------------------------------------------- |
| TypeScript     | Shared frontend, server, and protocol typing        |
| React          | Browser client UI                                   |
| Vite           | Frontend development server and production build    |
| Express        | HTTP server for health, settings, and static assets |
| `ws`           | Browser WebSocket server                            |
| Node `net`     | Telnet socket from proxy to MUD server              |
| `ansi-to-html` | Current terminal text rendering                     |

## Commands

| Command              | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Run frontend and proxy together                  |
| `npm run dev:client` | Run Vite only                                    |
| `npm run dev:server` | Run the proxy server only                        |
| `npm run lint`       | Run ESLint                                       |
| `npm run build`      | Type-check and build client/server output        |
| `npm test`           | Run focused MSDP mapping and fixture tests       |
| `npm run preview`    | Preview built client assets                      |
| `npm start`          | Run the built server from `dist/server/index.js` |

## Configuration

Primary defaults live in [shared/app-settings.ts](shared/app-settings.ts). The browser loads those settings at runtime from `/api/settings`.

Environment overrides:

| Variable                          | Default           | Purpose                                      |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `PORT`                            | `5191`            | HTTP/WebSocket server port                   |
| `VITE_WS_URL`                     | same-origin `/ws` | Browser WebSocket target override            |
| `PROXY_PUBLIC_MODE`               | `true`            | Keep public proxy routing allowlisted        |
| `PROXY_ALLOWED_ORIGINS`           | local dev origins | Public browser origins allowed to open `/ws` |
| `PROXY_ALLOWED_DESTINATIONS`      | curated presets   | Server-only extra `host:port` MUD routes     |
| `PROXY_ALLOW_CUSTOM_DESTINATIONS` | `false` in public | Explicit operator opt-in for custom routes   |

The supported public deployment path is the integrated game-aware proxy. Bridge
fallbacks are separate terminal-only transport options, not replacements for the
React app's `/ws` protocol.

## Project Status

The spec system is active. Current roadmap and phase status are tracked in [.spec_system/PRD/PRD.md](.spec_system/PRD/PRD.md) and [.spec_system/state.json](.spec_system/state.json).
