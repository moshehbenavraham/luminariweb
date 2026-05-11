# Session 01: Core HUD and Character Panel

**Session ID**: `phase02-session01-core-hud-and-character-panel`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Make core resource and character data complete, source-aligned, and readable across desktop and mobile layouts.

---

## Scope

### In Scope (MVP)

- Render health, PSP, movement, XP/TNL, AC, attack bonus, money, position, level, race, and class from confirmed MSDP state.
- Normalize numeric values consistently before display.
- Add deliberate unavailable states for non-emitted or optional fields.
- Improve compact HUD and character display behavior for small viewports.
- Add or update focused tests for state mapping and display helpers where practical.

### Out of Scope

- Combat opponent/tank UI beyond preserving existing state.
- Group, affects, inventory, room, map, or quest panel implementation.
- Source-level MSDP variable additions.
- Full terminal renderer migration.

---

## Prerequisites

- [ ] Phase 02 PRD artifacts exist.
- [ ] Phase 00 state-mapping tests are available for extension.
- [ ] Confirmed character/resource MSDP variables remain documented in the master PRD.

---

## Deliverables

1. Source-aligned core HUD and character panel rendering.
2. Consistent numeric normalization for displayed character/resource fields.
3. Explicit unavailable states for unsupported or non-emitted fields.
4. Desktop and 390px mobile readability checks documented in implementation notes.

---

## Success Criteria

- [ ] Confirmed character/resource fields render from MSDP state.
- [ ] Optional fields fail gracefully without implying broken client behavior.
- [ ] HUD remains readable at desktop and 390px mobile width.
- [ ] Relevant lint, build, and focused tests pass or any residual failures are documented.
