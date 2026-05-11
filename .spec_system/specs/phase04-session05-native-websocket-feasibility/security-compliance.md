# Security and Compliance Review

**Session ID**: `phase04-session05-native-websocket-feasibility`
**Started**: 2026-05-11 11:51
**Last Updated**: 2026-05-11 12:46
**Status**: Complete

---

## Scope

This review covers the native source WebSocket transport decision, the current
integrated `/ws` proxy boundary, source-side transport implications, privacy
constraints for reference audits, and follow-up gates required before any public
native transport support can be claimed.

---

## Initial Controls

- No credentials, private hosts, live player names, command transcripts, tokens,
  or terminal logs are included in session artifacts.
- `mud-r` is reviewed as behavioral reference only; no source, client, service,
  or configuration text is copied.
- The current Luminari Web `/ws` proxy remains the browser application contract
  unless a future migration proves parity.

---

## Threat Model

### Assets

- Browser application contract and typed `/ws` messages.
- Player command text, credentials typed inside a MUD session, and terminal
  transcripts.
- Source descriptor state, protocol buffers, copyover state, and character
  session state.
- Operator network topology, destination policy, logs, health probes, and
  rollback path.

### Entry Points

- Current browser `/ws` application endpoint.
- Current proxy outbound Telnet socket.
- Any future Luminari-Source native WebSocket listener.
- Reverse proxy, TLS/WSS terminator, bridge fallback routes, and health probes.

### Required Gates Before Native Source WebSocket Support

| Gate | Requirement | Rationale |
|------|-------------|-----------|
| Browser contract | Choose raw terminal, source-owned app protocol, or `/ws` compatibility explicitly. | Prevents breaking HUD, panels, aliases, triggers, reconnect cleanup, and status messages. |
| Origin and auth | Define origin policy, authentication or authorization expectations, and same-origin deployment rules. | Browser WebSocket origin headers are useful but not a complete auth system. |
| Message validation | Validate all browser-originated payloads at the source listener or compatibility layer. | Prevents untrusted frames from becoming unchecked commands or protocol control data. |
| Rate limits and quotas | Enforce per-IP, per-account if available, per-descriptor command throttles and connection caps. | Preserves abuse controls now owned by the proxy. |
| Destination policy | If the source listener accepts only local players, document that no browser-chosen destination exists. If it proxies elsewhere, retain allowlists and unsafe-network blocking. | Avoids open-proxy or SSRF behavior. |
| Parser isolation | Keep Telnet/protocol parser state per descriptor and define how WebSocket frames map to line input or app messages. | Prevents mixed Telnet/WebSocket state and reconnect leakage. |
| Copyover lifecycle | Persist or intentionally drop WebSocket descriptor metadata across copyover with tested behavior. | Source copyover can otherwise strand browser clients or restore wrong protocol state. |
| Logging and privacy | Redact command text, credentials, tokens, private hosts, transcripts, and raw frame payloads by default. | Keeps source logs from expanding privacy exposure. |
| TLS/WSS and edge policy | Require WSS termination, forwarded-origin handling, health checks, and host firewall rules. | Native listener would become browser-facing infrastructure. |
| Observability | Add sanitized counters for accepts, rejects, policy failures, parser failures, and rollbacks. | Operators need proof of health without logging private payloads. |
| Rollback | Keep integrated proxy route available until native transport parity is proven in tests and deployment drills. | Maintains a known-good production path. |

### Decision Criteria

- Defer native source WebSocket unless it has a dedicated source transport spec,
  a browser contract spec, security/operations gates, source parser tests,
  web compatibility tests, and rollback drills.
- Reject any plan that points the current React app `/ws` endpoint at a raw byte
  bridge or raw source WebSocket endpoint.
- Pursue only if the future work proves it reduces operational complexity
  without weakening validation, privacy, status semantics, or MSDP state parity.

---

## Decision Review

### Outcome

Native source WebSocket support is deferred. The integrated Luminari Web proxy
and `/ws` JSON application protocol remain the supported production path.

### Security Result

- No new runtime listener, route, dependency, auth model, persistence path, or
  logging path was added.
- Documentation now rejects replacing `/ws` with a raw bridge or raw source
  WebSocket endpoint.
- Future source-native transport work is gated on source descriptor lifecycle,
  parser/frame handling, copyover, browser contract, message validation,
  origin/auth, quotas, throttles, privacy-safe logging, WSS/TLS, health checks,
  observability, compatibility tests, and rollback.
- The status catalog remains `deferred` for native source WebSocket and links
  ADR 0003 as evidence.

### Privacy Review

- No credentials, private hosts, live player names, tokens, terminal
  transcripts, command logs, or raw frame payloads were added.
- `mud-r` observations were summarized behaviorally. No reference source,
  sample client code, service files, command text, or configuration snippets
  were copied into Luminari Web.
- External Luminari-Source docs were updated with maintainer guidance only.

### Behavioral Quality Review

- Resource cleanup: future source-native work must define descriptor close,
  protocol cleanup, event cleanup, and copyover behavior.
- Duplicate action prevention: future source-native work must define connection
  quotas and command throttles before exposure.
- State freshness on re-entry: future source-native work must define reconnect
  and copyover state reset or restoration semantics.
- Trust boundary enforcement: future source-native work must validate all
  browser-originated messages at the listener or compatibility layer.
- Failure path completeness: future source-native work must produce sanitized
  client-visible failures and operator-visible counters.
- External dependency resilience: future source-native work must define WSS/TLS,
  health checks, timeout policy, rollback, and monitoring.
- Contract alignment: docs and tests now distinguish native source WebSocket
  from the existing `/ws` JSON app protocol.
- Error information boundaries: docs require privacy-safe logging and avoid
  exposing private data or reference implementation text.

---
