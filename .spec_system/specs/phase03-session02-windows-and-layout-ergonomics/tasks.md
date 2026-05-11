# Task Checklist

**Session ID**: `phase03-session02-windows-and-layout-ergonomics`
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

- [x] T001 [S0302] Verify Phase 02 panels, Session 01 mapper output, current command focus behavior, and reference layout notes (`src/App.tsx`)
- [x] T002 [S0302] [P] Create implementation notes with behavior-only `mud-web-client` layout findings and GPL boundaries (`.spec_system/specs/phase03-session02-windows-and-layout-ergonomics/implementation-notes.md`)
- [x] T003 [S0302] [P] Create security and compliance notes for secret-free `localStorage` layout preferences and no copied reference code (`.spec_system/specs/phase03-session02-windows-and-layout-ergonomics/security-compliance.md`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0302] [P] Create typed layout preference defaults, parser, serializer, and validation helpers with schema-validated input and corrupt-payload fallback (`shared/client-layout-preferences.ts`)
- [x] T005 [S0302] [P] Add layout preference tests for defaults, valid payloads, invalid tabs, invalid density, missing fields, and future versions (`tests/client-layout-preferences.test.ts`)
- [x] T006 [S0302] Define inspector tab metadata for map, room, character, combat, group, inventory, affects, and quests with stable ids and exhaustive enum handling (`src/App.tsx`)
- [x] T007 [S0302] Add `localStorage`-backed layout state for active tab, collapsed state, and density with denied or unavailable storage fallback behavior (`src/App.tsx`)
- [x] T008 [S0302] Add inspector tab keyboard navigation for arrow, Home, and End keys with focus management and command-input recovery (`src/App.tsx`)

---

## Implementation (8 tasks)

Main feature implementation.

- [x] T009 [S0302] Refactor the sidebar into one inspector panel containing map and panel tabs with state reset or revalidation on re-entry (`src/App.tsx`)
- [x] T010 [S0302] Add inspector collapse, expand, and density controls with platform-appropriate accessibility labels, focus management, and input support (`src/App.tsx`)
- [x] T011 [S0302] Preserve command form visibility and command-input focus after tab switches, inspector controls, settings close, and terminal clicks (`src/App.tsx`)
- [x] T012 [S0302] Preserve map, room, character, combat, group, inventory, affects, and quest availability states with explicit loading, empty, error, offline, and disabled states (`src/App.tsx`)
- [x] T013 [S0302] Add layout state classes and attributes for expanded, collapsed, and compact inspector modes without obscuring command input (`src/App.tsx`)
- [x] T014 [S0302] Add stable desktop and tablet grid styling for terminal, HUD, command dock, and inspector with fixed-format dimensions that cannot shift layout (`src/App.css`)
- [x] T015 [S0302] Add collapsed inspector and 390px/360px responsive styling with no horizontal page scrolling and command dock reachable (`src/App.css`)
- [x] T016 [S0302] Add focus-visible, reduced-motion, internal-scrolling, and long-text wrapping styles for inspector tabs, controls, and panels (`src/App.css`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0302] [P] Update test documentation with layout preference commands and desktop, 390px, and 360px responsive smoke scenarios (`tests/README.md`)
- [x] T018 [S0302] Run targeted layout preference tests, mapper tests, panel tests, and the full Node test suite (`tests/client-layout-preferences.test.ts`)
- [x] T019 [S0302] Run lint and production build, then fix or document any failures (`package.json`)
- [x] T020 [S0302] Record desktop, 390px, and 360px manual validation results, reference boundaries, and residual risks (`.spec_system/specs/phase03-session02-windows-and-layout-ergonomics/implementation-notes.md`)

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
