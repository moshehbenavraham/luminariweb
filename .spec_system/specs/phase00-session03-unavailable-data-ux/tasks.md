# Task Checklist

**Session ID**: `phase00-session03-unavailable-data-ux`
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

- [x] T001 [S0003] Verify Session 02 completion, source-support facts, and current optional-data render paths before edits (`.spec_system/specs/phase00-session03-unavailable-data-ux/implementation-notes.md`)
- [x] T002 [S0003] [P] Create implementation notes scaffold with UI-state decisions, command results, manual checks, and follow-up sections (`.spec_system/specs/phase00-session03-unavailable-data-ux/implementation-notes.md`)
- [x] T003 [S0003] [P] Create security compliance notes scaffold covering escaped HTML rendering, local settings, and unchanged proxy behavior (`.spec_system/specs/phase00-session03-unavailable-data-ux/security-compliance.md`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0003] Define source-aware unavailable-data descriptors for title, quests, saves, damage bonus, minimap, and optional panels (`src/App.tsx`)
- [x] T005 [S0003] Add reusable compact unavailable-state rendering helpers with platform-appropriate accessibility labels, focus behavior, and input support (`src/App.tsx`)
- [x] T006 [S0003] Add zero-safe presence helpers that distinguish unavailable, loading, empty, offline, error, and present values (`src/App.tsx`)
- [x] T007 [S0003] Extend quest, map, and optional panel helpers to re-evaluate state on connection status or override mapping changes (`src/App.tsx`)
- [x] T008 [S0003] Add compact unavailable-state, override-support, and mobile wrapping styles without resizing terminal or command surfaces (`src/App.css`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T009 [S0003] Update MSDP settings labels and descriptions for override-only fields with explicit future-server support wording (`src/App.tsx`)
- [x] T010 [S0003] Update character identity and title rendering so missing `TITLE` is deliberate while reported names and titles still display (`src/App.tsx`)
- [x] T011 [S0003] Update saving throw cells for Fortitude, Reflex, and Willpower to show unavailable/future-server states while preserving numeric `0` values (`src/App.tsx`)
- [x] T012 [S0003] Add damage bonus display handling that stays quiet when unrequested and shows data only when an override or report provides it (`src/App.tsx`)
- [x] T013 [S0003] Update quest tab empty state to explain unsupported structured quest data, while preserving structured override rendering and empty collection states (`src/App.tsx`)
- [x] T014 [S0003] Refine map/minimap output copy so live minimap, room fallback, loading, offline, error, and no-room states are distinct (`src/App.tsx`)
- [x] T015 [S0003] Update group and affects empty states to remain quiet, explicit, and visually consistent with the new optional-data notices (`src/App.tsx`)
- [x] T016 [S0003] Verify reconnect and disconnect paths reset or revalidate optional-data notices so stale panel copy is not presented as live data (`src/App.tsx`)
- [x] T017 [S0003] Tune desktop and 390px mobile styling for new notices, saving throw cells, quest state, and map panel without horizontal page scrolling (`src/App.css`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T018 [S0003] Run `npm run lint` and record pass/fail output with affected files (`.spec_system/specs/phase00-session03-unavailable-data-ux/implementation-notes.md`)
- [x] T019 [S0003] Run `npm run build` and record pass/fail output with affected files (`.spec_system/specs/phase00-session03-unavailable-data-ux/implementation-notes.md`)
- [x] T020 [S0003] Manually inspect desktop and 390px mobile unavailable states for character, quests, group, affects, and map panels (`.spec_system/specs/phase00-session03-unavailable-data-ux/implementation-notes.md`)
- [x] T021 [S0003] Validate ASCII, LF line endings, and scoped git diff for session artifacts and planned code paths (`.spec_system/specs/phase00-session03-unavailable-data-ux/tasks.md`)

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
