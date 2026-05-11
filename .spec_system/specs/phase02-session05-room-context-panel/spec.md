# Session Specification

**Session ID**: `phase02-session05-room-context-panel`
**Phase**: 02 - Build Luminari Game Panels
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session turns confirmed Luminari room MSDP values into a dedicated room context panel. The current client already requests and maps `ROOM`, `ROOM_NAME`, `AREA_NAME`, `ROOM_EXITS`, `ROOM_VNUM`, and `WORLD_TIME`, and it can build a text fallback for the map area. That behavior is useful, but it does not yet give players a focused room panel with explicit identity, exit, raw payload, and unavailable-data states.

The work should preserve the terminal as the primary room description. The room context panel should answer the compact questions players need while navigating: where am I, what area is this, what room number was reported, what exits are available, and what raw shape arrived if the server payload is uncertain. It should not parse free-form terminal room text and should not depend on `MINIMAP`, which remains an unconfirmed live data source.

The implementation should follow the display-helper pattern used by the core HUD, combat, group, affects, and inventory sessions. A pure shared helper should normalize room identity and exit payloads outside JSX, then `src/App.tsx` should render a narrow room tab without disturbing the terminal, map fallback, command input, existing panels, reconnect behavior, or settings. Tests should use existing synthetic room fixtures plus expanded representative variants for strings, arrays, tables, partial values, disabled mappings, and uncertain raw payloads.

---

## 2. Objectives

1. Normalize confirmed room identity fields into a typed, testable room display model.
2. Normalize representative `ROOM_EXITS` string, array, table, and raw payload shapes into deterministic exit rows.
3. Render a dedicated room context panel with explicit present, waiting, empty, disabled, offline, error, and raw fallback states.
4. Expand fixture-backed tests and responsive checks without requiring live MUD access or relying on `MINIMAP`.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session04-msdp-fixture-corpus` - Provides synthetic MSDP fixture files, including room and exit payload examples.
- [x] `phase00-session05-state-mapping-tests` - Provides `MudState` mapping coverage for room values.
- [x] `phase01-session02-msdp-tables-arrays-malformed-payloads` - Provides parser coverage for structured, array, table, and malformed MSDP payloads.
- [x] `phase01-session03-connection-lifecycle-reconnect-cleanup` - Provides reconnect cleanup behavior that room state must not regress.
- [x] `phase01-session04-dynamic-naws-resize` - Provides resize behavior that sidebar room changes must not break.
- [x] `phase02-session01-core-hud-and-character-panel` - Provides display-helper and availability-state conventions.
- [x] `phase02-session02-combat-and-action-economy-panel` - Provides action payload and optional data patterns.
- [x] `phase02-session03-group-panel` - Provides collection row, unknown-field, and accessibility patterns.
- [x] `phase02-session04-affects-and-inventory-panels` - Provides latest collection display and mobile layout patterns.

### Required Tools/Knowledge
- React 19, TypeScript 6, Vite, and CSS responsive layout.
- Existing `MudState`, `MudValue`, `MsdpVariableMap`, and `mapMsdpUpdate` helpers.
- Existing display helpers in `shared/msdp-display.ts`, `shared/msdp-group-display.ts`, and `shared/msdp-affects-inventory-display.ts`.
- Existing fixtures in `tests/fixtures/msdp/room-and-exits.json`, `nested-tables.json`, and `malformed-payloads.json`.
- Existing Node `node --import tsx --test` test runner.

### Environment Requirements
- `npm install` has already been run.
- `npm test`, `npm run lint`, and `npm run build` are available.
- No live MUD access is required for automated tests.
- Manual UI checks should include desktop, 390px primary mobile, and 360px smoke widths.

---

## 4. Scope

### In Scope (MVP)
- Player can see current room name, area name, room vnum, and world time when matching source-confirmed MSDP values are available - render from typed display fields with empty and waiting states.
- Player can see available exits from `ROOM_EXITS` - support string, array, table, object-like, and conservative raw fallback payload shapes with deterministic ordering.
- Player can inspect bounded raw/debug room context when `ROOM` or `ROOM_EXITS` has an uncertain shape - preserve useful data without implying a final server schema.
- Player can distinguish disabled mappings, waiting for first room payload, empty room context, offline state, connection error state, and present room data.
- Maintainer can validate room display without live MUD access - add focused display-helper tests and extend fixture/state-mapping coverage for full, partial, empty, array, table, string, malformed, and disabled variants.
- Mobile player can use the room panel at 390px and smoke-check 360px without horizontal page scrolling or command input occlusion.

### Out of Scope (Deferred)
- Full mapper behavior, pathfinding, room graph storage, or minimap rendering - *Reason: Session 06 owns map fallback strategy and `MINIMAP` remains unconfirmed.*
- Dependence on `MINIMAP` for room context - *Reason: The source audit did not confirm reliable live population.*
- Free-form terminal room text parsing - *Reason: Terminal output remains the primary description and text parsing would be brittle.*
- Source-level room payload changes - *Reason: Phase 04 owns source protocol changes after client behavior is stable.*
- Contextual room command automation such as scan, exits, look, rest, or stand buttons - *Reason: This session displays room context only.*
- Browser settings persistence migration from cookies - *Reason: Open security finding P00-SEC-002 is separate from this panel session.*

---

## 5. Technical Approach

### Architecture

Add a pure display helper, preferably `shared/msdp-room-display.ts`, that consumes the relevant `MudState` fields, `ConnectionStatus`, and active `MsdpVariableMap`, then returns a typed room context display model. The helper should own availability state, identity field formatting, exit row normalization, compass-friendly deterministic ordering, raw fallback text, unknown-field summaries, and accessible labels. `shared/msdp-state.ts` should continue to preserve raw `ROOM` and `ROOM_EXITS` `MudValue` data without lossy coercion.

`src/App.tsx` should use the new display model to render a dedicated Room inspector tab. The current map/minimap area can continue to use its existing text fallback, but room context details should move into the typed panel path. Keep the React change narrow: do not restructure socket setup, terminal renderer selection, reconnect handling, command input, aliases, triggers, settings, character, combat, group, inventory, or affects behavior.

Testing should remain live-MUD-free. Extend or confirm room fixtures, add pure helper tests for identity and exits, extend state-mapping expectations for disabled and structured room payloads, and document manual responsive checks in implementation notes. If fixture shapes are synthetic, implementation notes must state that they are representative parser/display contracts, not proof of the final live server schema.

### Design Patterns
- Pure display models: Normalize room data outside JSX and keep behavior testable.
- Source-aligned availability: Treat disabled mappings, waiting data, empty context, offline state, and error state distinctly.
- Conservative exit rendering: Render strings, arrays, and object-like exits without inventing unsupported room semantics.
- Deterministic ordering: Prefer common compass order, then stable alphabetical fallback for unknown exit keys.
- Bounded raw/debug output: Keep raw `ROOM` and `ROOM_EXITS` summaries short, deterministic, and secondary.
- Stable layout constraints: Keep long room names, area names, exit labels, and raw values inside sidebar dimensions.
- Accessibility by text: Provide visible labels and aria labels rather than relying on color or layout position alone.
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
| `shared/msdp-room-display.ts` | Pure room context display models for identity, exits, availability, raw fallback text, unknown fields, and accessibility labels | ~340 |
| `tests/msdp-room-display.test.ts` | Focused tests for room identity, exit normalization, availability states, disabled mappings, raw fallbacks, and ordering | ~280 |
| `.spec_system/specs/phase02-session05-room-context-panel/implementation-notes.md` | Implementation evidence, command output summaries, responsive checks, fixture notes, and residual risks | ~120 |
| `.spec_system/specs/phase02-session05-room-context-panel/security-compliance.md` | Session security, privacy, protocol, accessibility, persistence, and licensing notes | ~90 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `src/App.tsx` | Add Room sidebar tab, build room display model, render room identity, exits, raw fallback, and availability states | ~220 |
| `src/App.css` | Add compact room context, exit row, raw fallback, and 390px/360px responsive styles | ~160 |
| `tests/msdp-state-mapping.test.ts` | Extend room mapping expectations for full, partial, structured, empty, and disabled mapping behavior | ~90 |
| `tests/msdp-fixture-mapping.test.ts` | Keep fixture count and expected-pair mapping assertions aligned with expanded room fixtures | ~20 |
| `tests/fixtures/msdp/room-and-exits.json` | Add or refine room identity, exit string, exit array, table, partial, empty, and raw fallback variants | ~180 |
| `tests/fixtures/msdp/manifest.json` | Update fixture counts and room coverage summary when room fixtures change | ~40 |
| `tests/fixtures/msdp/README.md` | Document representative room and exit fixture shapes and schema caution | ~60 |
| `tests/README.md` | Document room display tests and manual responsive check expectations | ~40 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Room name, area name, room vnum, and world time render when source-confirmed MSDP values are present.
- [ ] `ROOM_EXITS` renders stable exit rows from representative string, array, table, object-like, malformed, and empty fixtures.
- [ ] `ROOM` structured payloads can contribute bounded raw/debug details without replacing terminal room text as the primary description.
- [ ] Disabled room mappings, connected waiting state, empty context, offline state, error state, raw fallback state, and present state remain distinct.
- [ ] Room context rendering does not depend on `MINIMAP` and does not imply minimap support when no live minimap payload exists.
- [ ] Unknown room or exit fields are ignored or surfaced through controlled debug-friendly fallback text.
- [ ] Room panel updates do not mutate or reset character, combat, group, affects, inventory, terminal, map fallback, command input, reconnect, alias, trigger, or settings state.
- [ ] Desktop and 390px mobile room layouts are readable, and 360px smoke width has no horizontal page scroll.

### Testing Requirements
- [ ] Unit tests cover room display helper behavior for full identity fields, partial fields, zero room vnum, missing fields, blank fields, raw `ROOM`, disabled mapping, offline state, and error state.
- [ ] Unit tests cover exit display helper behavior for strings, arrays, table records, keyed object records, numeric destinations, closed/status values, unknown fields, empty payloads, deterministic ordering, disabled mapping, offline state, and error state.
- [ ] State mapping tests preserve `ROOM` and `ROOM_EXITS` structured payloads without lossy coercion and ignore disabled mappings.
- [ ] Relevant room fixture coverage exists for representative payload variants.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Manual responsive checks are documented for desktop, 390px, and 360px widths.

### Non-Functional Requirements
- [ ] Terminal-first layout remains primary; room context UI does not obscure command entry or terminal output.
- [ ] Color-coded or status-coded room states include visible text labels and accessible names.
- [ ] Room display logic adds no live-MUD dependency to automated tests.
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
- Keep raw protocol preservation separate from display normalization. `shared/msdp-state.ts` should store `ROOM` and `ROOM_EXITS`; the new helper should format them.
- Do not parse terminal room text. Terminal output remains the authoritative descriptive source for prose room descriptions.
- Do not make broad UI refactors in `src/App.tsx`; change only the room context panel and closely related availability rendering.
- Preserve the existing map/minimap fallback behavior until Session 06 owns map and quest fallback strategy.
- Treat synthetic fixtures as representative contracts for parser/display behavior, not as final proof of server room schemas.
- Preserve terminal and command input focus behavior while adding the Room tab.
- Do not add persisted room preferences while browser settings still use cookies.

### Potential Challenges
- `ROOM_EXITS` payloads may be strings, arrays, tables, numeric destination maps, status maps, empty collections, or malformed fallback values: mitigate with conservative display models and tests.
- `ROOM` payload shape may vary across live servers: support known representative aliases without claiming schema certainty.
- Long room names, area names, exit labels, or raw payload summaries can overflow narrow sidebars: use stable grid sizing, wrapping, truncation where appropriate, and accessible full text.
- Existing map fallback uses `formatMudValueAsText`: changing it could regress minimap fallback. Keep map behavior stable unless tests and notes show why a change is needed.
- Existing tests do not mount React components: prefer pure helper tests and manual UI evidence instead of adding a new UI test stack.

### Relevant Considerations
- [P01] **`src/App.tsx` concentration**: Limit changes to room panel rendering and avoid broad renderer or command-shell rewrites.
- [P01] **Fixture-backed tests worked**: Extend deterministic room coverage instead of depending on live MUD traffic.
- [P01] **Parser helper boundaries**: Keep parser/state/helper boundaries intact and avoid recombining protocol behavior in `src/App.tsx`.
- [P01] **Renderer fallback remains in service**: Keep escaped HTML rendering paths intact while changing panel UI.
- [P01] **Cookie-based client state**: Do not expand persisted settings or store sensitive room preferences.
- [P00-SEC-002] **Browser settings are stored in cookies**: This session must not add new persisted secrets or larger sensitive payloads.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Room or exit rows could drop useful data when optional fields are missing.
- Empty room payloads could be confused with waiting, disabled, offline, or error states.
- Raw fallback text could become too large for the sidebar or mobile viewport.
- Synthetic fixture shapes could be overinterpreted as a final server schema.
- Adding a Room tab could break tab focus, command input focus return, or narrow-width wrapping.
- Room context could accidentally imply `MINIMAP` support that the source audit has not confirmed.

---

## 9. Testing Strategy

### Unit Tests
- Test full room identity models with room name, area name, room vnum, world time, and structured raw `ROOM` details.
- Test partial room identity models with missing room name, missing area, zero vnum, blank strings, disabled mappings, connected waiting, offline, and error states.
- Test exit models for strings, arrays, keyed tables, numeric destinations, closed/status values, unknown fields, empty arrays, empty tables, disabled mappings, connected waiting, offline, and error states.
- Test compass ordering before alphabetical fallback for unknown exit labels.
- Test state mapping for structured `ROOM` and `ROOM_EXITS` payload preservation and disabled mapping behavior.

### Integration Tests
- Run the existing `npm test` suite to verify parser, fixture, mapping, lifecycle, policy, renderer, xterm spike, core display, combat display, group display, affects/inventory display, and room display regressions.
- Run `npm run lint` and `npm run build` to catch TypeScript, React hook, CSS, and production build issues.

### Manual Testing
- Verify desktop layout with waiting, empty, full, partial, table, array, string, unknown-field, and raw fallback room payloads.
- Verify the Room tab does not disturb Character, Combat, Quests, Group, Inventory, and Affects tab behavior.
- Verify map/minimap fallback text still behaves as before when `MINIMAP` is absent.
- Verify 390px mobile width for readable room fields, wrapped room names, exit rows, tab controls, command input, and no horizontal page scroll.
- Smoke-check 360px width for terminal priority, room text wrapping, and no viewport overflow.
- Confirm command input focus returns normally after selecting the Room tab and interacting with nearby sidebar controls.

### Edge Cases
- `ROOM`, `ROOM_NAME`, `AREA_NAME`, `ROOM_EXITS`, and `ROOM_VNUM` are all missing while connected.
- One or more room variables are disabled in MSDP variable settings.
- `ROOM_EXITS` is an empty array, empty table, null, blank string, scalar, array, table, nested table, or malformed value.
- Exit direction is blank, missing, very long, duplicated, numeric, or unknown.
- Exit destination equals `0`, is missing, is negative, is non-numeric, or is a status string such as closed.
- `ROOM` includes unrecognized fields, nested objects, or fields that duplicate scalar variables.
- Connection status is idle, connecting, connected, disconnected, or error.

---

## 10. Dependencies

### External Libraries
- None planned. Use existing React, TypeScript, CSS, and Node test tooling.

### Other Sessions
- **Depends on**: `phase02-session01-core-hud-and-character-panel`, `phase02-session02-combat-and-action-economy-panel`, `phase02-session03-group-panel`, `phase02-session04-affects-and-inventory-panels`, Phase 00 fixture and mapping foundations, Phase 01 parser/reconnect/resize foundations.
- **Depended by**: `phase02-session06-map-and-quest-fallback-strategy`, Phase 03 client UX refinement sessions.

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
