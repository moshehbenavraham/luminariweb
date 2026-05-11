# Session Specification

**Session ID**: `phase01-session01-telnet-parser-edge-case-tests`
**Phase**: 01 - Harden Terminal and Proxy
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session adds focused Telnet parser edge-case coverage before Phase 01 changes parser behavior, reconnect behavior, resize handling, or deployment policy. The current proxy parser lives inside `server/index.ts`, which makes it hard to test without also starting the Express and WebSocket server. The session creates a side-effect-free parser test surface and then covers the byte-level cases most likely to regress under real MUD traffic.

The work fits the larger plan by keeping protocol coverage ahead of proxy hardening. Later sessions for structured MSDP payloads, reconnect cleanup, NAWS resize, xterm.js evaluation, and deployment safety all depend on confidence that Telnet control bytes, subnegotiation boundaries, and text flushing behave predictably.

Implementation should preserve existing runtime behavior unless a new edge-case test exposes a defect. Any parser issue that is larger than a minimal fix should be documented for a later Phase 01 session rather than folded into this one.

---

## 2. Objectives

1. Make the Telnet parser importable by tests without starting the HTTP or WebSocket server.
2. Add automated tests for split IAC sequences, doubled IAC bytes, negotiation boundaries, and subnegotiation boundaries.
3. Verify malformed and partial MSDP payload boundaries do not throw or emit misleading state.
4. Preserve existing MSDP fixture and state-mapping tests while recording any deferred parser defects.

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session01-baseline-verification-and-project-hygiene` - documented baseline lint, build, and project behavior.
- [x] `phase00-session02-msdp-variable-map-alignment` - aligned default MSDP requests to source-backed variables.
- [x] `phase00-session03-unavailable-data-ux` - preserved source-aware unavailable-data behavior and terminal escaping invariants.
- [x] `phase00-session04-msdp-fixture-corpus` - added fixture corpus structure for protocol regression work.
- [x] `phase00-session05-state-mapping-tests` - added committed `npm test` path and pure state-mapping coverage.

### Required Tools/Knowledge

- Node built-in `node:test` runner through `npm test`.
- TypeScript module boundaries for `server/`, `shared/`, and `tests/`.
- Telnet command byte basics: IAC, WILL, WONT, DO, DONT, SB, and SE.
- Existing MSDP payload parser behavior in `server/index.ts`.

### Environment Requirements

- No live MUD connection is required.
- `npm install` dependencies must already be present.
- `npm test`, `npm run lint`, and `npm run build` should be runnable locally.

---

## 4. Scope

### In Scope (MVP)

- Maintainer can import Telnet parser utilities in tests - extract parser code from `server/index.ts` into a side-effect-free server module.
- Maintainer can verify split IAC behavior - cover chunk boundaries where a Telnet command begins in one buffer and ends in another.
- Maintainer can verify doubled IAC behavior - assert literal 255 bytes in data mode become text rather than commands.
- Maintainer can verify subnegotiation boundaries - cover MSDP and TTYPE data framed by IAC SB and IAC SE.
- Maintainer can verify malformed partial payload safety - assert partial MSDP boundaries do not throw or produce stale state.
- Maintainer can preserve proxy runtime behavior - keep `server/index.ts` startup, routes, and WebSocket message flow stable.

### Out of Scope (Deferred)

- Broad parser rewrite - *Reason: later Phase 01 sessions need targeted evidence before behavior changes.*
- MSDP table, array, and nested payload hardening - *Reason: Session 02 owns structured MSDP expansion.*
- Reconnect lifecycle fixes - *Reason: Session 03 owns socket and parser cleanup behavior.*
- Dynamic NAWS resize implementation - *Reason: Session 04 owns browser measurement and resize messaging.*
- xterm.js migration - *Reason: Session 05 owns terminal renderer evaluation.*
- Proxy allowlist, origin, and DNS/IP policy - *Reason: Session 06 owns public deployment safety.*

---

## 5. Technical Approach

### Architecture

Create `server/telnet-parser.ts` as a side-effect-free module that exports Telnet constants, `TelnetParser`, parser callback types, and `parseMsdpPayload`. `server/index.ts` should import those exports and keep owning Express routes, WebSocket sessions, connection limits, and MUD socket lifecycle. The parser module should accept a narrow writable transport shape instead of requiring tests to construct a real `net.Socket`.

Tests should create a small fake transport that captures bytes written by negotiation, TTYPE, and NAWS responses. The test file should push byte buffers into `TelnetParser`, collect text and MSDP callbacks, and assert deterministic callback and write output. This keeps coverage local to parser behavior and avoids live MUD, browser, or WebSocket dependencies.

### Design Patterns

- Side-effect-free module extraction: enables protocol tests without server startup.
- Narrow transport interface: tests can inspect writes while runtime still passes a real `net.Socket`.
- Characterization tests first: document current parser behavior before allowing minimal fixes.
- Fixture-compatible parsing: preserve the existing `MudValue` shape and state-mapping expectations.

### Technology Stack

- TypeScript 6.0.2.
- Node.js built-in `node:test` and `node:assert/strict`.
- `tsx` loader through `node --import tsx --test`.
- Node `Buffer` for Telnet byte fixtures.

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `server/telnet-parser.ts` | Side-effect-free Telnet parser and MSDP payload parsing exports | ~330 |
| `tests/helpers/telnet-test-socket.ts` | Captured writable transport for parser tests | ~70 |
| `tests/telnet-parser-edge-cases.test.ts` | Split IAC, doubled IAC, negotiation, subnegotiation, and malformed boundary tests | ~260 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `server/index.ts` | Import parser module and remove duplicated parser implementation | ~40 |
| `tests/README.md` | Document new Telnet parser edge-case coverage and no-live-MUD constraint | ~25 |
| `.spec_system/specs/phase01-session01-telnet-parser-edge-case-tests/implementation-notes.md` | Record implementation decisions, defects found, and deferred parser work | ~80 |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Telnet parser tests import parser code without opening HTTP, WebSocket, or TCP listeners.
- [ ] Split IAC sequence behavior is covered.
- [ ] Doubled IAC byte behavior is covered.
- [ ] Negotiation bytes flush surrounding text correctly.
- [ ] MSDP and TTYPE subnegotiation boundaries are covered.
- [ ] Malformed or partial MSDP boundary tests do not throw.
- [ ] Existing proxy startup behavior is preserved.

### Testing Requirements

- [ ] Focused Telnet parser tests written and passing.
- [ ] Existing MSDP variable-map, state-mapping, and fixture tests remain passing.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Manual review confirms no live MUD dependency was introduced.

### Non-Functional Requirements

- [ ] Parser tests run locally in under 5 seconds with no network access.
- [ ] Parser changes do not add player command logging.
- [ ] HTML terminal rendering paths and `ansi-to-html` escaping remain untouched.
- [ ] Parser behavior remains compatible with current fixture-backed `MudValue` expectations.

### Quality Gates

- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.

---

## 8. Implementation Notes

### Key Considerations

- Keep parser extraction mechanical before adding behavior tests.
- Avoid changing `server/index.ts` route, rate-limit, WebSocket, or session behavior except for imports and constructor wiring.
- Tests should assert emitted callbacks and bytes written to the fake transport rather than internal parser state.
- If a test reveals behavior that requires a larger parser rewrite, document it in implementation notes and defer it to Session 02 or Session 03.

### Potential Challenges

- Parser extraction accidentally starts or changes server behavior: mitigate by keeping `server/index.ts` as the only module with listener startup side effects.
- Test-only socket shape diverges from `net.Socket`: mitigate with a narrow transport interface that uses only the `write(Buffer)` behavior the parser needs.
- Partial UTF-8 text around IAC boundaries is easy to mishandle: preserve `StringDecoder` usage and add chunk-boundary assertions.
- Subnegotiation edge cases can create ambiguous current behavior: document the current behavior first, then make only minimal safety fixes.

### Relevant Considerations

- [P01] **Parser and reconnect coverage first**: This session creates coverage before Phase 01 changes proxy lifecycle or parser behavior.
- [P01] **`server/index.ts` is still broad**: Extract only the parser surface needed for tests; leave broader session decomposition for later boundaries.
- [P01] **`ansi-to-html` remains interim**: Do not touch terminal HTML rendering in this parser session.
- [P01] **Fixture-backed tests worked**: Reuse focused Node test style and deterministic synthetic fixtures.
- [P01] **Do not add broad parser rewrites**: Keep defect fixes minimal and defer larger behavior changes.

### Behavioral Quality Focus

Checklist active: Yes

Top behavioral risks for this session:

- Split byte sequences can leak parser state across chunks or flush text in the wrong order.
- Doubled IAC and subnegotiation bytes can be misclassified as text or commands.
- Malformed MSDP boundaries can throw, emit partial stale state, or hide parser defects.

---

## 9. Testing Strategy

### Unit Tests

- Test split IAC command sequences across multiple `push()` calls.
- Test doubled IAC bytes in text mode.
- Test text flush order before and after negotiation commands.
- Test MSDP subnegotiation callbacks and malformed partial payload boundaries.
- Test TTYPE SEND and NAWS negotiation writes through a captured transport.

### Integration Tests

- Run the existing `npm test` suite to verify extracted parser code does not break shared MSDP mapping or fixture behavior.
- Run `npm run build` to verify server-side imports compile under the existing TypeScript project references.

### Manual Testing

- Inspect `server/index.ts` to confirm no new top-level side effects were introduced by parser extraction.
- Confirm no test opens a real TCP socket, WebSocket server, browser, or live MUD connection.

### Edge Cases

- IAC byte at the end of a chunk.
- IAC IAC literal data byte.
- Text before and after WILL/DO negotiation bytes.
- SB option and payload split across chunks.
- IAC inside SB data before final SE.
- MSDP subnegotiation with missing or partial payload content.

---

## 10. Dependencies

### External Libraries

- None new.

### Internal Dependencies

- `shared/mud.ts` for `MudValue`.
- `server/index.ts` runtime MUD session wiring.
- Existing Node test runner configuration in `package.json`.

### Other Sessions

- **Depends on**: Phase 00 complete.
- **Depended by**: `phase01-session02-msdp-tables-arrays-malformed-payloads`, `phase01-session03-connection-lifecycle-reconnect-cleanup`, `phase01-session04-dynamic-naws-resize`, `phase01-session05-xterm-js-migration-spike`, `phase01-session06-proxy-limits-deployment-safety`.

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
