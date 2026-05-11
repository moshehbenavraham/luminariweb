# Session Specification

**Session ID**: `phase02-session01-core-hud-and-character-panel`
**Phase**: 02 - Build Luminari Game Panels
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session starts Phase 02 by making the always-visible player readouts source-aligned and reliable. Earlier work established confirmed Luminari MSDP variables, parser coverage, state mapping, reconnect cleanup, resize handling, and deployment safety. This session uses those foundations to make the HUD and character panel render confirmed resource, identity, economy, position, armor, and attack data without depending on fields that Luminari-Source does not currently emit.

The goal is not a broad application redesign. The implementation should keep terminal play central, preserve existing sidebar behavior, and introduce small pure display helpers where they make numeric normalization, unavailable states, and tests easier to reason about. The player should be able to see health, PSP, movement, XP/TNL, level, race, class, position, AC, attack bonus, money, and related source-confirmed fields clearly on desktop and at 390px mobile width.

The work also keeps optional and unsupported data honest. `TITLE`, `FORTITUDE`, `REFLEX`, `WILLPOWER`, `DAMAGE_BONUS`, and similar override-only fields must remain explicit unavailable or waiting states unless the user configures an override and the server emits a value. This preserves the Phase 00 product decision that missing server data is not a broken client state.

---

## 2. Objectives

1. Render source-confirmed core resource, identity, economy, position, armor, and attack fields through consistent display helpers.
2. Normalize numeric values consistently for HUD bars, character stats, zero values, negative values, and XP/TNL progress.
3. Preserve deliberate unavailable, loading, empty, offline, and error states for unsupported or optional fields.
4. Keep HUD and character panel layout readable on desktop, 390px primary mobile, and 360px smoke widths without horizontal page scrolling.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session02-msdp-variable-map-alignment` - Provides source-aligned default MSDP mappings.
- [x] `phase00-session03-unavailable-data-ux` - Provides explicit unavailable-data UI behavior.
- [x] `phase00-session04-msdp-fixture-corpus` - Provides repeatable fixture inputs for state coverage.
- [x] `phase00-session05-state-mapping-tests` - Provides state mapping tests that distinguish zero from missing values.
- [x] `phase01-session04-dynamic-naws-resize` - Provides resize behavior that must survive mobile layout changes.
- [x] `phase01-session06-proxy-limits-deployment-safety` - Provides stable public proxy behavior before player-facing panel expansion.

### Required Tools/Knowledge
- React 19, TypeScript 6, Vite, CSS responsive layout.
- Existing `MudState`, `MsdpVariableMap`, and `mapMsdpUpdate` helpers.
- Existing Node `node --import tsx --test` test runner.
- Luminari-Source confirmed MSDP variable list in `.spec_system/PRD/PRD.md`.

### Environment Requirements
- `npm install` has already been run.
- `npm test`, `npm run lint`, and `npm run build` are available.
- No live MUD is required for automated tests; fixture-backed state and pure display helpers should cover most behavior.
- Manual UI checks should include desktop, 390px mobile, and 360px smoke widths.

---

## 4. Scope

### In Scope (MVP)
- Player can read HP, PSP, movement, and XP/TNL HUD values from confirmed MSDP state - use stable numeric formatting and honest waiting/offline labels.
- Player can read character name, level, race, class, position, alignment, money, attack bonus, and armor class from confirmed MSDP state - preserve zero and negative values.
- Maintainer can test display normalization without live MUD access - add pure helper coverage and fixture-backed cases.
- Player sees unsupported title, saves, and damage bonus as intentional unavailable or waiting states - do not imply the client failed to render them.
- Mobile player can use the core HUD and character panel at 390px, with 360px smoke coverage - prevent horizontal page scrolling and text overflow.
- Screen reader and keyboard users get meaningful HUD and stat text - include labels alongside color-coded state.

### Out of Scope (Deferred)
- Combat opponent/tank redesign and action economy panel - *Reason: Phase 02 Session 02 owns combat and `ACTIONS`.*
- Group, affects, inventory, room, map, minimap, or quest panel implementation - *Reason: These have dedicated later Phase 02 sessions.*
- Source-level MSDP variable additions for title, saves, damage bonus, minimap, or quest data - *Reason: Phase 04 owns source-level protocol changes.*
- xterm.js production migration - *Reason: Phase 01 only completed the spike; renderer migration remains separate from panel work.*
- Moving settings, aliases, and triggers out of cookies - *Reason: Open security finding P00-SEC-002 remains important but is separate from this UI display session.*

---

## 5. Technical Approach

### Architecture

Keep the session centered on a small set of display and layout changes. Add a pure TypeScript helper module for core MSDP display models if it meaningfully reduces repeated formatting or makes tests more direct. The helper should consume `MudState`, `ConnectionStatus`, and the active `MsdpVariableMap`, then return plain objects for HUD bars, character identity, character stats, and unavailable notices. `src/App.tsx` should render those models without taking on more protocol mapping logic.

Do not recombine parser, proxy, renderer, or resize concerns into `src/App.tsx`. `shared/msdp-state.ts` remains responsible for converting MSDP updates into `MudState`; the new display logic should only decide how confirmed or missing values are presented. CSS changes should be narrow, preserving the current terminal-first layout while tightening HUD bar text, stat grids, touch target behavior, and mobile wrapping.

Testing should stay live-MUD-free. Use `node:test` for display helper behavior, extend existing fixture/state mapping coverage for core scalar values where needed, and document manual responsive checks in implementation notes. If React component testing would require new tooling, prefer pure helper tests and manual UI evidence for this session.

### Design Patterns
- Pure display models: Convert state into HUD/stat view models before JSX where it reduces repeated branching.
- Source-aligned availability: Treat unsupported configured defaults differently from waiting, empty, offline, and error states.
- Stable layout constraints: Use grid and min-width rules so dynamic labels and numbers do not resize or overflow controls.
- Accessibility by text: Keep numeric text labels visible; do not rely on color alone.
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
| `shared/msdp-display.ts` | Pure core HUD and character display helpers for normalized numbers, labels, percentages, and availability states | ~220 |
| `tests/msdp-display.test.ts` | Focused tests for core display helpers, zero values, negative values, XP/TNL progress, and unsupported fields | ~180 |
| `.spec_system/specs/phase02-session01-core-hud-and-character-panel/implementation-notes.md` | Implementation evidence, responsive checks, command output summaries, and residual risks | ~120 |
| `.spec_system/specs/phase02-session01-core-hud-and-character-panel/security-compliance.md` | Session security, privacy, accessibility, and persistence notes | ~90 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `src/App.tsx` | Wire HUD and character rendering to display helpers while preserving command input, sidebar, and renderer behavior | ~160 |
| `src/App.css` | Tighten HUD, stat, availability, and 390px/360px responsive behavior without horizontal scrolling | ~140 |
| `tests/msdp-state-mapping.test.ts` | Extend or confirm core resource, economy, position, zero, and negative mapping expectations | ~60 |
| `tests/fixtures/msdp/core-scalars.json` | Add representative confirmed core HUD and character scalar fixture coverage if gaps remain | ~80 |
| `tests/README.md` | Document focused display helper tests and responsive manual check expectations | ~40 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] HP, PSP, movement, XP/TNL, AC, attack bonus, money, position, level, race, class, and alignment render from confirmed MSDP state.
- [ ] Numeric display preserves zero, negative values, large values, missing max values, and invalid numeric inputs without misleading output.
- [ ] XP/TNL progress uses `EXPERIENCE_MAX` and `EXPERIENCE_TNL` when both are available, and falls back safely when partial data arrives.
- [ ] Unsupported or non-emitted title, saves, and damage bonus states remain explicit unavailable/waiting/offline/error states.
- [ ] Desktop and 390px mobile HUD/character layouts are readable, and 360px smoke width has no horizontal page scroll.
- [ ] Existing terminal renderer, command input, sidebar tabs, and reconnect state behavior remain stable.

### Testing Requirements
- [ ] Unit tests cover display helpers for HUD bars, character stats, zero values, negative values, missing max values, and unavailable fields.
- [ ] Existing MSDP state mapping tests still cover confirmed core variables and override-only variables.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Manual responsive checks are documented for desktop, 390px, and 360px widths.

### Non-Functional Requirements
- [ ] Terminal-first layout remains primary; HUD and character panel do not crowd command entry.
- [ ] Color-coded HUD states include visible text labels and accessible names.
- [ ] UI changes do not add persistent sensitive data or expand cookie-stored settings.
- [ ] Display helper logic adds no live-MUD dependency to automated tests.
- [ ] Code follows project conventions and keeps protocol mapping separate from UI presentation.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] No GPL reference code is copied.

---

## 8. Implementation Notes

### Key Considerations
- Keep `MudState` mapping and display formatting separate. `shared/msdp-state.ts` maps protocol values; the display helper formats and labels them.
- Do not make broad UI refactors in `src/App.tsx`; change only the HUD and character paths needed for this session.
- Keep unsupported fields honest. A missing title, save, damage bonus, quest, or minimap value should read as an intentional protocol limitation or waiting state.
- Do not add persisted panel preferences while browser settings still use cookies.
- Preserve terminal and command input focus behavior while adjusting sidebar and HUD markup.

### Potential Challenges
- `src/App.tsx` already owns many concerns: mitigate by extracting only pure display decisions and leaving renderer, resize, and socket logic untouched.
- XP data can be partial: guard missing or invalid max/TNL values and avoid invalid percentages.
- Mobile HUD labels can overflow: use stable grid sizing, text truncation, and compact labels that still expose full accessible text.
- Existing tests do not mount React components: prefer pure helper tests and document manual responsive verification instead of adding a new UI test stack in this session.

### Relevant Considerations
- [P01] **`src/App.tsx` concentration**: Limit changes to HUD/character display and avoid broad renderer or command-shell rewrites.
- [P01] **Fixture-backed tests worked**: Extend deterministic state/display coverage instead of depending on live MUD traffic.
- [P01] **Renderer fallback remains in service**: Keep escaped HTML rendering paths intact while changing panel UI.
- [P01] **Cookie-based client state**: Do not expand persisted settings or store sensitive panel preferences.
- [P00-SEC-002] **Browser settings are stored in cookies**: This session must not add new persisted secrets or larger sensitive payloads.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- HUD bars could treat zero as missing or compute invalid percentages from partial max values.
- Unsupported server fields could look like broken UI instead of intentional unavailable states.
- Compact mobile labels or numbers could overflow and create horizontal page scrolling.
- Accessibility could regress if color is the only signal for resource state.

---

## 9. Testing Strategy

### Unit Tests
- Test display helper number normalization for zero, negative, positive, missing, invalid, and large values.
- Test HUD bar models for HP, PSP, movement, and XP/TNL percentages when current, max, and TNL values are present or partial.
- Test character display models for identity, position, alignment, money, attack bonus, armor class, ability scores, title, saves, and damage bonus availability.
- Keep or extend state mapping tests for confirmed core scalar variables and override-only variables.

### Integration Tests
- Run the existing `npm test` suite to verify parser, fixture, mapping, lifecycle, policy, renderer, and xterm spike regressions.
- Run `npm run lint` and `npm run build` to catch TypeScript, React hook, and production build issues.

### Manual Testing
- Verify the HUD and character panel with representative connected state in desktop layout.
- Verify 390px mobile width for readable HUD bars, character stats, touch targets, and no horizontal page scroll.
- Smoke-check 360px width for connect, terminal, command input, HUD, and character panel overflow.
- Confirm command input focus returns normally after interacting with sidebar tabs.

### Edge Cases
- Resource value equals `0` while max is positive.
- Max value is missing, zero, or lower than current value.
- `EXPERIENCE_TNL` is missing while `EXPERIENCE` exists.
- Attack bonus is negative and armor class is zero.
- Money is large or zero.
- Title, saves, and damage bonus are not configured by default.
- Connection status is idle, connecting, connected, disconnected, or error.

---

## 10. Dependencies

### External Libraries
- None planned. Use existing React, TypeScript, CSS, and Node test tooling.

### Other Sessions
- **Depends on**: `phase00-session02-msdp-variable-map-alignment`, `phase00-session03-unavailable-data-ux`, `phase00-session04-msdp-fixture-corpus`, `phase00-session05-state-mapping-tests`, `phase01-session04-dynamic-naws-resize`, `phase01-session06-proxy-limits-deployment-safety`
- **Depended by**: `phase02-session02-combat-and-action-economy-panel`, `phase02-session03-group-panel`, `phase02-session04-affects-and-inventory-panels`, `phase02-session05-room-context-panel`

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
