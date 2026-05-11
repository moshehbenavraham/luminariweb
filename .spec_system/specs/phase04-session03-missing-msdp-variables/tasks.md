# Task Checklist

**Session ID**: `phase04-session03-missing-msdp-variables`
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
| Foundation | 5 | 5 | 0 |
| Implementation | 10 | 10 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **22** | **22** | **0** |

---

## Setup (3 tasks)

Initial verification and session bookkeeping.

- [x] T001 [S0403] Verify Luminari Web and Luminari-Source branches, including upstream source commit `7dbddcd1` and Session 02 harness commit (`.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md`)
- [x] T002 [S0403] Run prerequisite checks for `rg`, `node`, `npm`, `make`, and `gcc`, recording any blockers without using live private data (`.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md`)
- [x] T003 [S0403] Create session notes, security review stub, validation stub, and external source file inventory (`.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md`)

---

## Foundation (5 tasks)

Source contract audit and selected-variable decision work.

- [x] T004 [S0403] [P] Audit selected MSDP table entries for `TITLE`, saves, `DAMAGE_BONUS`, `MINIMAP`, and `ALIGNMENT` (`/home/aiwithapex/projects/Luminari-Source/src/protocol.h`, `/home/aiwithapex/projects/Luminari-Source/src/protocol.c`)
- [x] T005 [S0403] [P] Audit source emission paths for title, saves, minimap, alignment, and damage bonus side effects (`/home/aiwithapex/projects/Luminari-Source/src/comm.c`, `/home/aiwithapex/projects/Luminari-Source/src/handler.c`)
- [x] T006 [S0403] Define selected and deferred variable contract with source-backed vs override-only boundaries (`docs/source-protocol-backlog.md`)
- [x] T007 [S0403] Update source protocol docs for text alignment, source-backed minimap, selected character fields, and deferred damage/quest boundaries (`/home/aiwithapex/projects/Luminari-Source/docs/systems/MSDP_VARIABLES.md`, `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md`)
- [x] T008 [S0403] Update implementation notes with the final selected set and older-server fallback policy (`.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md`)

---

## Implementation (10 tasks)

Selected source emissions, web mappings, fixtures, and documentation.

- [x] T009 [S0403] Add missing source MSDP enum entries and variable table rows for `TITLE`, `FORTITUDE`, `REFLEX`, and `WILLPOWER` with explicit string/number bounds (`/home/aiwithapex/projects/Luminari-Source/src/protocol.h`, `/home/aiwithapex/projects/Luminari-Source/src/protocol.c`)
- [x] T010 [S0403] Emit title and saving throws from the source update loop with null-safe title handling and signed integer save values (`/home/aiwithapex/projects/Luminari-Source/src/comm.c`)
- [x] T011 [S0403] Preserve `DAMAGE_BONUS` and `QUEST_INFO` deferrals unless a side-effect-free source contract is proven, documenting the decision (`docs/source-protocol-backlog.md`, `docs/protocol-feature-checklist.md`)
- [x] T012 [S0403] Add source harness coverage for selected variable registration and set-helper behavior with cleanup on scope exit for all acquired resources (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c`)
- [x] T013 [S0403] Promote selected source-backed web mappings while keeping deferred variables override-only (`shared/mud.ts`)
- [x] T014 [S0403] Update character display availability copy for title and saves so older-server missing data remains explicit (`shared/msdp-display.ts`)
- [x] T015 [S0403] Update map display availability copy for source-backed `MINIMAP` while preserving room/exits fallback on empty or missing map text (`shared/msdp-map-display.ts`)
- [x] T016 [S0403] Add or update synthetic MSDP fixtures for title, saves, text alignment, and minimap with schema-safe expected pairs (`tests/fixtures/msdp/core-scalars.json`, `tests/fixtures/msdp/room-and-exits.json`, `tests/fixtures/msdp/README.md`)
- [x] T017 [S0403] Update focused mapping and display tests for selected default variables and deferred override-only variables (`tests/msdp-variable-map.test.ts`, `tests/msdp-state-mapping.test.ts`, `tests/msdp-display.test.ts`, `tests/msdp-map-display.test.ts`)
- [x] T018 [S0403] Update protocol status and developer documentation without changing MCCP, GMCP, MXP, MSP, CHARSET, native WebSocket, or quest support claims (`docs/protocol-feature-checklist.md`, `docs/development.md`)

---

## Testing (4 tasks)

Verification and quality gates.

- [x] T019 [S0403] Run the source parser harness command and record results (`/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/Makefile`)
- [x] T020 [S0403] Run focused web protocol tests for mappings, display, map, and fixtures (`tests/msdp-variable-map.test.ts`, `tests/msdp-state-mapping.test.ts`, `tests/msdp-display.test.ts`, `tests/msdp-map-display.test.ts`, `tests/msdp-fixture-mapping.test.ts`)
- [x] T021 [S0403] Run the full Luminari Web test suite and record pass/fail evidence (`package.json`)
- [x] T022 [S0403] Run lint and build, documenting any existing Vite large-chunk warning separately from failures (`package.json`)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] Source harness passes or blockers are documented
- [x] Web focused and full tests passing
- [x] `npm run lint` and `npm run build` passing
- [x] All files ASCII-encoded
- [x] `implementation-notes.md` updated
- [x] `security-compliance.md` updated
- [x] `validation.md` updated
- [x] Ready for the validate workflow step

---

## Next Steps

Run the validate workflow step to verify session completeness.
