# Architecture

## System Overview

Luminari Web is a single TypeScript project with a React browser client and a Node proxy server. The browser cannot open Telnet sockets directly, so it talks to the local server over HTTP and WebSocket. The server opens the Telnet connection to the selected MUD and translates terminal text, connection status, and MSDP state updates back to the browser.

```text
Browser
  |-- HTTP GET /api/settings
  |-- WebSocket /ws
  v
Express and ws proxy
  |-- Node net socket
  v
Telnet MUD server
```

## Components

### Browser Client

- **Purpose**: Render terminal output, connection controls, HUD bars, side panels for character, combat, group, affects, inventory, room, map, and quest data, plus aliases, triggers, settings, and import/export controls.
- **Tech**: React, TypeScript, CSS, Vite.
- **Location**: `src/`

### Proxy Server

- **Purpose**: Serve health and settings endpoints, serve built frontend assets in production, accept browser WebSocket messages, connect to Telnet MUD servers, negotiate Telnet options, parse MSDP, and forward updates.
- **Tech**: Express, `ws`, Node `net`, TypeScript.
- **Location**: `server/`

### Shared Protocol and Settings

- **Purpose**: Define app settings, MUD presets, browser/server message types, MSDP variable mappings, shared MSDP mapping helpers, and client-visible MUD state fields and display models.
- **Tech**: TypeScript.
- **Location**: `shared/`
- **Protocol status**: [`shared/protocol-feature-status.ts`](../shared/protocol-feature-status.ts) is the typed catalog for supported, partial, rejected, deferred, and validation-gap protocol claims.

## Runtime Data Flow

1. Browser loads app settings from `GET /api/settings`.
2. Browser opens `WebSocket /ws`.
3. Browser sends a `connect` message with host, port, and MSDP variable mapping.
4. Server validates the browser message, origin policy, host, port, destination allowlist, banned ports, and network safety before opening a Telnet socket.
5. Telnet parser forwards text as `terminal` messages.
6. When MSDP is available, the server sends client identity and report requests for configured variables.
7. Parsed MSDP updates are normalized by `shared/msdp-state.ts`, mapped to partial `MudState` objects, and then converted by shared display helpers into explicit panel states for character, combat, group, affects, inventory, room, map, and quest views.
8. Shared fixture tests load `tests/fixtures/msdp/manifest.json` and exercise the same mapping helpers without a live MUD connection.
9. Browser sends command input as `input` messages; the proxy writes them to the Telnet socket.

## Deployment Boundary

Public production should place the integrated Express and `ws` proxy behind an
operator-managed HTTPS/WSS terminator. The app still talks to same-origin
`/api/settings`, `/health`, and `/ws`; the reverse proxy handles TLS,
WebSocket upgrades, host firewall exposure, and platform monitoring.

Standalone WebSocket-to-TCP bridges are blind byte forwarders from this
architecture's point of view. They do not understand the browser JSON `/ws`
contract, Telnet/MSDP state mapping, reconnect cleanup, or UI status semantics.
If an operator needs more isolation, isolate the integrated proxy first through
process, host, container, network, reverse-proxy, or firewall boundaries. Bridge
fallbacks belong on separate terminal-only paths. The full decision is in
[Bridge Deployment Options](bridge-deployment-options.md).

## Terminal Rendering

The production terminal renderer remains the escaped `ansi-to-html` HTML path. Terminal and panel rich text use shared helpers under `src/terminal/render-mud-html.ts` so XML escaping and Luminari color conversion stay centralized and testable.

An xterm.js renderer spike is available only through `?terminalRenderer=xterm-spike`. It consumes the same raw terminal stream, disables xterm stdin, keeps the existing command input authoritative, and routes fit-derived dimensions through the existing resize pathway. The staged migration decision is recorded in [adr/0001-terminal-renderer.md](adr/0001-terminal-renderer.md).

## HTTP Endpoints

| Endpoint            | Purpose                                                         |
| ------------------- | --------------------------------------------------------------- |
| `GET /health`       | Returns `{ "ok": true }` for local and deployment health checks |
| `GET /api/settings` | Returns runtime settings from `shared/app-settings.ts`          |
| `GET /*`            | Serves built frontend assets outside development                |

WebSocket details are documented in [api/http-and-websocket.md](api/http-and-websocket.md).

## Protocol Support Boundary

The current supported protocol path is browser JSON over `/ws`, an integrated
proxy Telnet socket, and MSDP-backed state mapping. Maintainers should use the
[Protocol Feature Checklist](protocol-feature-checklist.md) before changing or
claiming protocol support.

Current high-level boundaries:

- Client and proxy support ANSI terminal rendering, UTF-8 decoding, TTYPE,
  NAWS, and MSDP for the documented app workflow.
- The proxy rejects MCCP, MXP, and CHARSET today.
- GMCP, MSP, MSSP consumption, native source WebSocket, live `DAMAGE_BONUS`,
  and structured `QUEST_INFO` remain source-level or validation-gap work.
- `TITLE`, saves, and `MINIMAP` are source-backed MSDP defaults, but older
  servers may still omit them and must keep explicit fallback states.

The UI can expose these boundaries as static protocol status. It must not infer
live negotiation state unless the browser already receives reliable state for
that feature.

## Tech Stack Rationale

| Technology     | Purpose               | Why Chosen                                                           |
| -------------- | --------------------- | -------------------------------------------------------------------- |
| TypeScript     | Shared app language   | Keeps frontend, server, and protocol contracts typed                 |
| React          | Browser UI            | Matches the current app and supports stateful panels                 |
| Vite           | Development and build | Provides fast dev server and production bundling                     |
| Express        | HTTP server           | Small server surface for health, settings, and static assets         |
| `ws`           | WebSocket transport   | Direct Node WebSocket support for browser-to-proxy messages          |
| Node `net`     | Telnet transport      | Required to open TCP sockets from the server side                    |
| `ansi-to-html` | Terminal rendering    | Current renderer for ANSI-colored terminal text                      |
| xterm.js       | Terminal spike        | Preferred long-term renderer candidate, gated behind an opt-in spike |

## Data Layer

There is no database. First-release settings, aliases, triggers, and display preferences are browser-local. Current automation settings are stored in browser cookies and can be imported or exported through the UI.

## Security Posture

The proxy now defaults to public-mode guardrails before opening outbound MUD
sockets. It checks WebSocket origins, destination allowlists, banned service
ports, direct IP literals, DNS results, unsafe networks, metadata-service
targets, HTTP request rates, active WebSocket counts, per-socket command rates,
duplicate in-flight connects, connect timeouts, idle timeouts, and DNS timeout
settings. Policy and timeout errors use stable sanitized details and do not
intentionally include player command text.

Public deployments still require controls outside this repository: HTTPS/WSS
termination, reverse-proxy policy, host firewalling, process supervision,
health checks, alerting, and log retention/redaction.

## Key Decisions

The roadmap and settled product decisions are tracked in [.spec_system/PRD/PRD.md](../.spec_system/PRD/PRD.md). Reference repositories under `EXAMPLES/` are research inputs only and are not runtime dependencies.
