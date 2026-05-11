# Session Specification

**Session ID**: `phase03-session05-bridge-deployment-options`
**Phase**: 03 - Borrow the Best Ideas
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session defines the production deployment posture for Luminari Web's proxy path and decides how, or whether, standalone bridge projects should influence operations. The current repository already has a game-aware Express and `ws` proxy that validates browser messages, applies destination allowlists, checks origins, enforces rate and connection limits, rejects unsafe networks and banned ports, manages Telnet parser state, and emits MSDP-backed game state. That integrated proxy remains the default product path.

The session studies `EXAMPLES/websockify` and `EXAMPLES/wsgate-server` as deployment references only. Both are useful bridge patterns for forwarding WebSocket traffic to TCP services, but they are blind bridges and cannot replace the current `/ws` application protocol without losing game-aware message validation, MSDP negotiation, state mapping, reconnect cleanup, and UI status semantics.

The practical output is a deployment decision record and operator documentation. Any code change should be small, testable, and limited to preserving existing public-mode protections. No reference code, configuration, or license-sensitive implementation detail should be copied from the example projects.

---

## 2. Objectives

1. Compare the integrated game-aware proxy with standalone bridge isolation options using the local reference repositories.
2. Document a clear default topology: allowlisted integrated proxy for public production deployments.
3. Document when a bridge fallback is acceptable, what it cannot do, and which controls must surround it.
4. Add focused deployment-policy validation so public mode continues to reject arbitrary destinations and unsafe origins by default.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase01-session06-proxy-limits-deployment-safety` - Provides public-mode allowlists, origin checks, banned ports, DNS/IP safety checks, quotas, rate limits, connect and idle timeouts, and command-log redaction.
- [x] `phase03-session04-mobile-and-pwa-foundation` - Provides current production shell, PWA, service-worker, and reconnect documentation that deployment notes must not contradict.

### Required Tools/Knowledge
- Current proxy policy implementation in `server/proxy-policy.ts`, `server/proxy-network.ts`, `server/index.ts`, `server/mud-session.ts`, `server/rate-limiter.ts`, and `server/connection-accounting.ts`.
- Current deployment, environment, architecture, API, runbook, and server documentation under `docs/` and `server/`.
- `EXAMPLES/websockify` as a behavior-only reference for WebSocket-to-TCP forwarding, TLS, token plugins, Docker operation, and logging risks.
- `EXAMPLES/wsgate-server` as a behavior-only reference for mapped TCP targets, JWT authorization, timeouts, and single-binary operation.
- Node test runner, TypeScript, ESLint, and Vite build commands from `package.json`.

### Environment Requirements
- Dependencies installed from the current lockfile.
- Local quality commands available: `npm run test`, `npm run lint`, and `npm run build`.
- No live public deployment credentials are required.
- No network access to production MUDs is required for this planning and documentation session.

---

## 4. Scope

### In Scope (MVP)
- Maintainer can choose the correct production topology - Compare integrated proxy, isolated integrated proxy behind a reverse proxy, terminal-only websockify bridge, and mapped wsgate bridge options.
- Operator can deploy the default public proxy safely - Document required environment variables, HTTPS/WSS expectations, reverse-proxy responsibilities, health checks, and fail-closed behavior.
- Operator can understand bridge fallback limits - Explain that blind bridges do not speak the Luminari Web JSON `/ws` protocol and must not take over game-aware MSDP behavior.
- Public proxy protections remain explicit - Verify host and port allowlists, allowed origins, banned ports, rate limits, connection limits, connect/idle timeouts, DNS/IP blocking, and command-log redaction in docs and tests.
- Reference use remains license-safe - Document websockify and wsgate as reference inputs only, with no copied code or config.
- Low-risk validation changes are allowed - Add focused tests or docs updates that preserve current behavior without changing the runtime protocol.

### Out of Scope (Deferred)
- Replacing the integrated game-aware proxy with a blind bridge - *Reason: the browser app expects structured `/ws` JSON messages and MSDP state updates.*
- Moving Telnet parsing, MSDP negotiation, or game state mapping into bridge-only infrastructure - *Reason: bridges forward bytes and should not become a second protocol implementation.*
- Broad production hosting automation, Terraform, Docker Compose, or PM2 rewrites - *Reason: this session is topology and safety documentation, not infra rollout.*
- Native WebSocket support in Luminari-Source - *Reason: Phase 4 owns source-level protocol decisions.*
- Importing websockify or wsgate source code, scripts, service files, or configuration - *Reason: references are inspiration only and licensing must stay clean.*

---

## 5. Technical Approach

### Architecture

Keep the current architecture as the supported public topology:

```text
Browser
  |-- HTTPS static app, GET /api/settings, WebSocket /ws
  v
Reverse proxy or HTTPS terminator
  v
Express and ws integrated proxy
  |-- validated Node net socket
  v
Curated Luminari-compatible MUD
```

The integrated proxy owns all application-aware behavior: browser message validation, destination allowlisting, origin checks, per-IP and per-socket limits, timeout policy, Telnet negotiation, MSDP reporting, state mapping, and sanitized connection status messages.

Bridge alternatives should be documented as isolation or emergency options, not as product replacements. A terminal-only bridge can forward raw bytes for a separate client path, but it cannot serve the current React app's `/ws` contract. If an operator needs stronger isolation, prefer running the existing integrated proxy in its own process, host, container, network segment, or reverse-proxy boundary before introducing a blind bridge.

### Design Patterns
- Decision record: Document the default topology, alternatives, tradeoffs, and rejection reasons in one maintained operator-facing document.
- Defense in depth: Treat the application proxy, reverse proxy, TLS, firewall, process supervisor, rate limits, and destination allowlists as layered controls.
- Fail closed: Public mode must reject missing or unexpected origins and non-allowlisted destinations unless an operator explicitly enables custom routing.
- Behavior-only reference use: Study reference project capabilities without copying code, command snippets beyond minimal generic invocation shape, service files, or config.
- Regression lock: Use focused tests to keep public deployment policy from drifting toward open-proxy behavior.

### Technology Stack
- Node.js, Express, `ws`, and native `net` sockets for the supported integrated proxy.
- TypeScript for policy tests and shared server contracts.
- Existing `server/proxy-policy.ts` and `server/proxy-network.ts` for public-mode enforcement.
- Existing `SlidingWindowRateLimiter` and `ActiveConnectionCounter` for rate and connection limits.
- Existing docs under `docs/` and `server/` for operator guidance.
- No new runtime dependencies expected.

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `docs/bridge-deployment-options.md` | Topology comparison, recommendation, bridge limits, operations matrix, and decision record | ~220 |
| `docs/runbooks/bridge-fallback.md` | Operator runbook for when to use or reject a bridge fallback and how to preserve controls | ~140 |
| `tests/proxy-deployment-policy.test.ts` | Focused regression tests for public-mode deployment defaults and fail-closed policy behavior | ~180 |
| `.spec_system/specs/phase03-session05-bridge-deployment-options/implementation-notes.md` | Reference review notes, implementation evidence, validation results, and handoff notes | ~100 |
| `.spec_system/specs/phase03-session05-bridge-deployment-options/security-compliance.md` | Security posture, bridge risk analysis, logging posture, and license-boundary notes | ~90 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `docs/deployment.md` | Add default topology, bridge decision link, public-mode checklist, and operator responsibilities | ~100 |
| `docs/environments.md` | Clarify production mode, custom routing flags, and bridge/non-bridge environment expectations | ~60 |
| `docs/ARCHITECTURE.md` | Update stale security posture and add integrated proxy versus blind bridge architecture note | ~80 |
| `docs/api/http-and-websocket.md` | Clarify that `/ws` is an application protocol and blind bridges are not compatible with it | ~45 |
| `server/README_server.md` | Replace stale hardening note with current proxy responsibilities and public deployment controls | ~70 |
| `docs/runbooks/incident-response.md` | Add checks for public-mode rejection, origin errors, allowlists, DNS/IP blocks, and bridge fallback decisions | ~80 |
| `docs/onboarding.md` | Add pointers to deployment topology and proxy-policy validation for new maintainers | ~40 |
| `tests/README.md` | Add deployment-policy test command, expected coverage, and manual public-mode smoke checks | ~45 |
| `README.md` | Link operator deployment and bridge decision docs without changing product positioning | ~25 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Deployment options are documented with tradeoffs and a clear default recommendation.
- [ ] Public production mode is documented and tested as rejecting arbitrary host and port targets by default.
- [ ] Allowed origins, destination allowlists, banned ports, unsafe DNS/IP results, rate limits, connection limits, connect timeouts, idle timeouts, and command-log redaction are covered in operator docs.
- [ ] Bridge fallbacks are documented as separate blind transport options, not replacements for Luminari Web's application `/ws` protocol.
- [ ] No game-aware behavior is moved into a blind bridge.
- [ ] Maintainers have a runbook for deciding whether to use integrated proxy isolation, a terminal-only bridge fallback, or no bridge.

### Testing Requirements
- [ ] Focused deployment-policy tests are written and passing.
- [ ] Full Node test suite passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Manual documentation review confirms all topology docs agree with current server behavior.

### Non-Functional Requirements
- [ ] No raw player command text is logged or recommended for bridge/session recording.
- [ ] Public deployments remain fail-closed by default.
- [ ] No new runtime dependency is introduced unless explicitly justified and tested.
- [ ] No websockify or wsgate source code, config, service files, or license-sensitive text is copied into the product.
- [ ] Documentation is actionable for an operator without requiring private credentials or production access.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] `npm run test`, `npm run lint`, and `npm run build` pass or any failures are documented with cause.

---

## 8. Implementation Notes

### Key Considerations
- `docs/deployment.md` already documents the current public-mode environment variables and health checks; this session should add topology guidance without duplicating every policy detail.
- `docs/ARCHITECTURE.md` and `server/README_server.md` contain stale language implying public deployment hardening is not complete. Bring those files in line with the current proxy policy implementation.
- `docs/api/http-and-websocket.md` is the best place to make clear that `/ws` is structured app messaging, not raw Telnet bytes.
- `websockify` includes recording and logging features that are useful for debugging other protocols but risky for MUD command privacy. The recommendation should keep those disabled for player traffic.
- `wsgate-server` maps named paths to TCP services and can use JWT authorization, but it still forwards byte streams and should not become the Luminari Web game-state boundary.

### Potential Challenges
- Documentation drift across multiple operator docs: Keep `docs/bridge-deployment-options.md` as the decision source and link to it from shorter docs.
- Bridge wording can imply drop-in compatibility: State explicitly that blind bridges cannot serve the current React app's JSON `/ws` contract.
- Public-mode custom routing can be misunderstood: Document that `PROXY_ALLOW_CUSTOM_DESTINATIONS=true` still keeps unsafe networks and banned ports blocked.
- Reference licensing can become ambiguous: Summarize behavior and tradeoffs only, and avoid copying service files or configuration from examples.
- Command privacy can regress through debug tooling: Call out that bridge recording, TCP dumps, packet captures, and verbose logs must stay disabled by default for player traffic.

### Relevant Considerations
- [P01] **Public proxy destination policy**: Keep allowlists and fail-closed DNS/IP classification intact while documenting deployment options.
- [P02] **Browser settings cookies**: Do not add server-side persistence or recommend logging browser-local settings.
- [P02] **Source-confirmed MSDP boundary**: Keep game-state interpretation in the integrated proxy/client path, not in bridge infrastructure.
- [P02] **Synthetic fixtures are not live proof**: Treat policy tests as regression checks for code behavior, not proof that every production route is reachable.

---

## 9. Testing Strategy

### Unit Tests
- Add `tests/proxy-deployment-policy.test.ts` for public-mode default rejection of arbitrary destinations, configured allowlist acceptance, missing and unexpected origin rejection, banned-port rejection, direct IP behavior, custom-routing safety, timeout clamping, and sanitized failure details.

### Integration Tests
- Run the focused deployment-policy test file.
- Run the full test suite with `npm run test`.
- Run `npm run lint`.
- Run `npm run build`.

### Manual Testing
- Review `docs/bridge-deployment-options.md`, `docs/deployment.md`, `docs/environments.md`, `docs/ARCHITECTURE.md`, `docs/api/http-and-websocket.md`, `server/README_server.md`, and runbooks together for conflicting topology guidance.
- Confirm the docs do not instruct operators to expose arbitrary host/port routing in public mode.
- Confirm bridge fallback docs do not instruct operators to enable traffic recording, TCP dumps, or command logging for player sessions.
- Confirm all reference-project mentions are behavior-only and do not import code or configuration.

### Edge Cases
- Public deployment forgets `PROXY_ALLOWED_ORIGINS`.
- Operator adds malformed `PROXY_ALLOWED_DESTINATIONS`.
- Operator enables `PROXY_ALLOW_CUSTOM_DESTINATIONS=true` and tries a private or link-local target.
- Operator attempts to replace `/ws` with websockify or wsgate directly.
- Operator enables bridge recording or TCP dumping while player commands are flowing.
- Reverse proxy terminates TLS but forwards an unexpected `Origin`.
- A curated preset changes host or port and must remain allowlisted through `shared/app-settings.ts`.

---

## 10. Dependencies

### External Libraries
- None expected.

### Other Sessions
- **Depends on**: `phase01-session06-proxy-limits-deployment-safety`, `phase03-session04-mobile-and-pwa-foundation`
- **Depended by**: `phase03-session06-protocol-feature-checklist`, Phase 4 source-level protocol planning

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
