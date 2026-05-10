# Task Checklist

**Session ID**: `phase01-session01-telnet-parser-edge-case-tests`
**Total Tasks**: 20
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
| Testing | 4 | 4 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0101] Verify Phase 00 commands still run and note the current test runner behavior (`package.json`)
- [x] T002 [S0101] Review current parser, MSDP, TTYPE, and NAWS ownership before extraction (`server/index.ts`)
- [x] T003 [S0101] Create implementation notes shell for parser decisions and deferred defects (`.spec_system/specs/phase01-session01-telnet-parser-edge-case-tests/implementation-notes.md`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0101] [P] Create captured writable transport helper for parser tests (`tests/helpers/telnet-test-socket.ts`)
- [x] T005 [S0101] Extract Telnet constants, parser callbacks, and transport interface into a side-effect-free module (`server/telnet-parser.ts`)
- [x] T006 [S0101] Move `TelnetParser` into the parser module without runtime behavior changes (`server/telnet-parser.ts`)
- [x] T007 [S0101] Move MSDP payload parsing helpers into the parser module while preserving fixture-compatible `MudValue` output (`server/telnet-parser.ts`)
- [x] T008 [S0101] Modify the proxy server to import the parser module while preserving listener startup and WebSocket behavior (`server/index.ts`)

---

## Implementation (8 tasks)

Main feature implementation.

- [x] T009 [S0101] Add parser import smoke coverage that proves tests do not start the HTTP or WebSocket server (`tests/telnet-parser-edge-cases.test.ts`)
- [x] T010 [S0101] Add split IAC sequence tests with explicit callback order and no live socket dependency (`tests/telnet-parser-edge-cases.test.ts`)
- [x] T011 [S0101] Add doubled IAC literal byte tests with UTF-8 decoder preservation around chunk boundaries (`tests/telnet-parser-edge-cases.test.ts`)
- [x] T012 [S0101] Add text flush tests around WILL, WONT, DO, and DONT negotiation bytes with deterministic transport writes (`tests/telnet-parser-edge-cases.test.ts`)
- [x] T013 [S0101] Add MSDP subnegotiation boundary tests with schema-compatible expected pairs and explicit empty-output behavior (`tests/telnet-parser-edge-cases.test.ts`)
- [x] T014 [S0101] Add malformed and partial MSDP boundary tests with no-throw assertions and no stale callback emission (`tests/telnet-parser-edge-cases.test.ts`)
- [x] T015 [S0101] Add TTYPE SEND and unsupported-option negotiation tests with captured response bytes (`tests/telnet-parser-edge-cases.test.ts`)
- [x] T016 [S0101] Apply minimal parser fixes required by the new tests with cleanup on parser scope exit for all buffered state (`server/telnet-parser.ts`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0101] [P] Update test documentation with Telnet parser coverage and no-live-MUD constraints (`tests/README.md`)
- [x] T018 [S0101] Run `npm test` and fix parser regressions without weakening existing MSDP fixture coverage (`tests/telnet-parser-edge-cases.test.ts`)
- [x] T019 [S0101] Run `npm run lint` and `npm run build`, fixing import and type regressions (`server/index.ts`)
- [x] T020 [S0101] Validate ASCII/LF output and record any deferred parser defects or follow-up risks (`.spec_system/specs/phase01-session01-telnet-parser-edge-case-tests/implementation-notes.md`)

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
