# Session Specification

**Session ID**: `phase01-session03-connection-lifecycle-reconnect-cleanup`
**Phase**: 01 - Harden Terminal and Proxy
**Status**: Completed
**Completed**: 2026-05-11
**Created**: 2026-05-11

---

## 1. Session Overview

This session hardens the browser WebSocket to Telnet lifecycle so repeated connect, disconnect, reconnect, socket error, and browser-close flows do not leave stale parser state, stale `MudState`, active TCP sockets, or confusing duplicate status events behind. It builds directly on the parser and structured MSDP test coverage from Phase 1 Sessions 1 and 2.

The current proxy keeps `MudSession` lifecycle logic inside `server/index.ts`, which makes it difficult to test close and reconnect behavior without starting the full server. This session extracts the lifecycle-critical behavior behind narrow, testable modules and then adds focused Node tests using controlled fake browser and MUD socket conditions.

The result should be a safer foundation for later NAWS resize, terminal renderer, and public deployment work. Game panels remain out of scope; the goal is reliable connection state and repeatable evidence from 25 connect/disconnect cycles.

---

## 2. Objectives

1. Make browser WebSocket close, manual disconnect, MUD socket close, and MUD socket error paths idempotent and observable.
2. Ensure reconnect resets parser state, MSDP initialization, socket references, and accumulated `MudState`.
3. Prevent stale socket callbacks from older connections from sending misleading status or state after reconnect.
4. Add automated or scripted evidence for 25 repeated connect/disconnect cycles.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session05-state-mapping-tests` - Provides shared MSDP state mapping tests and baseline test command.
- [x] `phase01-session01-telnet-parser-edge-case-tests` - Provides split IAC, doubled IAC, negotiation, and parser close coverage.
- [x] `phase01-session02-msdp-tables-arrays-malformed-payloads` - Provides structured MSDP parser fixtures and malformed payload coverage.

### Required Tools/Knowledge
- Node built-in `node:test` runner with `tsx`.
- Existing `ws`, native `net`, and `TelnetParser` behavior.
- Existing shared `MudState`, `ServerMessage`, `ClientMessage`, and MSDP mapping contracts.

### Environment Requirements
- `npm install` has already been run.
- `npm test`, `npm run lint`, and `npm run build` are available.
- No live MUD server is required for automated lifecycle tests.

---

## 4. Scope

### In Scope (MVP)
- Maintainer can test browser WebSocket close behavior - Extract and exercise session cleanup without relying on a browser.
- Maintainer can test MUD socket close and error behavior - Use controlled fake or local sockets to trigger lifecycle paths.
- Player reconnects without stale state - Reset parser, MSDP initialization, socket references, and client-visible state on disconnect and reconnect.
- Maintainer can verify repeated cycles - Add a 25-cycle automated or scripted test path.
- Maintainer can understand status transitions - Suppress or document duplicate disconnected events where practical.

### Out of Scope (Deferred)
- Public host allowlist implementation - *Reason: Session 06 owns deployment safety guardrails.*
- Dynamic NAWS resize - *Reason: Session 04 owns resize behavior.*
- UI redesign beyond status cleanup - *Reason: This session targets proxy lifecycle reliability, not panel or layout work.*
- xterm.js migration work - *Reason: Session 05 owns terminal renderer evaluation.*

---

## 5. Technical Approach

### Architecture

Keep `server/index.ts` as the server bootstrap and HTTP/WebSocket wiring layer, but move lifecycle behavior into testable modules. `MudSession` should own a single browser socket, one active MUD socket reference, one parser instance, one MSDP initialization flag, one command limiter, and one `MudState` accumulator. Socket close/error callbacks should be tied to the current active socket so stale callbacks from previous sockets cannot affect the new session after reconnect.

Tests should avoid live MUD dependencies. Prefer a focused harness with fake browser and MUD socket objects for unit-level lifecycle behavior, and add a repeated-cycle path that validates the same cleanup contract. If a local TCP server is simpler for one path, keep it inside the test process and bind ephemeral ports only.

### Design Patterns
- Dependency injection: Inject MUD socket creation so lifecycle tests can use controlled sockets.
- Idempotent cleanup: Cleanup can run multiple times without double status spam or stale resource access.
- Current-socket guard: Close and error handlers check that the event belongs to the active socket before mutating session state.
- Contract tests: Tests assert messages and cleanup behavior through public session inputs rather than private fields where possible.

### Technology Stack
- TypeScript 6
- Node.js `net` sockets
- Express 5
- `ws` 8
- Node built-in `node:test`
- `tsx` test loader

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `server/mud-session.ts` | Testable MUD session lifecycle class and socket factory types | ~180 |
| `server/rate-limiter.ts` | Shared sliding-window limiter extracted from server bootstrap | ~70 |
| `tests/helpers/proxy-lifecycle-harness.ts` | Fake browser and MUD socket helpers for lifecycle tests | ~160 |
| `tests/proxy-lifecycle.test.ts` | Browser close, MUD close/error, reconnect, and 25-cycle coverage | ~220 |
| `.spec_system/specs/phase01-session03-connection-lifecycle-reconnect-cleanup/implementation-notes.md` | Implementation progress and command evidence | ~80 |
| `.spec_system/specs/phase01-session03-connection-lifecycle-reconnect-cleanup/security-compliance.md` | Session security and privacy notes | ~60 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `server/index.ts` | Import extracted session and limiter modules; keep route and WebSocket behavior stable | ~80 |
| `tests/README.md` | Document lifecycle coverage and no-live-MUD constraints | ~30 |
| `.spec_system/state.json` | Set current session and planning history | ~5 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Browser WebSocket close destroys any active MUD socket and decrements the per-IP connection counter once.
- [ ] Manual disconnect is idempotent and does not emit duplicate misleading disconnected statuses.
- [ ] MUD socket close and error paths clean parser, socket, MSDP initialization, and accumulated state.
- [ ] Reconnect creates a fresh parser and ignores stale close/error callbacks from the previous MUD socket.
- [ ] 25 repeated connect/disconnect cycles pass in automated or scripted testing.

### Testing Requirements
- [ ] Unit tests written and passing for browser close, MUD close, MUD error, reconnect cleanup, and repeated cycles.
- [ ] Existing parser and MSDP fixture tests still pass.
- [ ] Manual testing notes recorded for at least one local proxy connect/disconnect attempt if practical.

### Non-Functional Requirements
- [ ] Reconnect testing passes 25 consecutive connect/disconnect cycles without stale state or unhandled exceptions.
- [ ] Parser and proxy lifecycle changes preserve current host/port validation behavior until Session 06.
- [ ] No player command text is logged by default.

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
- Keep lifecycle changes narrow; avoid mixing public deployment allowlists or renderer work into this session.
- Preserve `/health`, `/api/settings`, `/ws`, and static serving behavior while extracting `MudSession`.
- Keep `renderMudHtml()` and frontend HTML rendering untouched.
- Treat browser WebSocket messages and Telnet traffic as untrusted input.

### Potential Challenges
- `server/index.ts` side effects complicate imports: Extract session and rate limiter logic first, leaving bootstrap behavior in `server/index.ts`.
- Duplicate status events may be current observable behavior: Add tests that define the desired status sequence before changing it.
- Stale socket callbacks can be racey: Use a current-socket guard and tests that close the old socket after reconnect.

### Relevant Considerations
- [P01] **Proxy lifecycle glue is concentrated in `server/index.ts`**: Extract only the lifecycle behavior needed for tests and keep route wiring stable.
- [P01] **Parser and reconnect coverage first**: Add coverage before changing lifecycle behavior.
- [P01] **Automated regression coverage still needs reconnect cleanup tests**: This session directly closes that gap.
- [P01] **Do not log raw player commands**: Lifecycle diagnostics must avoid command payload logging.
- [P01] **Fixture and Node test approach worked**: Continue using `node --import tsx --test`.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Duplicate disconnect or error events can confuse reconnect UI and mask the real failure reason.
- Stale MUD socket callbacks can mutate session state after a newer connection is active.
- Cleanup paths can leave parser buffers, MSDP initialization, or socket references alive across reconnect.

---

## 9. Testing Strategy

### Unit Tests
- Test manual disconnect, browser close, MUD socket close, and MUD socket error with controlled sockets.
- Test reconnect creates a new active socket and ignores stale close/error callbacks from the previous socket.
- Test state reset after MSDP updates by emitting state, disconnecting, reconnecting, and verifying no stale partial is sent.

### Integration Tests
- Add a repeated 25-cycle test using the lifecycle harness or local ephemeral sockets.
- Keep existing `npm test` coverage for parser and MSDP fixtures passing.

### Manual Testing
- Start the dev server, connect to a configured MUD route when available, disconnect, reconnect, and verify terminal status and HUD reset behavior.

### Edge Cases
- Browser closes while MUD socket is connecting.
- MUD socket errors before connect event.
- Manual disconnect is called when no active MUD socket exists.
- Old socket closes after a successful reconnect to a new socket.
- MSDP ready callback fires after disconnect or stale socket cleanup.

---

## 10. Dependencies

### External Libraries
- None new.

### Other Sessions
- **Depends on**: `phase00-session05-state-mapping-tests`, `phase01-session01-telnet-parser-edge-case-tests`, `phase01-session02-msdp-tables-arrays-malformed-payloads`
- **Depended by**: `phase01-session04-dynamic-naws-resize`, `phase01-session05-xterm-js-migration-spike`, `phase01-session06-proxy-limits-deployment-safety`, Phase 02 game panel sessions

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
