# Task Checklist

**Session ID**: `phase01-session04-dynamic-naws-resize`
**Total Tasks**: 22
**Estimated Duration**: 3-4 hours
**Created**: 2026-05-11

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[SNNMM]` = Session reference (NN=phase number, MM=session number)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 6 | 6 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **22** | **22** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0104] Verify Session 03 lifecycle tests are passing and record prerequisite evidence (`.spec_system/specs/phase01-session04-dynamic-naws-resize/implementation-notes.md`)
- [x] T002 [S0104] Inspect current terminal sizing, auto-scroll, and command focus behavior before edits (`src/App.tsx`)
- [x] T003 [S0104] Create session security notes covering numeric-only resize data, no command logging, and WebSocket validation boundaries (`.spec_system/specs/phase01-session04-dynamic-naws-resize/security-compliance.md`)

---

## Foundation (6 tasks)

Core structures and base implementations.

- [x] T004 [S0104] [P] Add typed `resize` client message fields for bounded terminal columns and rows (`shared/mud.ts`)
- [x] T005 [S0104] [P] Create reusable NAWS packet assertion helpers for parser and lifecycle tests (`tests/helpers/naws-packets.ts`)
- [x] T006 [S0104] Add terminal dimension type, bounds, and normalization helpers for browser measurements (`src/App.tsx`)
- [x] T007 [S0104] Add server-side resize message parsing with schema-validated input and explicit error mapping (`server/index.ts`)
- [x] T008 [S0104] Add parser-level NAWS support state and a public terminal-size update method (`server/telnet-parser.ts`)
- [x] T009 [S0104] Add MudSession terminal-size state and resize update entry point scoped to the active parser (`server/mud-session.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T010 [S0104] Implement browser terminal cell measurement from `terminalRef` with zero-size fallback and bounded dimensions (`src/App.tsx`)
- [x] T011 [S0104] Implement `ResizeObserver` wiring for the terminal element with cleanup on scope exit for all acquired resources (`src/App.tsx`)
- [x] T012 [S0104] Implement debounced resize message dispatch with duplicate-trigger prevention while in-flight (`src/App.tsx`)
- [x] T013 [S0104] Trigger immediate dimension measurement on WebSocket open, connection status changes, and terminal font setting changes (`src/App.tsx`)
- [x] T014 [S0104] Route validated resize messages from WebSocket handling into the current session (`server/index.ts`)
- [x] T015 [S0104] Send initial measured NAWS dimensions when the MUD negotiates NAWS support (`server/telnet-parser.ts`)
- [x] T016 [S0104] Send updated NAWS bytes after later terminal-size changes with support-gated writes (`server/telnet-parser.ts`)
- [x] T017 [S0104] Reset or revalidate parser NAWS state on reconnect and disconnect so stale sockets cannot receive resize writes (`server/mud-session.ts`)
- [x] T018 [S0104] Preserve command input focus, terminal auto-scroll, aliases, triggers, and current renderer behavior while resize effects run (`src/App.tsx`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T019 [S0104] Add parser tests for default NAWS, custom initial dimensions, changed dimensions, and unsupported-before-negotiation behavior (`tests/telnet-parser-edge-cases.test.ts`)
- [x] T020 [S0104] Add lifecycle tests for resize before connect, before NAWS negotiation, after NAWS negotiation, after disconnect, and after reconnect (`tests/proxy-lifecycle.test.ts`)
- [x] T021 [S0104] Update test documentation with NAWS resize coverage and manual desktop/mobile verification notes (`tests/README.md`)
- [x] T022 [S0104] Run `npm test`, `npm run lint`, `npm run build`, and ASCII checks, then record command evidence (`.spec_system/specs/phase01-session04-dynamic-naws-resize/implementation-notes.md`)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for the validate workflow step

---

## Next Steps

Run the validate workflow step to verify session completeness.
