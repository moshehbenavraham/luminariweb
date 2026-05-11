# Session Specification

**Session ID**: `phase03-session02-windows-and-layout-ergonomics`
**Phase**: 03 - Borrow the Best Ideas
**Status**: Completed
**Created**: 2026-05-11
**Completed**: 2026-05-11

---

## 1. Session Overview

This session improves the play layout around the terminal, HUD, command input, map, and inspector panels. The current app already has the Phase 02 panel surfaces and the Phase 03 mapper model, but the sidebar is split between a dedicated map panel and a separate tabbed panel, and the active panel choice is not preserved across repeated play sessions.

The goal is a compact, stable inspector experience that helps players move between map, room, character, combat, group, inventory, affects, and quest information without weakening the terminal-first workflow. Command input must remain visible and reachable during normal play, and keyboard focus behavior must stay predictable after tab changes, inspector collapse or expand actions, settings menus, and terminal clicks.

`EXAMPLES/mud-web-client` may be studied for behavior-only layout ideas such as a primary terminal area, side panel organization, resize-aware terminal surfaces, and local layout persistence. The project must not copy GPL reference UI code or add a full Golden Layout style draggable window manager in this session.

---

## 2. Objectives

1. Consolidate map and panel navigation into a single compact inspector flow that keeps the terminal dominant.
2. Add safe browser-local layout preferences for active inspector tab, collapsed state, and density without expanding cookie storage.
3. Preserve command input visibility, focus recovery, keyboard tab navigation, and explicit panel availability states.
4. Validate desktop, 390px, and 360px layouts for no horizontal scrolling or command input obstruction.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session01-core-hud-and-character-panel` - Provides the HUD and character panel surface.
- [x] `phase02-session02-combat-and-action-economy-panel` - Provides combat display state.
- [x] `phase02-session03-group-panel` - Provides group display state.
- [x] `phase02-session04-affects-and-inventory-panels` - Provides affects and inventory panels.
- [x] `phase02-session05-room-context-panel` - Provides room display state and focus-sensitive sidebar behavior.
- [x] `phase02-session06-map-and-quest-fallback-strategy` - Provides map and quest fallback behavior.
- [x] `phase03-session01-mapper-ux-reference-implementation` - Provides the current mapper display model and responsive map checks.

### Required Tools/Knowledge
- React 19 component and hook conventions.
- Existing `src/App.tsx` command focus and sidebar tab behavior.
- Existing responsive CSS in `src/App.css`.
- Node test runner via `node --import tsx --test`.
- License posture for GPL reference repositories.

### Environment Requirements
- Dependencies installed with the current `package-lock.json`.
- `EXAMPLES/mud-web-client` available for behavior-only reference review.
- Local quality commands available: `npm run test`, `npm run lint`, and `npm run build`.

---

## 4. Scope

### In Scope (MVP)
- Player can switch efficiently between map, room, character, combat, group, inventory, affects, and quest panels - Refactor the sidebar into one inspector navigation surface.
- Player can keep the terminal and command input dominant during play - Add stable layout and collapsed inspector behavior.
- Player can preserve safe layout preferences between visits - Store active inspector tab, collapsed state, and density in `localStorage` with corrupt or unavailable storage fallbacks.
- Keyboard user can navigate inspector controls predictably - Add semantic tab controls, visible focus, and arrow-key tab movement where practical.
- Maintainer can verify preference parsing and responsive expectations - Add pure helper tests and update manual smoke notes.

### Out of Scope (Deferred)
- A full draggable desktop window manager - *Reason: the UX PRD explicitly starts with a stable grid plus persisted inspector state.*
- Golden Layout, dockable panels, or copied GPL UI code - *Reason: reference repositories remain behavior-only inputs.*
- Cloud-synced layout profiles - *Reason: first-release preferences are browser-local only.*
- Replacing the terminal renderer - *Reason: renderer migration remains separate from layout ergonomics.*
- Full mobile bottom-sheet implementation or PWA install work - *Reason: Session 04 owns mobile and PWA foundation.*
- Migrating aliases and triggers out of cookies - *Reason: this session must not expand cookie use; broader automation persistence belongs with later automation work.*

---

## 5. Technical Approach

### Architecture

Keep UI wiring in `src/App.tsx`, but avoid adding another protocol interpretation layer there. Introduce a small pure helper in `shared/client-layout-preferences.ts` for layout preference defaults, parsing, serialization, and validation. React should consume this helper for safe `localStorage` reads and writes, with storage failures treated as non-fatal.

Refactor the sidebar markup into a single inspector panel whose tab metadata includes map and room views alongside the existing character, combat, group, inventory, affects, and quest panels. Keep the tab panel state explicit and preserve all existing display helper availability states. Use CSS classes for expanded, collapsed, and compact density modes rather than adding a new layout library.

### Design Patterns
- Pure preference contract: Validate browser-local layout preference data outside React before applying it.
- Progressive persistence: Prefer `localStorage` for secret-free layout choices and fall back to defaults when storage is unavailable or corrupt.
- Stable grid: Use CSS grid and flex constraints so terminal, HUD, and command input remain predictable.
- Explicit availability states: Preserve connected, waiting, disabled, offline, empty, and error distinctions in every panel.
- Behavior-only reference use: Study reference layouts for ergonomics without copying source or styles.

### Technology Stack
- React 19.2.5 for inspector state and rendering.
- TypeScript 6.0.2 for strict preference contracts.
- Vite 8.0.10 for frontend build.
- Node test runner with `tsx` for layout preference helper tests.
- CSS for responsive terminal-first layout and focus-visible inspector controls.

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `shared/client-layout-preferences.ts` | Typed layout preference defaults, parser, serializer, and validation helpers | ~110 |
| `tests/client-layout-preferences.test.ts` | Unit tests for defaulting, corrupt payloads, version handling, and storage-safe serialization | ~120 |
| `.spec_system/specs/phase03-session02-windows-and-layout-ergonomics/implementation-notes.md` | Reference notes, implementation evidence, responsive checks, and handoff notes | ~90 |
| `.spec_system/specs/phase03-session02-windows-and-layout-ergonomics/security-compliance.md` | Security, privacy, and license notes for layout persistence and reference use | ~55 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `src/App.tsx` | Consolidate inspector navigation, add persisted layout state, collapse/density controls, and keyboard/focus handling | ~180 |
| `src/App.css` | Add stable inspector grid, compact density, collapsed states, responsive rules, and focus-visible styling | ~180 |
| `tests/README.md` | Document layout preference tests and desktop, 390px, and 360px responsive smoke checks | ~25 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Map, room, character, combat, group, inventory, affects, and quest views are reachable from one inspector navigation surface.
- [ ] Command input remains visible and usable during normal desktop and narrow viewport play.
- [ ] Active inspector tab, collapsed state, and density persist locally without using cookies.
- [ ] Corrupt, unavailable, or denied browser storage falls back to defaults without breaking app startup.
- [ ] Keyboard navigation and visible focus states remain usable for inspector tabs and controls.

### Testing Requirements
- [ ] Unit tests cover layout preference defaults, valid payloads, invalid payloads, future versions, and missing fields.
- [ ] Manual responsive checks cover desktop, 390px, and 360px viewports.
- [ ] Existing panel and mapper tests remain passing.

### Non-Functional Requirements
- [ ] Terminal remains the largest active surface on desktop.
- [ ] No horizontal page scrolling at 390px or 360px smoke widths.
- [ ] No new runtime dependencies are introduced.
- [ ] No GPL reference code or styling is copied.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] `npm run test`, `npm run lint`, and `npm run build` pass or any failures are documented with cause.

---

## 8. Implementation Notes

### Key Considerations
- `src/App.tsx` already owns sidebar tab state, command focus recovery, settings menus, and map rendering. Keep the refactor local and test preference logic separately.
- The open cookie-storage finding means new layout persistence must use `localStorage` and must not store commands, host secrets, passwords, transcripts, aliases, or triggers.
- `EXAMPLES/mud-web-client` demonstrates terminal-plus-side-panel behavior and layout persistence ideas, but its Golden Layout implementation is out of scope and license-sensitive.
- The UX PRD resolves desktop persistence as a stable CSS grid plus persisted inspector width or collapsed state, not draggable panels.

### Potential Challenges
- Refactoring the sidebar can accidentally drop a panel availability state: Keep each existing render branch and move it under new tab plumbing without changing display helper contracts.
- Persisted browser state can become stale or corrupt: Normalize every payload and default unknown tabs or density values.
- Inspector collapse can hide useful status on small screens: Keep command input, status, and terminal behavior primary; make inspector controls explicit and reversible.
- Responsive CSS can create nested scrolling or horizontal overflow: Use min-width zero, bounded widths, internal scrolling, and viewport checks.

### Relevant Considerations
- [P02] **`src/App.tsx` panel wiring**: Keep extraction behind tests so UI wiring does not become a second parser.
- [P02] **Shared display helpers**: Split helpers only at clear contract boundaries.
- [P01] **Terminal renderer path**: Preserve escaped MUD text rendering before renderer or formatting changes.
- [P02] **Browser settings cookies**: Use `localStorage` for new layout preferences and avoid expanding cookie persistence.
- [P02] **Bounded fallback text**: Keep malformed and oversized protocol summaries from overwhelming narrow sidebars.
- [P02] **Source-confirmed versus override-only data**: Keep mapper and quest states explicit about live server data versus override-only fields.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Persisted layout state loading into an invalid or unreachable panel state.
- Inspector changes stealing focus from command input during active play.
- Narrow viewport rules hiding or covering the command form.

---

## 9. Testing Strategy

### Unit Tests
- Add `tests/client-layout-preferences.test.ts` for default preferences, valid saved payloads, unknown tabs, invalid density values, missing fields, future versions, and JSON parse failures.
- Run existing mapper and panel tests to confirm display helper contracts remain unchanged.

### Integration Tests
- Run the full existing Node test suite with `npm run test`.
- Run `npm run lint` and `npm run build` after implementation.

### Manual Testing
- Start the app and verify the default desktop layout with terminal, HUD, command input, and inspector.
- Switch every inspector tab, collapse and expand the inspector, change density, refresh, and verify local preferences restore safely.
- Check desktop, 390px, and 360px widths for no horizontal scroll and no command input obstruction.
- Verify focus returns to command input after tab clicks, inspector control clicks, settings close, and terminal click when connected.

### Edge Cases
- `localStorage` contains malformed JSON.
- `localStorage` contains a removed or unknown tab id.
- `localStorage` throws on read or write.
- Inspector is collapsed before refresh.
- Active tab content has long raw fallback text.
- User switches tabs while disconnected, connecting, connected, and error states are visible.

---

## 10. Dependencies

### External Libraries
- No new runtime libraries expected.
- Existing React, TypeScript, Vite, and Node test runner tooling are sufficient.

### Other Sessions
- **Depends on**: `phase02-session01-core-hud-and-character-panel`, `phase02-session02-combat-and-action-economy-panel`, `phase02-session03-group-panel`, `phase02-session04-affects-and-inventory-panels`, `phase02-session05-room-context-panel`, `phase02-session06-map-and-quest-fallback-strategy`, `phase03-session01-mapper-ux-reference-implementation`
- **Depended by**: `phase03-session03-alias-macro-and-trigger-ux`, `phase03-session04-mobile-and-pwa-foundation`

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
