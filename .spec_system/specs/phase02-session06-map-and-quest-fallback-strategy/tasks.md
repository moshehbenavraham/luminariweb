# Task Checklist

**Session ID**: `phase02-session06-map-and-quest-fallback-strategy`
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

- [x] T001 [S0206] Verify Session 05 room artifacts and existing room fixture coverage before map work (`.spec_system/specs/phase02-session06-map-and-quest-fallback-strategy/implementation-notes.md`)
- [x] T002 [S0206] Document current `MINIMAP` evidence status and confirm it remains override-only for this session (`.spec_system/specs/phase02-session06-map-and-quest-fallback-strategy/implementation-notes.md`)
- [x] T003 [S0206] Identify the narrow extraction boundaries for current map and quest rendering without broad sidebar refactors (`.spec_system/specs/phase02-session06-map-and-quest-fallback-strategy/implementation-notes.md`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0206] [P] Create map display model types and availability notices with explicit loading, empty, disabled, offline, error, fallback, and live override states (`shared/msdp-map-display.ts`)
- [x] T005 [S0206] [P] Create quest fallback display model types with structured override handling and no free-form quest command scraping (`shared/msdp-quest-display.ts`)
- [x] T006 [S0206] Implement deterministic room/exits map summary generation using Session 05 room normalization (`shared/msdp-map-display.ts`)
- [x] T007 [S0206] Implement quest availability decisions for unsupported default, configured waiting, empty, present, offline, and error states (`shared/msdp-quest-display.ts`)
- [x] T008 [S0206] [P] Create the Phase 04 structured quest MSDP follow-up note with payload-shape and fixture requirements (`.spec_system/specs/phase02-session06-map-and-quest-fallback-strategy/phase04-quest-msdp-follow-up.md`)

---

## Implementation (8 tasks)

Main feature implementation.

- [x] T009 [S0206] Replace inline map state derivation with the shared map display helper while preserving escaped HTML rendering (`src/App.tsx`)
- [x] T010 [S0206] Add a focused `MapPanel` renderer with accessible labels and platform-appropriate keyboard/focus behavior (`src/App.tsx`)
- [x] T011 [S0206] Remove obsolete inline `buildMapOutput` and `buildRoomOutput` helpers after shared model wiring (`src/App.tsx`)
- [x] T012 [S0206] Wire the quest tab to the shared quest fallback model while keeping default `QUEST_INFO` unavailable copy explicit (`src/App.tsx`)
- [x] T013 [S0206] Preserve structured quest override rendering for configured server payloads with bounded and escaped output (`src/App.tsx`)
- [x] T014 [S0206] Style the map panel with stable dimensions, deterministic exit layout, and mobile-safe overflow handling (`src/App.css`)
- [x] T015 [S0206] Style quest fallback and structured quest states so copy wraps inside the sidebar at 390px and 360px (`src/App.css`)
- [x] T016 [S0206] Document new map and quest display helpers plus manual smoke expectations (`shared/README_shared.md`, `tests/README.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0206] [P] Write unit tests for map display fallback, live override, disabled, loading, empty, offline, and error states (`tests/msdp-map-display.test.ts`)
- [x] T018 [S0206] [P] Write unit tests for quest fallback unavailable, waiting, empty, structured override, offline, and error states (`tests/msdp-quest-display.test.ts`)
- [x] T019 [S0206] Run `npm test`, `npm run lint`, and `npm run build`, then record results (`.spec_system/specs/phase02-session06-map-and-quest-fallback-strategy/implementation-notes.md`)
- [x] T020 [S0206] Validate ASCII encoding, mobile smoke coverage, and absence of free-form quest command parsing (`.spec_system/specs/phase02-session06-map-and-quest-fallback-strategy/implementation-notes.md`)

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

Session complete. Run `updateprd` to sync phase tracking and archive the phase artifacts.
