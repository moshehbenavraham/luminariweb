# Task Checklist

**Session ID**: `phase02-session01-core-hud-and-character-panel`
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
| Foundation | 6 | 6 | 0 |
| Implementation | 8 | 8 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **21** | **21** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0201] Verify Phase 02 Session 01 prerequisites, current fixture coverage, and source-confirmed core MSDP fields, then record evidence (`.spec_system/specs/phase02-session01-core-hud-and-character-panel/implementation-notes.md`)
- [x] T002 [S0201] Audit existing HUD, character panel, availability, and mobile CSS paths before editing (`.spec_system/specs/phase02-session01-core-hud-and-character-panel/implementation-notes.md`)
- [x] T003 [S0201] [P] Record security, privacy, persistence, and accessibility constraints for core display work (`.spec_system/specs/phase02-session01-core-hud-and-character-panel/security-compliance.md`)

---

## Foundation (6 tasks)

Core structures and base implementations.

- [x] T004 [S0201] [P] Create core MSDP display helper types and number normalization utilities with zero, negative, missing, and invalid value handling (`shared/msdp-display.ts`)
- [x] T005 [S0201] [P] Add display helper tests for number formatting, signed values, percent clamping, and missing max behavior (`tests/msdp-display.test.ts`)
- [x] T006 [S0201] Extend core scalar fixture coverage for resource, economy, position, armor, and attack values (`tests/fixtures/msdp/core-scalars.json`)
- [x] T007 [S0201] Build HUD bar display models for HP, PSP, movement, and XP/TNL with explicit loading, empty, error, and offline states (`shared/msdp-display.ts`)
- [x] T008 [S0201] Build character identity and stat display models for source-confirmed fields plus unavailable title, saves, and damage bonus states (`shared/msdp-display.ts`)
- [x] T009 [S0201] Add focused state mapping expectations for confirmed core values and override-only values (`tests/msdp-state-mapping.test.ts`)

---

## Implementation (8 tasks)

Main feature implementation.

- [x] T010 [S0201] Wire HUD bars in the app to the display helper models with accessible labels and deterministic text output (`src/App.tsx`)
- [x] T011 [S0201] Wire character identity, level, race, class, position, alignment, money, attack bonus, and armor class rendering to display helper models (`src/App.tsx`)
- [x] T012 [S0201] Preserve explicit unavailable/waiting/offline/error rendering for title, saves, and damage bonus without implying client failure (`src/App.tsx`)
- [x] T013 [S0201] Tighten HUD bar, stat grid, ability grid, and availability styles for compact desktop and 390px mobile layouts (`src/App.css`)
- [x] T014 [S0201] Add 360px smoke-width CSS safeguards for HUD and character text overflow, touch targets, and no horizontal scrolling (`src/App.css`)
- [x] T015 [S0201] Preserve terminal renderer, sidebar tab, reconnect, and command input focus behavior while changing the core panel path (`src/App.tsx`)
- [x] T016 [S0201] [P] Document the focused display test command and responsive manual check expectations (`tests/README.md`)
- [x] T017 [S0201] Record implementation choices, manual layout evidence, and any residual risks (`.spec_system/specs/phase02-session01-core-hud-and-character-panel/implementation-notes.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T018 [S0201] Run `npm test` and record the result with any focused display test evidence (`.spec_system/specs/phase02-session01-core-hud-and-character-panel/implementation-notes.md`)
- [x] T019 [S0201] Run `npm run lint` and `npm run build`, then record the results and any residual failures (`.spec_system/specs/phase02-session01-core-hud-and-character-panel/implementation-notes.md`)
- [x] T020 [S0201] Manually verify desktop, 390px mobile, and 360px smoke layouts for HUD, character panel, command input, and horizontal scroll behavior (`.spec_system/specs/phase02-session01-core-hud-and-character-panel/implementation-notes.md`)
- [x] T021 [S0201] Validate ASCII encoding, Unix LF line endings, accessibility notes, security notes, and completion checklist readiness (`.spec_system/specs/phase02-session01-core-hud-and-character-panel/security-compliance.md`)

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

Run the implement workflow step to begin AI-led implementation.
