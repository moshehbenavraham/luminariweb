# Task Checklist

**Session ID**: `phase00-session04-msdp-fixture-corpus`
**Total Tasks**: 21
**Estimated Duration**: 3-4 hours
**Created**: 2026-05-10

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
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **21** | **21** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0004] Verify Session 01-03 completion, source MSDP facts, current parser constants, and fixture location before edits (`.spec_system/specs/phase00-session04-msdp-fixture-corpus/implementation-notes.md`)
- [x] T002 [S0004] [P] Create implementation notes scaffold with fixture decisions, validation commands, coverage review, and follow-up sections (`.spec_system/specs/phase00-session04-msdp-fixture-corpus/implementation-notes.md`)
- [x] T003 [S0004] [P] Create security compliance notes scaffold covering synthetic fixture data, no live secrets, and unchanged proxy behavior (`.spec_system/specs/phase00-session04-msdp-fixture-corpus/security-compliance.md`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0004] Create MSDP fixture README with corpus purpose, directory contract, and control-token definitions (`tests/fixtures/msdp/README.md`)
- [x] T005 [S0004] Define fixture JSON shape for ids, versions, origins, coverage tags, source facts, payload tokens, expected pairs, and notes (`tests/fixtures/msdp/README.md`)
- [x] T006 [S0004] Create versioned manifest with fixture ids, file paths, origins, coverage tags, and parser expectation summaries (`tests/fixtures/msdp/manifest.json`)
- [x] T007 [S0004] Add source-fact coverage matrix for confirmed variables and override-only exclusions (`tests/fixtures/msdp/README.md`)
- [x] T008 [S0004] Add fixture review checklist for synthetic versus real-capture labeling, malformed safety, ASCII, and future test consumption (`tests/fixtures/msdp/README.md`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T009 [S0004] [P] Create core scalar fixture for server metadata, character identity, ability scores, and numeric normalization (`tests/fixtures/msdp/core-scalars.json`)
- [x] T010 [S0004] [P] Create combat and resources fixture for resource, experience, combat, tank, position, money, and practice expectations (`tests/fixtures/msdp/combat-and-resources.json`)
- [x] T011 [S0004] [P] Create room and exits fixture for `ROOM`, `ROOM_NAME`, `AREA_NAME`, `ROOM_VNUM`, `ROOM_EXITS`, and `WORLD_TIME` (`tests/fixtures/msdp/room-and-exits.json`)
- [x] T012 [S0004] [P] Create collection fixture for `ACTIONS`, `INVENTORY`, `AFFECTS`, empty arrays, and simple table payloads (`tests/fixtures/msdp/collections.json`)
- [x] T013 [S0004] [P] Create group fixture with representative member tables, partial member data, and expected parsed group structures (`tests/fixtures/msdp/group-data.json`)
- [x] T014 [S0004] [P] Create nested table fixture for mixed table and array payloads that later parser tests can encode deterministically (`tests/fixtures/msdp/nested-tables.json`)
- [x] T015 [S0004] [P] Create malformed payload fixture for truncated values, missing markers, empty variable names, and incomplete table/array cases with safe expected output (`tests/fixtures/msdp/malformed-payloads.json`)
- [x] T016 [S0004] Update manifest coverage counts and fixture index after all fixture files exist (`tests/fixtures/msdp/manifest.json`)
- [x] T017 [S0004] Document future parser and state-mapping test consumption notes, including how token payloads should become raw MSDP bytes (`tests/fixtures/msdp/README.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T018 [S0004] Parse all fixture JSON files and verify unique ids, existing manifest paths, and required fields (`.spec_system/specs/phase00-session04-msdp-fixture-corpus/implementation-notes.md`)
- [x] T019 [S0004] Run `npm run lint` and record pass/fail output with fixture-only scope notes (`.spec_system/specs/phase00-session04-msdp-fixture-corpus/implementation-notes.md`)
- [x] T020 [S0004] Run `npm run build` and record pass/fail output with unchanged app-source confirmation (`.spec_system/specs/phase00-session04-msdp-fixture-corpus/implementation-notes.md`)
- [x] T021 [S0004] Validate ASCII, LF line endings, source-fact coverage, malformed-case expectations, and scoped git diff (`.spec_system/specs/phase00-session04-msdp-fixture-corpus/tasks.md`)

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
