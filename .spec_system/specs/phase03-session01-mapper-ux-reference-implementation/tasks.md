# Task Checklist

**Session ID**: `phase03-session01-mapper-ux-reference-implementation`
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
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **21** | **21** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0301] Verify Phase 02 mapper prerequisites and current map tests (`tests/msdp-map-display.test.ts`)
- [x] T002 [S0301] [P] Create implementation notes with GPL reference boundaries and behavior-only findings (`.spec_system/specs/phase03-session01-mapper-ux-reference-implementation/implementation-notes.md`)
- [x] T003 [S0301] [P] Create security and compliance notes covering license posture and secret-free mapper behavior (`.spec_system/specs/phase03-session01-mapper-ux-reference-implementation/security-compliance.md`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0301] Define mapper node, branch, and source types with types matching declared contract and exhaustive state handling (`shared/msdp-map-display.ts`)
- [x] T005 [S0301] Build current-room mapper model from `ROOM`, `ROOM_NAME`, `ROOM_VNUM`, and `AREA_NAME` with explicit loading, empty, error, and offline states (`shared/msdp-map-display.ts`)
- [x] T006 [S0301] Build deterministic directional exit branch normalization from room exits with bounded summaries and deterministic ordering (`shared/msdp-map-display.ts`)
- [x] T007 [S0301] Preserve raw, unknown, and malformed exit fallback text with bounded output and no invented destinations (`shared/msdp-map-display.ts`)
- [x] T008 [S0301] Extend map display contract while keeping `MINIMAP` override-only state separate from room/exits fallback (`shared/msdp-map-display.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T009 [S0301] Add current-room and exit-branch mapper data to the existing fallback builder with schema-aligned field handling (`shared/msdp-map-display.ts`)
- [x] T010 [S0301] Update `MapPanel` to route fallback maps into the new mapper rendering without changing live override behavior (`src/App.tsx`)
- [x] T011 [S0301] Add current-room mapper node rendering with accessible labels and escaped MUD text output (`src/App.tsx`)
- [x] T012 [S0301] Add directional exit branch rendering with platform-appropriate accessibility labels and input support where interactive (`src/App.tsx`)
- [x] T013 [S0301] Preserve no-source map states and availability notices in the map panel with explicit loading, empty, error, and offline states (`src/App.tsx`)
- [x] T014 [S0301] Add stable mapper board, current-room, and exit-branch styles with fixed-format dimensions that cannot shift layout (`src/App.css`)
- [x] T015 [S0301] Add narrow-sidebar, 390px, and 360px map styles that avoid horizontal page scrolling and command input overlap (`src/App.css`)
- [x] T016 [S0301] [P] Add map display tests for current room, exit branches, deterministic ordering, and `MINIMAP` separation (`tests/msdp-map-display.test.ts`)
- [x] T017 [S0301] [P] Add map display tests for partial room identity, raw exits, unknown fields, and malformed fallback output (`tests/msdp-map-display.test.ts`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T018 [S0301] [P] Update MSDP fixture notes for mapper limits and synthetic room/exits shapes (`tests/fixtures/msdp/README.md`)
- [x] T019 [S0301] [P] Update test documentation with the targeted mapper command and responsive smoke checks (`tests/README.md`)
- [x] T020 [S0301] Run targeted mapper tests, full test suite, lint, and build (`package.json`)
- [x] T021 [S0301] Record desktop, 390px, and 360px manual validation results and any residual risks (`.spec_system/specs/phase03-session01-mapper-ux-reference-implementation/implementation-notes.md`)

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
