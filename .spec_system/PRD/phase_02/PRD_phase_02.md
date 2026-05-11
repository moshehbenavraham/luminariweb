# PRD Phase 02: Build Luminari Game Panels

**Status**: In Progress
**Sessions**: 6
**Estimated Duration**: 3-6 days

**Progress**: 5/6 sessions (83%)

---

## Overview

Turn confirmed Luminari MSDP data into useful game UI panels while keeping fallbacks explicit for data that requires future server support. This phase builds player-facing HUD, character, combat, group, affects, inventory, room, map, and quest-unavailable workflows on top of the parser, mapping, resize, and proxy-safety foundations completed in earlier phases.

---

## Progress Tracker

| Session | Name | Status | Est. Tasks | Validated |
|---------|------|--------|------------|-----------|
| 01 | Core HUD and Character Panel | Complete | ~12-25 | 2026-05-11 |
| 02 | Combat and Action Economy Panel | Complete | ~12-25 | 2026-05-11 |
| 03 | Group Panel | Complete | ~12-25 | 2026-05-11 |
| 04 | Affects and Inventory Panels | Complete | ~12-25 | 2026-05-11 |
| 05 | Room Context Panel | Complete | ~12-25 | 2026-05-11 |
| 06 | Map and Quest Fallback Strategy | Not Started | ~12-25 | - |

---

## Completed Sessions

1. Session 01: Core HUD and Character Panel - complete on 2026-05-11
2. Session 02: Combat and Action Economy Panel - complete on 2026-05-11
3. Session 03: Group Panel - complete on 2026-05-11
4. Session 04: Affects and Inventory Panels - complete on 2026-05-11
5. Session 05: Room Context Panel - complete on 2026-05-11

---

## Upcoming Sessions

- Session 06: Map and Quest Fallback Strategy

---

## Objectives

1. Render confirmed Luminari character, combat, group, affects, inventory, room, and map data in source-aligned panels.
2. Keep non-emitted or uncertain values explicit with unavailable, optional, empty, or raw-debug fallback states.
3. Add focused fixture, mapping, and responsive coverage so panel work remains testable without requiring live MUD access.

---

## Prerequisites

- Phase 01 completed and archived.
- Phase 00 MSDP fixture and state-mapping foundations are available.
- Phase 01 parser, lifecycle, resize, renderer, and proxy-safety tests are available for regression checks.
- Luminari-Source remains the source of truth for emitted MSDP values.

---

## Technical Considerations

### Architecture

The codebase is a single React and Node TypeScript project. Phase 02 should prefer shared mapping helpers and fixture-backed normalization over broad UI rewrites. Keep panel data transformations testable and avoid pulling parser, proxy, or renderer concerns back into `src/App.tsx`.

### Technologies

- TypeScript
- React 19
- Vite
- Shared MSDP mapping helpers
- Node.js proxy and Telnet parser tests
- CSS responsive layout checks

### Risks

- Structured MSDP payload shapes may vary across live servers: use fixtures and raw-debug fallbacks before committing to rigid renderers.
- `MINIMAP`, `QUEST_INFO`, `DAMAGE_BONUS`, `TITLE`, and saves are not reliable emitted values today: keep UI states honest and do not imply broken client behavior.
- Mobile panel density can crowd the terminal-first workflow: validate HUD and primary panels at 390px and smoke-check 360px when layout changes.
- Browser settings, aliases, and triggers still persist in cookies: avoid adding sensitive or larger persisted panel preferences until the storage finding is remediated.

### Relevant Considerations

- [P01] **`src/App.tsx` concentration**: Avoid broad UI refactors until renderer selection, resize observation, and command-shell wiring remain covered.
- [P01] **Cookie-based client state**: Move settings to localStorage or IndexedDB before adding sensitive preferences or larger payloads.
- [P01] **Fixture-backed tests worked**: Use deterministic fixtures for panel payloads instead of depending on live MUD access.
- [P01] **Renderer fallback remains in service**: Preserve escaped HTML renderer invariants while building panel UI.
- [P00-SEC-002] **Browser settings are stored in cookies**: Do not expand persisted settings scope without addressing cookie transport exposure.

---

## Success Criteria

Phase complete when:
- [ ] All 6 sessions completed
- [ ] HUD and character panels render confirmed source-aligned MSDP fields.
- [ ] Combat, group, affects, inventory, and room panels handle empty, partial, list, and table-like payloads safely.
- [ ] Map behavior uses reliable room and exit data and does not depend on unconfirmed `MINIMAP` population.
- [ ] Quest UI clearly communicates unavailable structured quest data unless the server emits it.
- [ ] Relevant parser, mapping, fixture, lint, build, and mobile smoke checks are documented before phase close.

---

## Dependencies

### Depends On

- Phase 01: Harden Terminal and Proxy
- Phase 00: Align With Real Luminari Data

### Enables

- Phase 03: Borrow the Best Ideas
- Phase 04: Source-Level Protocol Path
