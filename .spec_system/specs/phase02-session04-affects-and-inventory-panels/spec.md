# Session Specification

**Session ID**: `phase02-session04-affects-and-inventory-panels`
**Phase**: 02 - Build Luminari Game Panels
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session turns confirmed `AFFECTS` and `INVENTORY` MSDP collection data into player-facing inspector panels. The current app already preserves both values in `MudState`, has parser coverage for arrays and tables, and renders `AFFECTS` through a generic raw value panel. It does not yet provide a dedicated inventory tab or display models that make temporary effects and carried items readable without overclaiming a final server schema.

The work should follow the pure-helper pattern established by the core, combat, and group sessions. Structured collection payloads should be normalized outside JSX, then rendered in compact sidebar panels with explicit unavailable, waiting, empty, offline, error, raw, and unknown-field states. Affects should show names, durations, modifiers, and fallback fields when available. Inventory should show useful groupings, item names, counts, locations, and controlled raw fallback output when payload shapes are uncertain.

The session remains client-side and fixture-backed. It should not add inventory automation, drag-and-drop equipment management, source-level variable changes, room behavior, map behavior, or quest parsing. Synthetic fixtures are acceptable as parser and display contracts, but implementation notes must identify them as representative shapes rather than proof of the final live server schema.

---

## 2. Objectives

1. Normalize representative `AFFECTS` payloads into typed, testable display models.
2. Normalize representative `INVENTORY` payloads into typed, testable display models.
3. Render dedicated affects and inventory panels with stable partial-data and raw-fallback behavior.
4. Add fixture-backed tests and responsive checks for desktop, 390px mobile, and 360px smoke widths.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session04-msdp-fixture-corpus` - Provides synthetic MSDP fixture files, including collection payload examples.
- [x] `phase00-session05-state-mapping-tests` - Provides mapping coverage for structured collection values.
- [x] `phase01-session02-msdp-tables-arrays-malformed-payloads` - Provides parser coverage for table, array, mixed, and malformed MSDP payloads.
- [x] `phase01-session03-connection-lifecycle-reconnect-cleanup` - Provides reconnect cleanup behavior that panel state must not regress.
- [x] `phase01-session04-dynamic-naws-resize` - Provides resize behavior that must survive sidebar changes.
- [x] `phase02-session01-core-hud-and-character-panel` - Provides pure display-helper and responsive panel conventions.
- [x] `phase02-session02-combat-and-action-economy-panel` - Provides collection fallback rendering patterns for `ACTIONS`.
- [x] `phase02-session03-group-panel` - Provides collection row, unknown-field, and accessibility patterns for sidebar panels.

### Required Tools/Knowledge
- React 19, TypeScript 6, Vite, and CSS responsive layout.
- Existing `MudState`, `MudValue`, `MsdpVariableMap`, and `mapMsdpUpdate` helpers.
- Existing display helpers in `shared/msdp-display.ts`, `shared/msdp-combat-display.ts`, and `shared/msdp-group-display.ts`.
- Existing fixtures in `tests/fixtures/msdp/collections.json`, `nested-tables.json`, and manifest metadata.
- Existing Node `node --import tsx --test` test runner.

### Environment Requirements
- `npm install` has already been run.
- `npm test`, `npm run lint`, and `npm run build` are available.
- No live MUD access is required for automated tests.
- Manual UI checks should include desktop, 390px primary mobile, and 360px smoke widths.

---

## 4. Scope

### In Scope (MVP)
- Player can read normalized affects from confirmed `AFFECTS` data - support arrays of effect records, object-like payloads, strings, and conservative raw fallbacks.
- Player can see affect names, durations, modifiers, and relevant unknown-field summaries - preserve zero and blank-like values without breaking rows.
- Player can read normalized inventory from confirmed `INVENTORY` data - support arrays, tables, grouped item records, counted item tables, and conservative raw fallbacks.
- Player can distinguish empty inventory, no active affects, disabled mappings, waiting for first payload, offline state, and connection error state.
- Maintainer can validate affects and inventory display without live MUD access - add display-helper tests and fixture/state-mapping coverage for full, partial, empty, object-like, and unknown-field variants.
- Mobile player can use affects and inventory panels at 390px and smoke-check 360px without horizontal page scrolling or terminal-obscuring chrome.

### Out of Scope (Deferred)
- Inventory command automation, equip, remove, drop, get, or use actions - *Reason: This session displays collection state only.*
- Drag-and-drop equipment or item management - *Reason: No stable item command contract exists yet.*
- Source-level `AFFECTS` or `INVENTORY` schema changes - *Reason: Phase 04 owns source-level protocol changes after client behavior is stable.*
- Room, map, minimap, and quest panel behavior - *Reason: Later Phase 02 sessions own those surfaces.*
- Free-form command-output parsing for affects or inventory - *Reason: MVP panel work must remain structured MSDP-driven and fixture-testable.*
- Browser settings persistence migration from cookies - *Reason: Open security finding P00-SEC-002 is separate from this panel session.*

---

## 5. Technical Approach

### Architecture

Add a pure display helper, preferably `shared/msdp-affects-inventory-display.ts`, that consumes the relevant `MudState` collection values, `ConnectionStatus`, and active `MsdpVariableMap`, then returns typed display models for affects and inventory. The helper should own availability states, normalized rows, labels, counts, duration text, modifier summaries, group labels, raw fallback text, unknown-field summaries, and accessible aria labels. `shared/msdp-state.ts` should continue to preserve raw `AFFECTS` and `INVENTORY` `MudValue` data without lossy coercion.

`src/App.tsx` should use the new display models for the affects tab and add a dedicated inventory tab. The React change should stay narrow: keep socket, terminal renderer, reconnect, command input, alias, trigger, core HUD, combat, group, room fallback, and settings behavior intact. CSS should add compact sidebar collection rows that fit the existing dark instrument style, wrap long item or affect names, and preserve terminal priority.

Testing should remain live-MUD-free. Extend collection fixtures when necessary, add pure helper tests for affects and inventory, extend state-mapping expectations, and document manual responsive checks in implementation notes. If fixture shapes are synthetic, notes must state that they are representative parser/display contracts, not proof of final server schema.

### Design Patterns
- Pure display models: Normalize collection data outside JSX and keep behavior testable.
- Source-aligned availability: Treat disabled mappings, waiting data, empty collections, offline state, and error state distinctly.
- Conservative collection rendering: Render arrays and object-like payloads without inventing unsupported affect or item semantics.
- Bounded summaries: Keep unknown fields and raw structured data short, deterministic, and useful for debugging.
- Stable layout constraints: Keep names, durations, counts, locations, and fallback text inside sidebar dimensions.
- Accessibility by text: Provide visible labels, counts, duration text, and aria labels rather than relying on color alone.
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
| `shared/msdp-affects-inventory-display.ts` | Pure affects and inventory display models for availability, rows, durations, modifiers, groups, counts, unknown fields, and raw fallback text | ~360 |
| `tests/msdp-affects-inventory-display.test.ts` | Focused tests for affects and inventory normalization, availability states, partial data, unknown fields, and raw fallbacks | ~260 |
| `.spec_system/specs/phase02-session04-affects-and-inventory-panels/implementation-notes.md` | Implementation evidence, command output summaries, responsive checks, fixture notes, and residual risks | ~120 |
| `.spec_system/specs/phase02-session04-affects-and-inventory-panels/security-compliance.md` | Session security, privacy, protocol, accessibility, and persistence notes | ~90 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `src/App.tsx` | Add inventory sidebar tab, render affects and inventory from typed display models, and replace generic affects raw rendering | ~220 |
| `src/App.css` | Add compact affects and inventory collection styles, raw fallback styles, responsive wrapping, and 390px/360px safeguards | ~180 |
| `tests/msdp-state-mapping.test.ts` | Extend affects and inventory mapping expectations for full, partial, empty, object-like, and disabled mapping behavior | ~90 |
| `tests/fixtures/msdp/collections.json` | Add or refine affects and inventory full, empty, unknown-field, object-like, counted, and raw fallback variants | ~180 |
| `tests/fixtures/msdp/manifest.json` | Update fixture counts and coverage summary when collection fixtures change | ~40 |
| `tests/fixtures/msdp/README.md` | Document representative affects and inventory fixture shapes and schema caution | ~60 |
| `tests/README.md` | Document affects and inventory display tests and manual responsive check expectations | ~40 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] `AFFECTS` payloads render stable rows from representative array, table, object-like, string, and empty fixtures.
- [ ] Affect names, durations, modifiers, and unknown-field summaries render when present.
- [ ] `INVENTORY` payloads render stable item or group rows from representative array, table, counted, object-like, raw, and empty fixtures.
- [ ] Item names, group labels, counts, locations, and unknown-field summaries render when present.
- [ ] Empty affects, empty inventory, disabled mappings, connected waiting states, offline states, and error states remain distinct.
- [ ] Unknown collection fields are ignored or surfaced through controlled debug-friendly fallback text.
- [ ] Affects and inventory state does not mutate or reset character, combat, group, room, terminal, command input, reconnect, alias, trigger, or settings state.
- [ ] Desktop and 390px mobile collection layouts are readable, and 360px smoke width has no horizontal page scroll.

### Testing Requirements
- [ ] Unit tests cover affects display helper behavior for full effects, partial effects, zero duration, missing duration, modifiers, unknown fields, raw values, empty payloads, disabled mapping, offline state, and error state.
- [ ] Unit tests cover inventory display helper behavior for item arrays, grouped tables, counted tables, object-like entries, raw values, empty payloads, disabled mapping, offline state, and error state.
- [ ] State mapping tests preserve `AFFECTS` and `INVENTORY` structured payloads without lossy coercion and ignore disabled mappings.
- [ ] Relevant collection fixture coverage exists for representative payload variants.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Manual responsive checks are documented for desktop, 390px, and 360px widths.

### Non-Functional Requirements
- [ ] Terminal-first layout remains primary; affects and inventory UI does not obscure command entry or terminal output.
- [ ] Color-coded or status-coded collection states include visible text labels and accessible names.
- [ ] Collection display logic adds no live-MUD dependency to automated tests.
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
- Keep raw protocol preservation separate from display normalization. `shared/msdp-state.ts` should store `AFFECTS` and `INVENTORY`; the new helper should format them.
- Do not make broad UI refactors in `src/App.tsx`; change only the affects and inventory inspector surfaces and closely related availability rendering.
- Add the inventory sidebar tab without disrupting the existing character, combat, quests, group, and affects tab behavior.
- Treat synthetic fixtures as representative contracts for parser/display behavior, not as final proof of server collection schemas.
- Preserve terminal and command input focus behavior while updating sidebar tabs.
- Do not add persisted collection preferences while browser settings still use cookies.

### Potential Challenges
- `AFFECTS` and `INVENTORY` payloads may be arrays, top-level records, mixed records, empty collections, counted tables, grouped tables, strings, or raw fallback values: mitigate with conservative display models and tests.
- Field names may vary across live servers: support known representative aliases without claiming schema certainty.
- Long affect names, modifier summaries, item names, or group labels can overflow narrow sidebars: use stable grid sizing, wrapping, truncation where appropriate, and accessible full text.
- Generic raw output can overwhelm players: keep raw summaries bounded, deterministic, and secondary to named fields.
- Existing tests do not mount React components: prefer pure helper tests and manual UI evidence instead of adding a new UI test stack.

### Relevant Considerations
- [P01] **`src/App.tsx` concentration**: Limit changes to affects and inventory display and avoid broad renderer or command-shell rewrites.
- [P01] **Fixture-backed tests worked**: Extend deterministic collection coverage instead of depending on live MUD traffic.
- [P01] **Parser helper boundaries**: Keep parser/state/helper boundaries intact and avoid recombining protocol behavior in `src/App.tsx`.
- [P01] **Renderer fallback remains in service**: Keep escaped HTML rendering paths intact while changing panel UI.
- [P01] **Cookie-based client state**: Do not expand persisted settings or store sensitive collection preferences.
- [P00-SEC-002] **Browser settings are stored in cookies**: This session must not add new persisted secrets or larger sensitive payloads.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Affects or inventory rows could drop useful data when optional fields are missing.
- Empty payloads could be confused with waiting, disabled, offline, or error states.
- Raw fallback text could become too large for the sidebar or mobile viewport.
- Synthetic fixture shapes could be overinterpreted as a final server schema.
- Adding an inventory tab could break tab focus, command input focus return, or narrow-width wrapping.

---

## 9. Testing Strategy

### Unit Tests
- Test full affect models with name, duration, modifier fields, status-like fields, and unknown fields.
- Test partial affect models with missing name, missing duration, zero duration, raw string entries, empty arrays, empty tables, disabled mapping, connected waiting, offline, and error states.
- Test inventory models for arrays of item names, grouped records, counted item tables, item records, unknown fields, raw string entries, empty arrays, empty tables, disabled mapping, connected waiting, offline, and error states.
- Test field-name aliases for representative lowercase, uppercase, snake_case, and camelCase variants.
- Test state mapping for structured `AFFECTS` and `INVENTORY` payload preservation and disabled mapping behavior.

### Integration Tests
- Run the existing `npm test` suite to verify parser, fixture, mapping, lifecycle, policy, renderer, xterm spike, core display, combat display, group display, and collection display regressions.
- Run `npm run lint` and `npm run build` to catch TypeScript, React hook, CSS, and production build issues.

### Manual Testing
- Verify desktop layout with waiting, empty, full, partial, unknown-field, and raw fallback affects.
- Verify desktop layout with waiting, empty, grouped, counted, flat-list, partial, unknown-field, and raw fallback inventory.
- Verify 390px mobile width for readable rows, wrapped names, tab controls, command input, and no horizontal page scroll.
- Smoke-check 360px width for terminal priority, collection text wrapping, and no viewport overflow.
- Confirm command input focus returns normally after selecting affects and inventory tabs and interacting with nearby sidebar controls.

### Edge Cases
- `AFFECTS` or `INVENTORY` is missing while connected.
- `AFFECTS` or `INVENTORY` is disabled in MSDP variable settings.
- Collection value is an empty array, empty table, null, blank string, scalar, array, table, or nested table.
- Affect name or item name is blank, missing, very long, numeric, or duplicated.
- Affect duration equals `0`, is missing, is negative, or is non-numeric.
- Inventory count equals `0`, is missing, is negative, or is non-numeric.
- Collection records include unrecognized fields.
- Connection status is idle, connecting, connected, disconnected, or error.

---

## 10. Dependencies

### External Libraries
- None planned. Use existing React, TypeScript, CSS, and Node test tooling.

### Other Sessions
- **Depends on**: `phase02-session01-core-hud-and-character-panel`, `phase02-session02-combat-and-action-economy-panel`, `phase02-session03-group-panel`, Phase 00 fixture and mapping foundations, Phase 01 parser/reconnect/resize foundations.
- **Depended by**: `phase02-session05-room-context-panel`, `phase02-session06-map-and-quest-fallback-strategy`

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
