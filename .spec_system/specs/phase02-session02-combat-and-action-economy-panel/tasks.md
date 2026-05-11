# Task Checklist

**Session ID**: `phase02-session02-combat-and-action-economy-panel`
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
| Foundation | 6 | 6 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **22** | **22** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0202] Verify Phase 02 Session 02 prerequisites, Session 01 display-helper outputs, combat fixtures, and confirmed source MSDP fields, then record evidence (`.spec_system/specs/phase02-session02-combat-and-action-economy-panel/implementation-notes.md`)
- [x] T002 [S0202] Audit existing HUD, sidebar tabs, combat field references, and action fixture paths before editing (`.spec_system/specs/phase02-session02-combat-and-action-economy-panel/implementation-notes.md`)
- [x] T003 [S0202] [P] Record security, privacy, persistence, protocol, and accessibility constraints for combat display work (`.spec_system/specs/phase02-session02-combat-and-action-economy-panel/security-compliance.md`)

---

## Foundation (6 tasks)

Core structures and base implementations.

- [x] T004 [S0202] [P] Extend combat/action fixture review and add missing opponent, tank, partial, empty, or `ACTIONS` examples if coverage gaps remain (`tests/fixtures/msdp/combat-and-resources.json`)
- [x] T005 [S0202] [P] Update `ACTIONS` collection fixtures and manifest metadata when fixture coverage changes (`tests/fixtures/msdp/collections.json`)
- [x] T006 [S0202] Add combat display helper types and availability models for opponent, tank, actions, inactive, offline, and error states with types matching declared contract; exhaustive enum handling (`shared/msdp-display.ts`)
- [x] T007 [S0202] Build opponent and tank combat status models with zero-value preservation, partial-health handling, and percentage clamping (`shared/msdp-display.ts`)
- [x] T008 [S0202] Build `ACTIONS` action economy models for array, empty array, mixed string/table, object, and raw fallback payloads with explicit loading, empty, error, and offline states (`shared/msdp-display.ts`)
- [x] T009 [S0202] Add focused display helper tests for combat status, action economy, inactive state, and override-only damage behavior (`tests/msdp-display.test.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T010 [S0202] Wire combat display models into the app without changing socket, renderer, reconnect, alias, trigger, or command-input paths (`src/App.tsx`)
- [x] T011 [S0202] Add visually distinct opponent and tank combat status rendering with accessible labels and quiet inactive state (`src/App.tsx`)
- [x] T012 [S0202] Add a combat inspector tab or section for opponent, tank, action economy, and damage-bonus availability with platform-appropriate accessibility labels, focus management, and input support (`src/App.tsx`)
- [x] T013 [S0202] Render `ACTIONS` entries from confirmed action model shapes with conservative labels and raw fallback text, avoiding automation semantics (`src/App.tsx`)
- [x] T014 [S0202] Preserve explicit unavailable/waiting/offline/error rendering for `DAMAGE_BONUS` without presenting it as reliable default combat data (`src/App.tsx`)
- [x] T015 [S0202] Add compact combat panel, combat bar, action entry, and quiet empty-state styles for desktop and 390px mobile layouts (`src/App.css`)
- [x] T016 [S0202] Add 360px smoke-width CSS safeguards for combat text overflow, tab wrapping, command input, and no horizontal scrolling (`src/App.css`)
- [x] T017 [S0202] Extend state mapping expectations for opponent, tank, `ACTIONS`, empty collections, mixed action payloads, and default-ignored `DAMAGE_BONUS` (`tests/msdp-state-mapping.test.ts`)
- [x] T018 [S0202] [P] Document combat display tests, fixture coverage, and manual responsive check expectations (`tests/README.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T019 [S0202] Run `npm test` and record the result with focused combat display and mapping evidence (`.spec_system/specs/phase02-session02-combat-and-action-economy-panel/implementation-notes.md`)
- [x] T020 [S0202] Run `npm run lint` and `npm run build`, then record the results and any residual failures (`.spec_system/specs/phase02-session02-combat-and-action-economy-panel/implementation-notes.md`)
- [x] T021 [S0202] Manually verify desktop, 390px mobile, and 360px smoke layouts for combat inactive, opponent-only, tank-only, opponent+tank, actions, command input, and horizontal scroll behavior (`.spec_system/specs/phase02-session02-combat-and-action-economy-panel/implementation-notes.md`)
- [x] T022 [S0202] Validate ASCII encoding, Unix LF line endings, accessibility notes, security notes, no new persistence, and completion checklist readiness (`.spec_system/specs/phase02-session02-combat-and-action-economy-panel/security-compliance.md`)

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
