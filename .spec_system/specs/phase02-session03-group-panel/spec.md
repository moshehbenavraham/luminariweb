# Session Specification

**Session ID**: `phase02-session03-group-panel`
**Phase**: 02 - Build Luminari Game Panels
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session turns confirmed `GROUP` MSDP data into a useful party panel. Earlier work already aligned the default MSDP map to Luminari-Source, added table and array parser coverage, created synthetic `GROUP` fixtures, and established pure display-helper patterns for core character and combat surfaces. This session applies those patterns to grouped party state instead of leaving group rendering as local JSX parsing inside `src/App.tsx`.

The player should be able to identify party members, see a leader marker, read health and movement values when present, and understand relevant status values without confusing group data with the solo character HUD or the combat opponent/tank panel. Partial payloads should remain stable: missing names, movement maximums, health maximums, leader flags, or status fields must not collapse row layout or erase other member information.

The work stays client-side and fixture-backed. It should normalize representative `GROUP` payload shapes into plain display models, render compact scan-friendly rows, and document unknown fields for later source validation without claiming a final server schema beyond the confirmed `GROUP` variable.

---

## 2. Objectives

1. Normalize representative `GROUP` payload shapes into typed group display models.
2. Render member names, leader markers, health, movement, and status values with stable partial-data behavior.
3. Keep group display state separate from character, combat, affects, inventory, room, terminal, and reconnect state.
4. Add fixture-backed tests and responsive checks for desktop, 390px mobile, and 360px smoke widths.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session04-msdp-fixture-corpus` - Provides synthetic MSDP fixture files, including `group-data.json`.
- [x] `phase00-session05-state-mapping-tests` - Provides state mapping tests for structured collection payloads.
- [x] `phase01-session02-msdp-tables-arrays-malformed-payloads` - Provides parser coverage for table, array, mixed, and malformed MSDP payloads.
- [x] `phase01-session03-connection-lifecycle-reconnect-cleanup` - Provides reconnect cleanup behavior that group state must not regress.
- [x] `phase01-session04-dynamic-naws-resize` - Provides resize behavior that must survive sidebar layout changes.
- [x] `phase02-session01-core-hud-and-character-panel` - Provides pure display-helper and responsive panel conventions.
- [x] `phase02-session02-combat-and-action-economy-panel` - Provides combat separation patterns and collection fallback rendering.

### Required Tools/Knowledge
- React 19, TypeScript 6, Vite, and CSS responsive layout.
- Existing `MudState`, `MudValue`, `MsdpVariableMap`, and `mapMsdpUpdate` helpers.
- Existing display helpers in `shared/msdp-display.ts` and combat display patterns in `shared/msdp-combat-display.ts`.
- Existing fixtures in `tests/fixtures/msdp/group-data.json` and manifest metadata.
- Existing Node `node --import tsx --test` test runner.

### Environment Requirements
- `npm install` has already been run.
- `npm test`, `npm run lint`, and `npm run build` are available.
- No live MUD access is required for automated tests.
- Manual UI checks should include desktop, 390px primary mobile, and 360px smoke widths.

---

## 4. Scope

### In Scope (MVP)
- Player can read normalized group member rows from confirmed `GROUP` data - support representative arrays of member tables and conservative fallbacks for object-like or raw entries.
- Player can see member names and leader markers when present - keep unknown or blank names explicit without crashing or dropping otherwise useful member data.
- Player can see health and movement values when present - preserve zero values, handle missing max values, clamp percentages, and avoid invalid resource bars.
- Player can see relevant status values and controlled unknown-field summaries - expose useful debug-friendly detail without overwhelming the party panel.
- Maintainer can validate group display without live MUD access - add display-helper tests and fixture/state-mapping coverage for full, partial, empty, and unknown-field group variants.
- Mobile player can use the group panel at 390px and smoke-check 360px without horizontal page scrolling or terminal-obscuring chrome.

### Out of Scope (Deferred)
- Party chat, invite, follow, assist, or leadership commands - *Reason: This session displays group state only.*
- Group combat automation or auto-fired rescue/assist behavior - *Reason: Command automation remains user-controlled aliases/triggers and is outside this display session.*
- Source-level `GROUP` payload schema changes - *Reason: Phase 04 owns source-level protocol changes after client behavior is stable.*
- Affects, inventory, room, map, minimap, or quest panel implementation - *Reason: Later Phase 02 sessions own those surfaces.*
- Free-form command-output parsing for group data - *Reason: MVP panel work must remain structured MSDP-driven and fixture-testable.*
- Browser settings persistence migration from cookies - *Reason: Open security finding P00-SEC-002 remains important but is separate from this panel session.*

---

## 5. Technical Approach

### Architecture

Add a pure group display helper, preferably `shared/msdp-group-display.ts`, that consumes `MudState`, `ConnectionStatus`, and the active `MsdpVariableMap`, then returns a typed `GroupDisplayModel`. The model should own group availability, member rows, resource text, percentages, leader and status labels, and controlled fallback text for unknown member fields. `shared/msdp-state.ts` should continue to preserve the raw `GROUP` `MudValue`; the new helper should decide how that value is presented.

`src/App.tsx` should render the group model and remove or bypass the local `parseGroupMembers` JSX parsing path. The React change should be narrow: keep socket, terminal renderer, reconnect, sidebar tab, command input, alias, trigger, and combat display paths intact. CSS should add compact group rows that fit the existing sidebar design, with stable columns and wrapping behavior for long names or status values.

Testing should remain live-MUD-free. Use Node tests for the display helper and state mapping behavior, extend the synthetic group fixture corpus when it reveals missing variants, and document manual responsive checks in implementation notes. If fixture shapes are synthetic, notes must state that they are representative parser/display contracts, not proof of final server schema.

### Design Patterns
- Pure display models: Normalize group data outside JSX and keep behavior easy to test.
- Source-aligned availability: Treat disabled mappings, waiting data, empty collections, offline state, and error state distinctly.
- Conservative collection rendering: Render arrays and object-like payloads without inventing unsupported party semantics.
- Stable layout constraints: Keep names, resource labels, and status values inside fixed panel dimensions at desktop and mobile widths.
- Accessibility by text: Provide readable labels, numeric values, and leader/status text rather than relying on color alone.
- Fixture-backed verification: Extend deterministic tests before relying on live server behavior.

### Technology Stack
- TypeScript 6
- React 19
- Vite 8
- CSS responsive layout
- Node built-in `node:test` with `tsx`

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `shared/msdp-group-display.ts` | Pure group display models for availability, members, leader markers, health, movement, status, and unknown-field fallback text | ~260 |
| `tests/msdp-group-display.test.ts` | Focused tests for group normalization, full members, partial members, empty payloads, disabled mappings, and unknown fields | ~220 |
| `.spec_system/specs/phase02-session03-group-panel/implementation-notes.md` | Implementation evidence, command output summaries, responsive checks, fixture notes, and residual risks | ~120 |
| `.spec_system/specs/phase02-session03-group-panel/security-compliance.md` | Session security, privacy, protocol, accessibility, and persistence notes | ~90 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `src/App.tsx` | Render the group inspector tab from group display models and remove local group parsing duplication while preserving terminal and sidebar behavior | ~180 |
| `src/App.css` | Add compact group member rows, resource/status styling, leader marker styling, and 390px/360px responsive safeguards | ~160 |
| `tests/msdp-state-mapping.test.ts` | Extend group mapping expectations for full, partial, empty, object-like, and disabled mapping behavior | ~80 |
| `tests/fixtures/msdp/group-data.json` | Add or refine empty, unknown-field, movement-max, status, and object-like group variants if fixture coverage gaps remain | ~120 |
| `tests/fixtures/msdp/manifest.json` | Update fixture counts and coverage summary when group fixtures change | ~40 |
| `tests/fixtures/msdp/README.md` | Document representative group fixture shapes and schema caution if new group variants are added | ~40 |
| `tests/README.md` | Document group display tests and manual responsive check expectations | ~40 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] `GROUP` payloads render stable group member rows from representative array/table fixtures.
- [ ] Member names, leader markers, health, movement, and status values render when present.
- [ ] Missing names, leader flags, health max values, movement values, and status fields do not break row layout.
- [ ] Empty group payloads, disabled group mappings, connected waiting states, offline states, and error states remain distinct.
- [ ] Unknown group member fields are ignored or surfaced through controlled debug-friendly fallback text.
- [ ] Group state does not mutate or reset character, combat, affects, inventory, room, terminal, command input, or reconnect state.
- [ ] Desktop and 390px mobile group layouts are readable, and 360px smoke width has no horizontal page scroll.

### Testing Requirements
- [ ] Unit tests cover group display helper behavior for full members, partial members, zero values, missing max values, leader flags, status values, unknown fields, empty payloads, disabled mapping, offline state, and error state.
- [ ] State mapping tests preserve `GROUP` structured payloads without lossy coercion and ignore disabled group mappings.
- [ ] Relevant group fixture coverage exists for representative payload variants.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Manual responsive checks are documented for desktop, 390px, and 360px widths.

### Non-Functional Requirements
- [ ] Terminal-first layout remains primary; group UI does not obscure command entry or terminal output.
- [ ] Color-coded group/resource states include visible text labels and accessible names.
- [ ] Group display logic adds no live-MUD dependency to automated tests.
- [ ] UI changes do not add persisted sensitive data or expand cookie-stored settings.
- [ ] Code follows project conventions and keeps protocol mapping separate from UI presentation.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] No GPL reference code is copied.

---

## 8. Implementation Notes

### Key Considerations
- Keep raw protocol preservation separate from display normalization. `shared/msdp-state.ts` should store `GROUP`; the new group helper should format it.
- Do not make broad UI refactors in `src/App.tsx`; change only the group inspector and closely related availability rendering needed for this session.
- Keep group state separate from single-player character stats and combat opponent/tank state.
- Treat synthetic fixtures as representative contracts for parser/display behavior, not as final proof of server member schema.
- Preserve terminal and command input focus behavior while updating the group tab.
- Do not add persisted group preferences while browser settings still use cookies.

### Potential Challenges
- `GROUP` payloads may be arrays, top-level records, mixed records, empty collections, or raw fallback values: mitigate with conservative display models and tests.
- Member field names may vary (`name`, `member_name`, `CHARACTER_NAME`, `healthMax`, `HEALTH_MAX`, `movement`, `MOVE`): support known representative aliases without claiming schema certainty.
- Partial resource values may arrive without usable max values: preserve current values and avoid invalid percentages.
- Long member names or status values can overflow narrow sidebars: use stable grid sizing, wrapping, truncation where appropriate, and accessible full text.
- Existing tests do not mount React components: prefer pure helper tests and manual UI evidence instead of adding a new UI test stack.

### Relevant Considerations
- [P01] **`src/App.tsx` concentration**: Limit changes to group display and avoid broad renderer or command-shell rewrites.
- [P01] **Fixture-backed tests worked**: Extend deterministic group coverage instead of depending on live MUD traffic.
- [P01] **Parser helper boundaries**: Keep parser/state/helper boundaries intact and avoid recombining protocol behavior in `src/App.tsx`.
- [P01] **Renderer fallback remains in service**: Keep escaped HTML rendering paths intact while changing panel UI.
- [P01] **Cookie-based client state**: Do not expand persisted settings or store sensitive group preferences.
- [P00-SEC-002] **Browser settings are stored in cookies**: This session must not add new persisted secrets or larger sensitive payloads.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Group rows could drop a member when one optional field is missing.
- Partial health or movement values could compute invalid percentages or hide useful current values.
- Synthetic fixture shapes could be overinterpreted as a final server schema.
- Group UI could conflate party members with the player character or combat tank/opponent data.
- Narrow sidebar text could overflow and cause horizontal page scrolling.

---

## 9. Testing Strategy

### Unit Tests
- Test full group member models with name, leader flag, health, health max, movement, movement max, and status values.
- Test partial member models with missing name, missing leader flag, missing max values, zero health, and unknown fields.
- Test empty array, empty table, raw string, null, undefined, disabled mapping, connected waiting, offline, and error availability states.
- Test field-name aliases for representative lowercase, uppercase, and snake/camel variants.
- Test state mapping for structured `GROUP` payload preservation and disabled mapping behavior.

### Integration Tests
- Run the existing `npm test` suite to verify parser, fixture, mapping, lifecycle, policy, renderer, xterm spike, core display, combat display, and group display regressions.
- Run `npm run lint` and `npm run build` to catch TypeScript, React hook, CSS, and production build issues.

### Manual Testing
- Verify desktop layout with waiting group, empty group, full group, partial group, long member names, leader marker, status text, health values, and movement values.
- Verify 390px mobile width for readable group rows, wrapped status values, tab controls, command input, and no horizontal page scroll.
- Smoke-check 360px width for terminal priority, group text wrapping, and no viewport overflow.
- Confirm command input focus returns normally after selecting the group tab and interacting with nearby sidebar controls.

### Edge Cases
- `GROUP` is missing while connected.
- `GROUP` is disabled in MSDP variable settings.
- `GROUP` is an empty array or empty table.
- Member name is blank, missing, very long, or numeric.
- Leader flag is `1`, `0`, `true`, `false`, `yes`, `no`, blank, or missing.
- Health or movement current value equals `0`.
- Health or movement max is missing, zero, or lower than current value.
- Member records include unrecognized fields.
- Connection status is idle, connecting, connected, disconnected, or error.

---

## 10. Dependencies

### External Libraries
- None planned. Use existing React, TypeScript, CSS, and Node test tooling.

### Other Sessions
- **Depends on**: `phase02-session01-core-hud-and-character-panel`, `phase02-session02-combat-and-action-economy-panel`, Phase 00 fixture and mapping foundations, Phase 01 parser/reconnect/resize foundations.
- **Depended by**: `phase02-session04-affects-and-inventory-panels`, `phase02-session05-room-context-panel`

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
