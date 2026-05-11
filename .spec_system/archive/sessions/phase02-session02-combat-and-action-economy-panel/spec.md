# Session Specification

**Session ID**: `phase02-session02-combat-and-action-economy-panel`
**Phase**: 02 - Build Luminari Game Panels
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session adds the first dedicated combat surface on top of the source-aligned HUD and character display helpers completed in Session 01. The player should be able to identify the current opponent, see tank status when present, and inspect action economy data from confirmed `ACTIONS` payloads without losing the terminal-first play loop.

The work stays deliberately narrow. It should extend the existing pure display-helper pattern, fixture-backed state mapping, and compact React/CSS panel structure instead of introducing a broad dashboard rewrite. Combat state must be visually distinct from general character state, but it should remain quiet when the character is not in combat or when only partial MSDP data has arrived.

This session also protects the protocol truth established earlier. `DAMAGE_BONUS` must not be rendered as reliable default combat data unless the player explicitly maps it and a value arrives. `ACTIONS` rendering should support the confirmed list-like fixture shapes first, with a raw or conservative fallback for mixed structured values rather than inventing unverified semantics.

---

## 2. Objectives

1. Render opponent and tank names, health values, and partial combat states from confirmed MSDP fields.
2. Display `ACTIONS` payloads for confirmed array and mixed list/table fixture shapes without assuming unsupported action semantics.
3. Keep inactive, empty, partial, offline, and error combat states quiet, explicit, and distinct from general character data.
4. Add focused fixture, display-helper, mapping, lint, build, and manual responsive coverage for combat UI behavior.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session02-msdp-variable-map-alignment` - Provides source-aligned default MSDP mappings, including combat fields and override-only `DAMAGE_BONUS`.
- [x] `phase00-session04-msdp-fixture-corpus` - Provides parser fixtures for combat, tank, `ACTIONS`, and mixed collection payloads.
- [x] `phase00-session05-state-mapping-tests` - Provides mapping tests for confirmed scalar and collection values.
- [x] `phase01-session03-connection-lifecycle-reconnect-cleanup` - Provides reconnect cleanup behavior that combat state must not break.
- [x] `phase01-session04-dynamic-naws-resize` - Provides resize behavior that must survive panel layout changes.
- [x] `phase02-session01-core-hud-and-character-panel` - Provides display helper patterns, HUD/character wiring, and responsive panel conventions.

### Required Tools/Knowledge
- React 19, TypeScript 6, Vite, and CSS responsive layout.
- Existing `MudState`, `MudValue`, `MsdpVariableMap`, and `mapMsdpUpdate` helpers.
- Existing `shared/msdp-display.ts` display-helper utilities and `tests/msdp-display.test.ts`.
- Existing MSDP fixtures in `tests/fixtures/msdp/combat-and-resources.json`, `collections.json`, and `nested-tables.json`.

### Environment Requirements
- `npm install` has already been run.
- `npm test`, `npm run lint`, and `npm run build` are available.
- No live MUD access is required for automated tests.
- Manual UI checks should include desktop, 390px primary mobile, and 360px smoke widths.

---

## 4. Scope

### In Scope (MVP)
- Player can see opponent name and health from `OPPONENT_NAME`, `OPPONENT_HEALTH`, and `OPPONENT_HEALTH_MAX` - render a combat-specific display model with explicit loading, empty, error, and offline states.
- Player can see tank name and health from `TANK_NAME`, `TANK_HEALTH`, and `TANK_HEALTH_MAX` - handle missing name, missing max, zero values, and partial values without resetting unrelated panels.
- Player can inspect action economy data from `ACTIONS` - render confirmed arrays, mixed array/table entries, and empty arrays with conservative labels and raw fallback text where structure is unconfirmed.
- Player sees inactive combat as quiet information - no alarming error state when opponent and tank values are absent during a normal connected session.
- Maintainer can verify combat display behavior without live MUD access - add display-helper tests and fixture/mapping coverage.
- Mobile player can use combat panel states at 390px and smoke-check 360px without horizontal page scrolling or terminal-obscuring chrome.

### Out of Scope (Deferred)
- Free-form combat log parsing - *Reason: PRD explicitly excludes brittle command-output parsing for first-release structured panel work.*
- Live combat automation or auto-fired actions - *Reason: This session displays action state only; command automation remains user-controlled aliases/triggers.*
- Group member combat state - *Reason: Phase 02 Session 03 owns group panel behavior.*
- Damage bonus as a default reliable value - *Reason: `DAMAGE_BONUS` update support is not live-confirmed and remains override-only.*
- Source-level action schema changes - *Reason: Phase 04 owns source protocol changes after client behavior is stable.*
- Broad terminal renderer, reconnect, settings persistence, or proxy refactors - *Reason: These are separate concerns and already have dedicated coverage.*

---

## 5. Technical Approach

### Architecture

Extend the existing display-helper architecture instead of embedding combat interpretation directly in React. Add combat-specific view models in `shared/msdp-display.ts` or a closely related helper if the file becomes unwieldy. The helper should consume `MudState`, `ConnectionStatus`, and the active `MsdpVariableMap`, then return plain objects for opponent status, tank status, action entries, and availability notices.

The React changes should add a combat tab or combat section that uses those models, plus optional combat bars that remain visually separate from HP/PSP/movement/XP. `src/App.tsx` should render models and keep socket, renderer, resize, command input, alias, trigger, and reconnect logic untouched. CSS should use compact, flat, semantic combat styling that follows the current terminal-first layout and UX guardrails.

Testing remains fixture-backed and live-MUD-free. Add unit tests for combat display models, preserve mapping coverage for opponent/tank/action variables, and extend fixture coverage only where it clarifies empty, partial, or mixed action payload behavior. Use manual responsive checks for layout because the repo does not currently have React component test tooling.

### Design Patterns
- Pure display models: Keep combat state normalization out of JSX and easy to test.
- Quiet inactive state: Treat absent combat values while connected as "not in combat" or waiting, not as a failure.
- Source-aligned availability: Keep `DAMAGE_BONUS` unavailable by default unless an override and value exist.
- Conservative collection rendering: Render `ACTIONS` arrays and mixed entries without inventing action semantics.
- Stable layout constraints: Keep combat labels and values inside fixed panel dimensions at desktop and mobile widths.
- Accessibility by text: Provide labels, numeric text, and ARIA text alongside color-coded combat state.

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
| `.spec_system/specs/phase02-session02-combat-and-action-economy-panel/implementation-notes.md` | Implementation evidence, command output summaries, responsive checks, and residual risks | ~120 |
| `.spec_system/specs/phase02-session02-combat-and-action-economy-panel/security-compliance.md` | Session security, privacy, accessibility, and persistence notes | ~90 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `shared/msdp-display.ts` | Add combat display models for opponent, tank, actions, quiet inactive state, partial values, and override-only damage handling | ~220 |
| `src/App.tsx` | Render combat HUD/status and a combat inspector tab from display models while preserving terminal, command, reconnect, and sidebar behavior | ~180 |
| `src/App.css` | Add compact combat panel, action economy, quiet empty-state, and 390px/360px responsive styles | ~160 |
| `tests/msdp-display.test.ts` | Add combat model tests for opponent/tank, partial health, empty state, action arrays, mixed actions, and damage bonus availability | ~180 |
| `tests/msdp-state-mapping.test.ts` | Confirm combat and `ACTIONS` mappings preserve scalar, array, mixed, empty, and override-only behavior | ~60 |
| `tests/fixtures/msdp/combat-and-resources.json` | Add or refine opponent/tank partial and empty combat fixture cases if existing coverage is insufficient | ~80 |
| `tests/fixtures/msdp/collections.json` | Add or refine `ACTIONS` empty and array fixture coverage for display-model tests if needed | ~60 |
| `tests/fixtures/msdp/manifest.json` | Update fixture coverage counts if combat/action fixtures change | ~40 |
| `tests/README.md` | Document focused combat display tests and responsive manual check expectations | ~40 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Opponent name, opponent health, tank name, and tank health render from confirmed MSDP state.
- [ ] Missing name, missing max, zero current value, max lower than current, and disconnected/error states remain explicit and non-crashing.
- [ ] Empty connected combat state is visually quiet and does not imply a broken client.
- [ ] `ACTIONS` arrays render as action economy entries, empty arrays render as empty action state, and mixed entries render with conservative labels or raw fallback text.
- [ ] `DAMAGE_BONUS` is not presented as reliable combat data by default; override-only behavior remains explicit.
- [ ] Combat UI does not reset the character, group, affects, map, terminal, command input, or reconnect state when combat data changes.
- [ ] Desktop and 390px mobile combat layouts are readable, and 360px smoke width has no horizontal page scroll.

### Testing Requirements
- [ ] Unit tests cover combat display helper behavior for opponent, tank, partial values, inactive state, action arrays, mixed actions, empty arrays, and override-only damage.
- [ ] State mapping tests cover confirmed opponent/tank/action variables and keep `DAMAGE_BONUS` ignored by the default map.
- [ ] Relevant fixture coverage exists for combat scalar values and action payload behavior.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Manual responsive checks are documented for desktop, 390px, and 360px widths.

### Non-Functional Requirements
- [ ] Terminal-first layout remains primary; combat UI does not obscure command entry or terminal output.
- [ ] Color-coded combat states include visible text labels and accessible names.
- [ ] Combat display logic adds no live-MUD dependency to automated tests.
- [ ] UI changes do not add persistent sensitive data or expand cookie-stored settings.
- [ ] Code follows project conventions and keeps protocol mapping separate from UI presentation.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] No GPL reference code is copied.

---

## 8. Implementation Notes

### Key Considerations
- Keep `MudState` mapping separate from combat display formatting. `shared/msdp-state.ts` maps protocol values; display helpers decide how combat values are presented.
- Do not make broad UI refactors in `src/App.tsx`; change only combat panel and combat status rendering paths needed for this session.
- Keep inactive combat quiet. A connected player without an opponent is usually not in combat, not in an error state.
- Keep `DAMAGE_BONUS` honest as override-only unless live source support is confirmed later.
- Preserve terminal and command input focus behavior while adding combat tab controls.
- Do not add persisted combat preferences while browser settings still use cookies.

### Potential Challenges
- `ACTIONS` payloads may be arrays, mixed arrays, tables, or empty collections: mitigate with conservative rendering and raw fallback text.
- Partial combat data may arrive in multiple MSDP updates: derive each display state independently without clearing unrelated state.
- Combat bars can look alarming when stale or absent: use quiet inactive styling and explicit reconnect/offline states.
- Mobile combat rows can overflow: use stable grid sizing, wrapping, truncation, and compact labels that still expose accessible text.
- Existing tests do not mount React components: prefer pure helper tests and manual UI evidence instead of adding a new UI test stack.

### Relevant Considerations
- [P01] **`src/App.tsx` concentration**: Limit changes to combat display and avoid broad renderer or command-shell rewrites.
- [P01] **Fixture-backed tests worked**: Extend deterministic combat/action coverage instead of depending on live MUD traffic.
- [P01] **Renderer fallback remains in service**: Keep escaped HTML rendering paths intact while changing panel UI.
- [P01] **Cookie-based client state**: Do not expand persisted settings or store sensitive combat preferences.
- [P00-SEC-002] **Browser settings are stored in cookies**: This session must not add new persisted secrets or larger sensitive payloads.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Combat state could treat normal absence of opponent data as an error instead of a quiet inactive state.
- `ACTIONS` display could overfit synthetic fixture shapes and imply unsupported automation semantics.
- Partial opponent or tank health could compute invalid percentages or hide useful names.
- Combat tab and status controls could regress keyboard focus, labels, or mobile text overflow.

---

## 9. Testing Strategy

### Unit Tests
- Test combat display helper models for opponent and tank present states with current and maximum health.
- Test zero health, missing maximum health, missing name, and max lower than current value.
- Test connected inactive, offline, disconnected, and error availability notices.
- Test `ACTIONS` array entries, empty arrays, mixed string/table entries, unsupported primitive values, and raw fallback text.
- Test `DAMAGE_BONUS` default unavailable behavior and override-only reported-value behavior.

### Integration Tests
- Run the existing `npm test` suite to verify parser, fixture, mapping, lifecycle, policy, renderer, xterm spike, and display-helper regressions.
- Run `npm run lint` and `npm run build` to catch TypeScript, React hook, CSS import, and production build issues.

### Manual Testing
- Verify desktop layout with combat inactive, opponent-only, tank-only, opponent+tank, and action payload states.
- Verify 390px mobile width for readable combat rows, action entries, tab controls, command input, and no horizontal page scroll.
- Smoke-check 360px width for terminal priority, combat text wrapping, and no viewport overflow.
- Confirm command input focus returns normally after selecting the combat tab and interacting with panel controls.

### Edge Cases
- Opponent name exists without health.
- Opponent health equals `0`.
- Opponent or tank max value is missing, zero, or lower than current value.
- Tank data exists without opponent data.
- `ACTIONS` is missing, an empty array, a string array, a mixed string/table array, an object, or malformed from prior parser fallback.
- Connection status is idle, connecting, connected, disconnected, or error.
- `DAMAGE_BONUS` is absent by default, configured as an override, or reported through an override.

---

## 10. Dependencies

### External Libraries
- None planned. Use existing React, TypeScript, CSS, and Node test tooling.

### Other Sessions
- **Depends on**: `phase02-session01-core-hud-and-character-panel`, Phase 00 fixture and mapping foundations, Phase 01 reconnect and resize foundations.
- **Depended by**: `phase02-session03-group-panel`, `phase02-session04-affects-and-inventory-panels`, `phase02-session05-room-context-panel`

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
