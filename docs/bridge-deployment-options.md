# Bridge Deployment Options

## Decision

Use the integrated Luminari Web proxy as the supported public deployment path.

The React app speaks an application WebSocket protocol at `/ws`. Browser
messages are JSON commands such as `connect`, `input`, `disconnect`,
`msdp-config`, and `resize`. Server messages include terminal text, connection
status, and MSDP-backed state updates. A blind WebSocket-to-TCP bridge forwards
bytes, but it does not validate those messages, negotiate Telnet/MSDP for the
app, emit game state, or preserve the app's status semantics.

Bridge projects under `EXAMPLES/` are deployment references only. They can
inform isolation, mapped-target, TLS, authorization, timeout, and logging
posture. They must not replace the current `/ws` protocol for the first-party
client, and no bridge source, configuration, service files, scripts, or
license-sensitive text should be copied into this repository.

## Default Public Topology

```text
Browser
  |-- HTTPS static app
  |-- GET /api/settings
  |-- WebSocket /ws
  v
Reverse proxy or HTTPS terminator
  v
Express and ws integrated proxy
  |-- validated Node net socket
  v
Curated Luminari-compatible MUD
```

The integrated proxy owns the application boundary:

- Browser message validation.
- WebSocket origin checks.
- Curated preset and server-only destination allowlists.
- Optional custom destination routing for operator-approved use.
- Banned service port rejection.
- Unsafe IP, unsafe DNS answer, metadata-service, private, loopback,
  link-local, multicast, and reserved-network rejection.
- Per-IP HTTP rate limits.
- Per-IP WebSocket connection limits.
- Per-socket command throttling.
- Duplicate connect prevention while destination validation is in flight.
- Connect, idle, and DNS timeout policy.
- Telnet option negotiation and MSDP reporting.
- State mapping into client-visible game panels.
- Sanitized status messages and command-log redaction posture.

## Supported Options

| Option                    | Use                                                | Strengths                                                                                      | Limits                                                     | Recommendation           |
| ------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------ |
| Integrated proxy          | Normal public production                           | Preserves app protocol, MSDP, state panels, limits, and status messages                        | Must be operated as a public network service               | Default                  |
| Isolated integrated proxy | Higher isolation without changing product behavior | Keeps the same code path behind a process, host, container, network, or reverse-proxy boundary | Requires operator infrastructure                           | Preferred hardening path |
| Terminal-only bridge      | Emergency or separate raw terminal client path     | Simple byte forwarding and possible separate network placement                                 | Cannot serve the React app `/ws` contract or MSDP UI state | Separate fallback only   |
| Mapped bridge             | Fixed TCP targets behind named routes              | Reduces arbitrary target input and can add authorization around paths                          | Still blind to Luminari Web messages and game state        | Separate fallback only   |
| Open bridge               | Browser chooses arbitrary host and port            | Operationally flexible                                                                         | Creates open-proxy, SSRF, logging, and privacy risk        | Reject                   |

## Public-Mode Checklist

For production, keep the process in public mode:

```bash
PROXY_PUBLIC_MODE=true
PROXY_ALLOWED_ORIGINS=https://play.example.com
```

Add `PROXY_ALLOWED_DESTINATIONS` only for vetted MUD routes that are not already
in `shared/app-settings.ts`:

```bash
PROXY_ALLOWED_DESTINATIONS=mud.example.com:4000
```

Operators are also responsible for:

- HTTPS and WSS termination at the public origin.
- A reverse proxy that forwards WebSocket upgrades to `/ws`.
- Host firewall rules that allow only intended inbound ports.
- Process supervision and restart policy.
- Health checks against `/health`.
- Log retention and redaction policy.
- Alerting on repeated policy rejections, connection errors, and rate limits.

Do not rely on `PROXY_ALLOW_CUSTOM_DESTINATIONS=true` for broad public hosting.
If custom routing is enabled, banned ports and unsafe networks remain blocked,
but the operator still owns abuse controls, user authorization, and monitoring.

## Bridge Fallback Rules

A bridge fallback is acceptable only when all of these are true:

- The target experience is a separate raw terminal or transport path.
- Users do not expect Luminari Web HUD, panels, aliases, triggers, MSDP state,
  or connection-status semantics from that bridge.
- Targets are mapped or otherwise curated by the operator.
- TLS, authorization, rate limits, network egress policy, process supervision,
  health checks, and logging policy are supplied outside this repository.
- Traffic recording, TCP dump, packet capture, and verbose transcript logging
  are disabled by default for player sessions.
- The integrated proxy remains the supported path for the first-party React app.

Reject a bridge fallback when:

- The goal is to make the current React app work by pointing `/ws` at a bridge.
- The bridge would accept arbitrary browser-supplied host and port values.
- The operator cannot enforce destination allowlists or mapped targets.
- The operator needs MSDP-derived panels, reconnect cleanup, command throttling,
  or structured app status messages from the bridge.
- Debug tooling would record player commands or terminal transcripts by default.

## Reference Observations

### websockify

The local `EXAMPLES/websockify` reference demonstrates a general
WebSocket-to-TCP bridge. Relevant deployment concepts include WSS certificate
handling, auth plugins, token-based selection of preconfigured targets, daemon
operation, Docker operation, a small static web serving mode, log files, and
optional session recording.

For Luminari Web, the useful ideas are isolation and target curation patterns.
The risky ideas are traffic recording and broad forwarding. Recording or
verbose byte logging can expose player command text, authentication text typed
inside the MUD, and private roleplay content. Keep those capabilities disabled
for player traffic unless a separate incident process, user notice, retention
policy, and access-control review exist.

License note: this reference is reviewed as behavior-only material. Do not copy
its source, command text, Docker files, service files, plugin code, or config.

### wsgate-server

The local `EXAMPLES/wsgate-server` reference demonstrates mapped WebSocket to
TCP routing. Relevant deployment concepts include path-to-target mapping,
reverse-proxy placement, optional JWT verification, dial and handshake
timeouts, write timeouts, shutdown timeouts, and TCP dump controls.

For Luminari Web, the useful ideas are fixed target maps, short connection
timeouts, and authorization before opening TCP. The risky idea is treating a
mapped byte stream as an app protocol replacement. It does not know the
browser message schema or MSDP state contract.

License note: this reference is reviewed as behavior-only material. Do not copy
sample map files, source, command text, service files, or config into this
repository as part of this session.

## Controls Matrix

| Control                          | Integrated proxy | Isolated integrated proxy | Terminal-only bridge | Mapped bridge     |
| -------------------------------- | ---------------- | ------------------------- | -------------------- | ----------------- |
| Browser JSON `/ws` validation    | Yes              | Yes                       | No                   | No                |
| Telnet/MSDP negotiation for app  | Yes              | Yes                       | No                   | No                |
| HUD and panel state updates      | Yes              | Yes                       | No                   | No                |
| Curated destination allowlist    | Yes              | Yes                       | Operator supplied    | Operator supplied |
| Origin check                     | Yes              | Yes                       | Operator supplied    | Operator supplied |
| Unsafe network blocking          | Yes              | Yes                       | Operator supplied    | Operator supplied |
| Banned service ports             | Yes              | Yes                       | Operator supplied    | Operator supplied |
| Command throttling               | Yes              | Yes                       | Operator supplied    | Operator supplied |
| Connection limits                | Yes              | Yes                       | Operator supplied    | Operator supplied |
| Connect and idle timeouts        | Yes              | Yes                       | Operator supplied    | Operator supplied |
| Sanitized app status details     | Yes              | Yes                       | No                   | No                |
| Player command redaction posture | Yes              | Yes                       | Operator supplied    | Operator supplied |

## Environment Guidance

Use these settings for the supported public path:

- `PROXY_PUBLIC_MODE=true` to keep allowlisted public behavior.
- `PROXY_ALLOWED_ORIGINS=https://<public-origin>` for the deployed browser
  origin.
- `PROXY_ALLOWED_DESTINATIONS=host:port,...` only for extra vetted MUD targets.
- `PROXY_CONNECT_TIMEOUT_MS`, `PROXY_IDLE_TIMEOUT_MS`,
  `PROXY_DNS_TIMEOUT_MS`, and `PROXY_DNS_RETRY_COUNT` only within the bounded
  ranges documented in `docs/environments.md`.

Use private mode only for trusted operator contexts:

- `PROXY_PUBLIC_MODE=false` allows custom public-routable hostnames by default.
- Unsafe networks and banned ports still remain blocked.
- This mode should not be exposed as an anonymous public proxy.

Use public custom routing only when there is an explicit product or operations
reason:

- `PROXY_ALLOW_CUSTOM_DESTINATIONS=true` allows custom public-routable
  hostnames while retaining unsafe-network and banned-port checks.
- Operators should add external abuse controls before exposing this option to
  untrusted users.

## Failure Modes

If users cannot connect in public mode, check in this order:

1. The browser origin matches `PROXY_ALLOWED_ORIGINS`.
2. The requested host and port are a curated preset or in
   `PROXY_ALLOWED_DESTINATIONS`.
3. The target port is not in the banned service-port list.
4. DNS resolves and all returned addresses are public-routable.
5. The MUD accepts the TCP connection before the connect timeout.
6. The connection is not being closed by idle timeout or connection limits.
7. Logs do not include raw player command text while investigating.

If a bridge is involved, first confirm whether the user is on the first-party
React app or a separate raw terminal path. If the first-party app is pointed at
a blind bridge, roll back to the integrated proxy. The bridge cannot answer the
app protocol.

## Decision Record

### Context

Luminari Web needs a deployable browser-to-MUD path. The existing Node server
already implements a game-aware proxy. The example bridge projects show
well-known transport forwarding patterns, but they are not game-aware.

### Chosen

Keep the integrated proxy as the supported public topology. When stronger
isolation is needed, isolate the integrated proxy first through process, host,
container, network, reverse-proxy, or firewall boundaries.

### Rejected

Replacing `/ws` with a blind bridge is rejected because it drops browser
message validation, Telnet/MSDP app behavior, state updates, duplicate-connect
handling, command throttling, and sanitized app status details.

### Consequences

Operators get one documented default path and a narrow bridge fallback policy.
Future protocol work can still evaluate source-level WebSocket support or
separate terminal-only bridge experiences, but those are not part of this
deployment decision.
