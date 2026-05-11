# Session Specification

**Session ID**: `phase01-session06-proxy-limits-deployment-safety`
**Phase**: 01 - Harden Terminal and Proxy
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session adds the public-deployment safety layer that Phase 1 has been building toward. The proxy already has parser coverage, malformed MSDP coverage, reconnect cleanup, NAWS resize handling, command throttling, and per-IP WebSocket quotas. The remaining blocker is that browser clients can still request arbitrary MUD destinations, and public hosting needs explicit destination, origin, network, timeout, and logging controls.

The work focuses on a server-side policy boundary for `/ws` connection attempts. Public mode should allow only curated or explicitly configured MUD routes, reject unsafe destinations before opening a TCP socket, enforce origin policy near the WebSocket boundary, apply connect and idle timeouts, and keep player command text out of logs and error details. Private or operator deployments can still opt into custom routing through an explicit environment flag.

The outcome is a deployable proxy posture, not a full infrastructure layer. CDN, WAF, HTTPS termination, and cloud deployment provisioning remain outside this session, but the repository will include documented environment settings and regression tests for the controls it owns.

---

## 2. Objectives

1. Add a typed proxy policy that derives safe destination and origin rules from curated presets plus server-only environment settings.
2. Reject disallowed hosts, ports, private network ranges, metadata-service targets, and invalid WebSocket origins before creating a MUD socket.
3. Add connect and idle timeout behavior without weakening reconnect cleanup, MSDP initialization, or command-rate limiting.
4. Document deployment safety settings and add focused regression tests for the public proxy policy.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase01-session01-telnet-parser-edge-case-tests` - Provides parser edge-case coverage before proxy boundary changes.
- [x] `phase01-session02-msdp-tables-arrays-malformed-payloads` - Provides malformed protocol regression coverage.
- [x] `phase01-session03-connection-lifecycle-reconnect-cleanup` - Provides stable socket cleanup and reconnect behavior.
- [x] `phase01-session04-dynamic-naws-resize` - Provides resize behavior that must survive proxy hardening.
- [x] `phase01-session05-xterm-js-migration-spike` - Keeps terminal renderer decisions separate from deployment safety.

### Required Tools/Knowledge
- Node `net`, `dns/promises`, HTTP request headers, and WebSocket connection lifecycle.
- Existing `MudSession`, `SlidingWindowRateLimiter`, and `ActiveConnectionCounter` behavior.
- Curated MUD presets in `shared/app-settings.ts`.
- Node built-in `node:test` runner with `tsx`.

### Environment Requirements
- `npm install` has already been run.
- `npm test`, `npm run lint`, and `npm run build` are available.
- No live MUD is required for automated tests; socket factories and pure policy helpers should cover safety behavior.
- Public hosting must provide explicit environment values for allowed origins and any non-preset destination rules.

---

## 4. Scope

### In Scope (MVP)
- Operator can run public proxy mode with curated route allowlists - derive allowed host/port pairs from `appSettings.connection.muds` and optional server-only additions.
- Browser client can only connect to approved MUD routes in public mode - reject arbitrary destinations unless an explicit private deployment flag permits custom public-routable hosts.
- Proxy rejects unsafe network targets - validate host syntax, port range, banned service ports, DNS resolution results, private ranges, loopback, link-local, multicast, reserved ranges, and metadata-service addresses.
- Proxy enforces WebSocket origin policy - allow configured origins and local development origins while rejecting unexpected browser origins in public mode.
- Proxy applies deployment timeouts - add connect and idle timeouts that clean up the active socket and send sanitized status details.
- Maintainer can verify behavior - add pure policy tests and lifecycle tests for blocked destinations, origin policy, timeouts, and redacted command text.
- Maintainer can deploy safely - update deployment, environment, and WebSocket API documentation with concrete settings and failure modes.

### Out of Scope (Deferred)
- Cloud infrastructure, CDN, WAF, or TLS provisioning - *Reason: This repository owns application behavior; hosting layers remain deployment-specific.*
- User accounts, profile storage, or audit-log retention - *Reason: Auth and privacy design are deferred by the PRD.*
- Native WebSocket support in Luminari-Source - *Reason: The proxy path remains the Phase 1 hardening target.*
- GPL proxy code import - *Reason: Reference repositories remain behavior references only.*
- Moving browser settings out of cookies - *Reason: Security finding P00-SEC-002 is important but separate from proxy destination safety.*

---

## 5. Technical Approach

### Architecture

Create a small server-side policy layer that is imported by `server/index.ts`. The policy should normalize configuration from `process.env` and the existing curated presets, expose allowed destination and origin checks, and return typed accept/reject results with sanitized user-facing messages. The WebSocket handler should enforce origin policy as soon as a browser connects, then validate each `connect` message before passing the route to `MudSession`.

Destination validation should use a two-step approach. First, compare normalized host/port pairs against the configured allowlist unless custom routing is explicitly enabled. Second, resolve DNS for accepted hostnames and classify every resolved address before opening a TCP socket. Unsafe direct IP literals and resolved addresses must be rejected for loopback, private, link-local, multicast, reserved, unspecified, and metadata-service ranges. Banned ports should fail before DNS.

`MudSession` remains responsible for one active MUD socket and state cleanup. Extend its socket abstraction only as much as needed for connect and idle timeout behavior. Timeouts must destroy the active socket, reset parser/MSDP state, and send stable status text that does not include command text, raw socket errors, or internal exception messages. Existing command throttling, HTTP rate limiting, and per-IP WebSocket quotas should remain intact.

### Design Patterns
- Boundary policy: Validate origin and destination at the WebSocket/server boundary before side effects.
- Typed accept/reject results: Return explicit policy decisions instead of throwing for normal user errors.
- Pure helpers first: Keep address classification and config parsing testable without opening sockets.
- Lifecycle-owned timers: Scope connect and idle timers to the active `MudSession` socket and clear them on every cleanup path.
- Sanitized reporting: User status messages and logs describe classes of failure without leaking player commands or raw upstream details.

### Technology Stack
- TypeScript 6
- Node.js `net`, `dns/promises`, and HTTP/WebSocket primitives
- Express 5
- `ws` 8
- Existing `node --import tsx --test` test runner

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `server/proxy-network.ts` | Pure IP and destination network classification helpers | ~180 |
| `server/proxy-policy.ts` | Server-side proxy config parsing, origin checks, destination allowlist, DNS validation, timeout settings, and sanitized decisions | ~280 |
| `tests/proxy-network.test.ts` | Regression tests for unsafe IPv4/IPv6 ranges and banned service ports | ~160 |
| `tests/proxy-policy.test.ts` | Regression tests for allowlist mode, custom-routing mode, origin policy, DNS failure handling, and sanitized rejection messages | ~240 |
| `.spec_system/specs/phase01-session06-proxy-limits-deployment-safety/implementation-notes.md` | Implementation progress, commands, and evidence | ~120 |
| `.spec_system/specs/phase01-session06-proxy-limits-deployment-safety/security-compliance.md` | Session security and privacy notes for public proxy controls | ~100 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `server/index.ts` | Build proxy policy, enforce WebSocket origins, validate connect messages before `MudSession.connect`, keep quotas and rate limits stable | ~120 |
| `server/mud-session.ts` | Add connect and idle timeout support with cleanup and sanitized status messages | ~120 |
| `tests/helpers/proxy-lifecycle-harness.ts` | Extend fake socket support for timeout behavior and policy-aware connection tests | ~80 |
| `tests/proxy-lifecycle.test.ts` | Add timeout, cleanup, and command-redaction regression coverage | ~130 |
| `docs/deployment.md` | Document public/private proxy mode, origin rules, allowlists, DNS/IP blocking, timeouts, and operational defaults | ~120 |
| `docs/environments.md` | Document proxy safety environment variables and recommended production values | ~100 |
| `docs/api/http-and-websocket.md` | Document WebSocket connect rejection behavior and public safety error details | ~80 |
| `tests/README.md` | Document proxy safety test coverage and focused commands | ~40 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Public mode accepts curated preset host/port pairs and configured additions.
- [ ] Public mode rejects arbitrary host/port pairs unless custom routing is explicitly enabled.
- [ ] Unsafe destinations are blocked before `net.createConnection()` is called.
- [ ] DNS resolution results are checked and unsafe resolved addresses are rejected.
- [ ] Unexpected browser origins are rejected before a MUD socket is opened.
- [ ] Connect and idle timeouts close only the active socket and reset parser/MSDP state.
- [ ] Command text and raw socket errors are not logged or echoed in status details.
- [ ] Existing HTTP rate limit, WebSocket connection quota, and command input throttling behavior remain stable.

### Testing Requirements
- [ ] Unit tests cover unsafe IPv4 and IPv6 ranges, metadata-service targets, direct IP literals, and banned ports.
- [ ] Unit tests cover public allowlist mode, explicit custom-routing mode, origin policy, DNS failure handling, and sanitized rejection messages.
- [ ] Lifecycle tests cover connect timeout, idle timeout, stale timeout callbacks, and no raw command leakage.
- [ ] Existing parser, MSDP, renderer, lifecycle, and NAWS tests still pass.
- [ ] Documentation changes are reviewed against the implemented environment variables.

### Non-Functional Requirements
- [ ] Proxy safety checks add no live-MUD dependency to automated tests.
- [ ] Public mode fails closed when required production policy values are missing or invalid.
- [ ] Failure messages are actionable but do not disclose internal network details.
- [ ] Timeout values are bounded to avoid disabling deployment safety through malformed environment values.
- [ ] The implementation follows the existing TypeScript, server, and testing conventions.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.

---

## 8. Implementation Notes

### Key Considerations
- Keep all public proxy safety behavior server-side. Client-side preset UI can guide users, but it is not a security boundary.
- Preserve the existing rate limiter and connection counter behavior while adding origin and destination checks.
- Treat DNS as hostile input: every resolved address must be classified before opening a socket.
- Keep custom routing possible only through an explicit operator/private deployment flag.
- Do not include raw player command text, socket errors, DNS answers, or internal exception details in status messages.

### Potential Challenges
- DNS validation is asynchronous while current connect handling is mostly synchronous: Keep the WebSocket message handler ordered and ignore stale validation results if the browser closes or disconnects.
- IPv6 classification has edge cases: Write pure tests for loopback, unique local, link-local, multicast, unspecified, IPv4-mapped, and documentation ranges.
- Timeout callbacks can race with manual disconnect and reconnect: Scope timers to the active socket and verify stale callbacks are ignored.
- Origin handling differs between browsers, local tools, and reverse proxies: Document production expectations and keep local development origins explicit.
- Public mode could break custom host testing: Provide an explicit private/operator flag and document the tradeoff.

### Relevant Considerations
- [P01] **Public proxy exposure requires allowlists and private-network blocking**: This session directly closes the highest-risk proxy deployment gap.
- [P01] **Do not log raw player commands**: Error and timeout handling must stay sanitized.
- [P01] **Automated regression coverage still needs unsafe-host rejection**: Add focused policy tests before implementation is marked complete.
- [P01] **Compatibility depends on external MUD host behavior**: Validate configuration and DNS locally; do not require live MUD availability for tests.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- A disallowed destination could slip through DNS rebinding, IP literals, alternate address families, or stale policy decisions.
- Origin or destination errors could leak internal network details or raw player command text.
- Connect and idle timers could destroy a new socket after reconnect if callbacks are not scoped to the active session.
- Public mode could silently fall back to permissive behavior when environment values are malformed.

---

## 9. Testing Strategy

### Unit Tests
- Test `server/proxy-network.ts` address classification for loopback, private, link-local, multicast, unspecified, reserved, documentation, metadata-service, IPv4-mapped IPv6, and public addresses.
- Test `server/proxy-policy.ts` config parsing, allowlist normalization, custom-routing behavior, banned ports, DNS validation, origin allow/deny decisions, and sanitized rejection details.
- Test timeout value normalization and fail-closed behavior for malformed environment values.

### Integration Tests
- Extend `tests/proxy-lifecycle.test.ts` to verify connect timeout, idle timeout, stale timeout callbacks, manual disconnect races, and redacted command details.
- Keep existing parser, MSDP fixture, state mapping, renderer, xterm spike, reconnect, command rate limit, and NAWS tests passing.
- Verify `server/index.ts` builds with async destination validation and unchanged `/health`, `/api/settings`, and `/ws` route contracts.

### Manual Testing
- Run the app in local private mode and verify a curated preset can connect or at least attempts a connection with the expected sanitized status.
- Run with public-mode settings and verify an arbitrary custom host is rejected before any MUD socket is opened.
- Check that deployment docs list the environment variables required for public hosting.

### Edge Cases
- Hostname resolves to both public and private addresses.
- Direct IP literal targets, including IPv4-mapped IPv6 and metadata-service addresses.
- Banned or malformed ports.
- Missing, malformed, or unexpected `Origin` headers.
- DNS lookup failure, timeout, or empty answer set.
- Browser closes while destination validation is pending.
- User reconnects before a previous connect timeout fires.
- Idle timeout fires after manual disconnect or socket close.

---

## 10. Dependencies

### External Libraries
- None planned. Use Node built-in `dns/promises`, `net`, and existing project dependencies.

### Other Sessions
- **Depends on**: `phase01-session01-telnet-parser-edge-case-tests`, `phase01-session02-msdp-tables-arrays-malformed-payloads`, `phase01-session03-connection-lifecycle-reconnect-cleanup`, `phase01-session04-dynamic-naws-resize`, `phase01-session05-xterm-js-migration-spike`
- **Depended by**: Phase transition audit, pipeline, infrastructure, and later public deployment work

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
