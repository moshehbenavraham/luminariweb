# Task Checklist

**Session ID**: `phase04-session02-protocol-parser-test-harness`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-05-11

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0402]` = Session reference (04=phase number, 02=session number)
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

Initial harness preparation and evidence inventory.

- [x] T001 [S0402] Verify Phase 04 Session 01 backlog and validation artifacts are available (`docs/source-protocol-backlog.md`)
- [x] T002 [S0402] [P] Verify Luminari-Source checkout, CuTest make targets, and local compiler prerequisites (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/Makefile`)
- [x] T003 [S0402] [P] Review existing Luminari Web parser edge-case coverage for source parity planning (`tests/telnet-parser-edge-cases.test.ts`)

---

## Foundation (5 tasks)

Harness design, case matrix, and privacy boundaries.

- [x] T004 [S0402] Define source parser validation case matrix for A1-A4, TTYPE, NAWS, and unsupported options (`.spec_system/specs/phase04-session02-protocol-parser-test-harness/implementation-notes.md`)
- [x] T005 [S0402] Identify minimal descriptor, protocol, and output test doubles required for `ProtocolInput` with schema-validated byte fixtures and explicit error mapping (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c`)
- [x] T006 [S0402] [P] Define deterministic byte fixture helpers for IAC, SB, SE, MSDP, GMCP, NAWS, and TTYPE with bounds-checked buffers (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c`)
- [x] T007 [S0402] [P] Document synthetic-fixture privacy rules and redaction boundaries for source protocol validation (`/home/aiwithapex/projects/Luminari-Source/docs/testing/PROTOCOL_PARSER_HARNESS.md`)
- [x] T008 [S0402] Decide and record fallback procedure if direct CuTest linking is blocked by broad source dependencies (`.spec_system/specs/phase04-session02-protocol-parser-test-harness/implementation-notes.md`)

---

## Implementation (8 tasks)

Source harness, runnable procedure, and aligned documentation.

- [x] T009 [S0402] Create source protocol parser CuTest file and suite skeleton with no live sockets or private data (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c`)
- [x] T010 [S0402] Implement split IAC and doubled IAC validation cases with cleanup on scope exit for all acquired resources (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c`)
- [x] T011 [S0402] Implement incomplete subnegotiation, malformed MSDP, and malformed GMCP cases with explicit error mapping (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c`)
- [x] T012 [S0402] Implement TTYPE, NAWS, and unsupported option negotiation cases with deterministic ordering and exhaustive expected responses (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c`)
- [x] T013 [S0402] Add oversized response-path coverage or explicit blocked-coverage notes for MSDP lists, MSSP, MXP tags, and copyover strings (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c`)
- [x] T014 [S0402] Integrate the protocol harness into the source CuTest makefile with a focused target (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/Makefile`)
- [x] T015 [S0402] Write runnable protocol harness procedure, case matrix, limitations, and privacy notes (`/home/aiwithapex/projects/Luminari-Source/docs/testing/PROTOCOL_PARSER_HARNESS.md`)
- [x] T016 [S0402] Update Luminari Web protocol backlog and checklist with source harness coverage and unchanged support boundaries (`docs/source-protocol-backlog.md`, `docs/protocol-feature-checklist.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0402] Run the source protocol harness command or document exact blockers and fallback validation steps (`.spec_system/specs/phase04-session02-protocol-parser-test-harness/implementation-notes.md`)
- [x] T018 [S0402] Run focused Luminari Web parser/protocol tests and record results (`tests/telnet-parser-edge-cases.test.ts`)
- [x] T019 [S0402] Run applicable Luminari Web quality gates or document blockers (`.spec_system/specs/phase04-session02-protocol-parser-test-harness/implementation-notes.md`)
- [x] T020 [S0402] Validate ASCII encoding, LF line endings, changed file list, and conservative protocol support labels (`.spec_system/specs/phase04-session02-protocol-parser-test-harness/tasks.md`)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing or blockers documented
- [x] All files ASCII-encoded
- [x] `implementation-notes.md` updated
- [x] Ready for the validate workflow step

---

## Next Steps

Run the validate workflow step to verify session completeness.
