# Session Specification

**Session ID**: `phase01-session04-dynamic-naws-resize`
**Phase**: 01 - Harden Terminal and Proxy
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session replaces the current fixed NAWS dimensions with browser-measured terminal dimensions that are sent to the proxy when the terminal is first ready and when its layout changes. It builds on the completed lifecycle work so resize updates can be scoped to the active MUD session and ignored safely when disconnected or stale.

The current parser responds to NAWS negotiation with static defaults from `server/telnet-parser.ts`. The client already has a terminal element reference in `src/App.tsx`, but it does not measure character cells or send resize messages through the WebSocket contract. This session adds the smallest typed path needed to keep terminal dimensions accurate without changing the renderer or redesigning layout.

The result should be a reliable NAWS flow for desktop and mobile layout changes: measure the terminal viewport, debounce updates, validate browser messages, send NAWS only after server support is negotiated, and cover initial plus changed dimensions with focused tests.

---

## 2. Objectives

1. Add a typed browser-to-proxy resize message carrying measured terminal columns and rows.
2. Measure terminal dimensions from the rendered terminal container and current font settings without disrupting command input focus.
3. Send initial and debounced resize updates from the client only when a proxy WebSocket is available.
4. Update the proxy/parser NAWS behavior so dimensions are sent after NAWS support is negotiated and refreshed on later resize changes.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase01-session01-telnet-parser-edge-case-tests` - Provides Telnet negotiation coverage, including current NAWS default behavior.
- [x] `phase01-session02-msdp-tables-arrays-malformed-payloads` - Provides parser fixture discipline for protocol-safe changes.
- [x] `phase01-session03-connection-lifecycle-reconnect-cleanup` - Provides testable `MudSession` lifecycle boundaries and stale socket guards.

### Required Tools/Knowledge
- React `ResizeObserver`, refs, effects, and stable callbacks.
- Existing `ClientMessage`, `MudSession`, and `TelnetParser` contracts.
- Telnet NAWS subnegotiation format: IAC SB TELOPT_NAWS width height IAC SE.
- Node built-in `node:test` runner with `tsx`.

### Environment Requirements
- `npm install` has already been run.
- `npm test`, `npm run lint`, and `npm run build` are available.
- No live MUD server is required for automated parser and session tests.

---

## 4. Scope

### In Scope (MVP)
- Player terminal dimensions are measured from the browser terminal area - compute columns and rows from the terminal element, computed font, line height, and available content box.
- Player resize changes reach the active proxy session - add a debounced typed resize message with duplicate-trigger prevention while in-flight.
- MUD receives NAWS after support is negotiated - track NAWS support in the parser/session and send dimensions only after the server requests NAWS.
- Maintainer can validate protocol bytes - add focused tests for initial defaults, custom dimensions, changed dimensions, and disconnected/stale paths.
- Player command workflow remains stable - preserve current command input, terminal rendering, auto-scroll, aliases, and triggers.

### Out of Scope (Deferred)
- Full xterm.js migration - *Reason: Session 05 owns renderer evaluation and migration scope.*
- Complex layout redesign - *Reason: This session only measures current terminal layout.*
- Server-side Luminari-Source changes - *Reason: The proxy can already negotiate Telnet NAWS with compatible servers.*
- Mapper or game-panel work - *Reason: Phase 02 owns Luminari game panels.*
- Public deployment allowlists and origin policy - *Reason: Session 06 owns deployment safety guardrails.*

---

## 5. Technical Approach

### Architecture

Extend the shared WebSocket contract with a `resize` message that carries bounded integer `columns` and `rows`. The React client should measure the `.terminal-output` element through the existing `terminalRef`, calculate terminal cells from computed styles, clamp values to safe bounds, and send updates through the existing `sendMessage` helper. A `ResizeObserver` should observe the terminal container, while settings changes such as terminal font size and line height should trigger a remeasurement.

On the proxy side, keep `server/index.ts` as message routing only. Validate resize messages in `parseClientMessage`, then pass normalized dimensions into `MudSession`. `MudSession` should retain the latest dimensions for the active session and delegate NAWS writes to `TelnetParser`. `TelnetParser` should expose a narrow method for updating terminal size and internally track whether NAWS has been negotiated so resize updates cannot emit unsupported subnegotiations.

Tests should cover both low-level parser bytes and lifecycle-level message flow. Keep the fake socket harness from Session 03 and add resize assertions without opening a live MUD connection.

### Design Patterns
- Shared contract first: Add the resize message to `shared/mud.ts` before wiring client and server behavior.
- Bounded input validation: Clamp and reject invalid browser-provided dimensions at the WebSocket boundary.
- Negotiated capability guard: Send NAWS only after DO NAWS has been received and WILL NAWS has been written.
- Debounced observer: Collapse rapid layout changes into one resize message while keeping initial dimensions prompt.
- Current-socket guard: Existing session guards should prevent stale socket writes after reconnect.

### Technology Stack
- TypeScript 6
- React 19
- Browser `ResizeObserver`
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
| `tests/helpers/naws-packets.ts` | Shared NAWS byte helpers for parser and lifecycle assertions | ~80 |
| `.spec_system/specs/phase01-session04-dynamic-naws-resize/implementation-notes.md` | Implementation progress and command evidence | ~90 |
| `.spec_system/specs/phase01-session04-dynamic-naws-resize/security-compliance.md` | Session security and privacy notes | ~60 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `shared/mud.ts` | Add typed browser resize message contract | ~10 |
| `src/App.tsx` | Measure terminal dimensions, debounce updates, and send resize messages | ~120 |
| `server/index.ts` | Parse and validate resize messages before routing to `MudSession` | ~45 |
| `server/mud-session.ts` | Store active terminal dimensions and forward updates to the parser | ~70 |
| `server/telnet-parser.ts` | Track NAWS support and emit initial/updated NAWS subnegotiations | ~65 |
| `tests/telnet-parser-edge-cases.test.ts` | Update NAWS parser tests for custom dimensions and resize updates | ~80 |
| `tests/proxy-lifecycle.test.ts` | Add session-level resize routing, reconnect, and disconnected-state coverage | ~100 |
| `tests/helpers/proxy-lifecycle-harness.ts` | Expose resize assertions and NAWS written-byte helpers | ~45 |
| `tests/README.md` | Document NAWS resize coverage and no-live-MUD constraints | ~20 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Initial NAWS uses measured terminal dimensions when the server negotiates NAWS.
- [ ] Resizing the terminal pane sends updated columns and rows through a typed WebSocket message.
- [ ] Resize traffic is debounced and duplicate unchanged dimensions are not repeatedly sent.
- [ ] The proxy validates resize dimensions before mutating session state.
- [ ] NAWS updates are sent only after server support is negotiated.
- [ ] Command input, terminal rendering, auto-scroll, aliases, and triggers continue to behave normally.

### Testing Requirements
- [ ] Parser tests cover default NAWS, custom initial dimensions, and subsequent resize updates.
- [ ] MudSession tests cover resize before connect, before NAWS negotiation, after NAWS negotiation, after disconnect, and after reconnect.
- [ ] Existing parser, MSDP, and lifecycle tests still pass.
- [ ] Manual desktop and mobile-width resize notes are recorded if practical.

### Non-Functional Requirements
- [ ] Terminal resize updates stay below 100 ms perceived latency after debounce settles.
- [ ] Resize handling does not introduce raw HTML rendering changes or weaken XML escaping.
- [ ] No player command text is logged by resize diagnostics.

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
- Keep this session limited to current renderer measurement and NAWS message flow.
- Preserve the `renderMudHtml()` and `ansi-to-html` escaping paths.
- Keep resize messages scoped to non-secret numeric terminal dimensions.
- Avoid growing cookie persistence or client settings payloads.
- Keep `/health`, `/api/settings`, and `/ws` stable.

### Potential Challenges
- Character-cell measurement can be approximate with proportional fallback fonts: Use computed font metrics from a hidden or temporary measurement span and clamp to minimum viable terminal dimensions.
- `ResizeObserver` can fire rapidly or loop during layout changes: Debounce, compare against the last sent dimensions, and avoid state updates unless values changed.
- The server may not negotiate NAWS: Retain latest dimensions but do not write NAWS until support exists.
- Reconnects can race with stale resize updates: Route through the active `MudSession` and current parser only.

### Relevant Considerations
- [P01] **`server/index.ts` still owns proxy routes and WebSocket wiring**: Keep message parsing changes narrow and leave lifecycle behavior in `MudSession`.
- [P01] **`src/App.tsx` remains a large integration point**: Add measurement in place with focused helpers; defer broader splitting.
- [P01] **`ansi-to-html` remains interim**: Do not alter HTML output or escaping while adding resize behavior.
- [P01] **Fixture and Node test approach worked**: Extend parser and lifecycle tests with deterministic NAWS byte assertions.
- [P01] **Do not log raw player commands**: Resize diagnostics should include dimensions only, if any diagnostics are needed.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Rapid resize events can flood the proxy or MUD without debounce and duplicate suppression.
- NAWS bytes can be sent before the server has negotiated support.
- Reconnects can reuse stale dimensions, parser support flags, or socket writes after cleanup.

---

## 9. Testing Strategy

### Unit Tests
- Test parser negotiation writes WILL NAWS and sends the current dimensions in the NAWS subnegotiation.
- Test parser resize updates write new NAWS bytes only after support is negotiated.
- Test browser resize message parsing accepts bounded integers and rejects malformed values.

### Integration Tests
- Use the lifecycle harness to verify resize messages before connect, before NAWS negotiation, after NAWS negotiation, after disconnect, and after reconnect.
- Keep existing `npm test` coverage for parser edge cases, MSDP fixtures, state mapping, and reconnect lifecycle passing.

### Manual Testing
- Start the dev server, connect to a configured MUD route when available, resize the browser window, and verify no command input focus regression.
- Check a 390px viewport for no horizontal page scrolling and continued command dock usability.

### Edge Cases
- `ResizeObserver` is unavailable in an older or test-like browser environment.
- Terminal element has zero width or height while hidden or during initial layout.
- Font size or line height settings change while connected.
- Server negotiates NAWS after the client already measured terminal size.
- Resize arrives while disconnected or after a manual disconnect.
- Columns or rows exceed 16-bit NAWS limits or arrive as invalid browser data.

---

## 10. Dependencies

### External Libraries
- None new.

### Other Sessions
- **Depends on**: `phase01-session01-telnet-parser-edge-case-tests`, `phase01-session02-msdp-tables-arrays-malformed-payloads`, `phase01-session03-connection-lifecycle-reconnect-cleanup`
- **Depended by**: `phase01-session05-xterm-js-migration-spike`, Phase 02 room/map and mobile terminal workflows

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
