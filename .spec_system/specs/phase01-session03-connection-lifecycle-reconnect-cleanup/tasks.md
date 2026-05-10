# Task Checklist

**Session ID**: `phase01-session03-connection-lifecycle-reconnect-cleanup`
**Total Tasks**: 21
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
| Foundation | 5 | 5 | 0 |
| Implementation | 8 | 8 | 0 |
| Testing | 5 | 5 | 0 |
| **Total** | **21** | **21** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0103] Verify Session 01 and Session 02 parser tests are passing and record prerequisite evidence (`.spec_system/specs/phase01-session03-connection-lifecycle-reconnect-cleanup/implementation-notes.md`)
- [x] T002 [S0103] Create session implementation notes with lifecycle assumptions and known status-event behavior (`.spec_system/specs/phase01-session03-connection-lifecycle-reconnect-cleanup/implementation-notes.md`)
- [x] T003 [S0103] Create session security notes covering command logging, socket cleanup, and no-live-secret fixture constraints (`.spec_system/specs/phase01-session03-connection-lifecycle-reconnect-cleanup/security-compliance.md`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0103] [P] Extract sliding-window rate limiter into a server module without changing HTTP or command limits (`server/rate-limiter.ts`)
- [x] T005 [S0103] Extract `MudSession` into a testable lifecycle module with injectable MUD socket creation (`server/mud-session.ts`)
- [x] T006 [S0103] Refactor server bootstrap to import extracted session and limiter modules while preserving `/health`, `/api/settings`, static serving, and `/ws` behavior (`server/index.ts`)
- [x] T007 [S0103] [P] Create lifecycle harness fake browser socket and fake MUD socket helpers with cleanup on scope exit for all acquired resources (`tests/helpers/proxy-lifecycle-harness.ts`)
- [x] T008 [S0103] Add baseline lifecycle regression tests that describe current disconnect and close status sequencing (`tests/proxy-lifecycle.test.ts`)

---

## Implementation (8 tasks)

Main feature implementation.

- [x] T009 [S0103] Implement idempotent manual disconnect cleanup with duplicate-trigger prevention while in-flight (`server/mud-session.ts`)
- [x] T010 [S0103] Implement browser WebSocket close cleanup that destroys active MUD sockets with cleanup on scope exit for all acquired resources (`server/index.ts`)
- [x] T011 [S0103] Implement MUD socket close cleanup for parser, socket reference, MSDP initialization, and accumulated state (`server/mud-session.ts`)
- [x] T012 [S0103] Implement MUD socket error handling with explicit error mapping and no raw player command logging (`server/mud-session.ts`)
- [x] T013 [S0103] Guard stale socket close and error callbacks so older sockets cannot mutate a reconnected session (`server/mud-session.ts`)
- [x] T014 [S0103] Reset parser and MSDP readiness on reconnect with state reset or revalidation on re-entry (`server/mud-session.ts`)
- [x] T015 [S0103] Suppress or normalize redundant disconnected status events while keeping client-visible recovery detail understandable (`server/mud-session.ts`)
- [x] T016 [S0103] Add 25-cycle reconnect exercise through the lifecycle harness with deterministic ordering and cleanup on scope exit (`tests/proxy-lifecycle.test.ts`)

---

## Testing (5 tasks)

Verification and quality assurance.

- [x] T017 [S0103] Add tests for browser close destroying active MUD sockets and leaving no duplicate active connection accounting (`tests/proxy-lifecycle.test.ts`)
- [x] T018 [S0103] Add tests for MUD socket close and error paths resetting parser, socket, MSDP readiness, and visible state (`tests/proxy-lifecycle.test.ts`)
- [x] T019 [S0103] Add tests for reconnect after MSDP state updates to prove stale state and stale callbacks do not leak (`tests/proxy-lifecycle.test.ts`)
- [x] T020 [S0103] Update test documentation with lifecycle coverage and no-live-MUD constraints (`tests/README.md`)
- [x] T021 [S0103] Run `npm test`, `npm run lint`, `npm run build`, and ASCII checks, then record command evidence (`.spec_system/specs/phase01-session03-connection-lifecycle-reconnect-cleanup/implementation-notes.md`)

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
