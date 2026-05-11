# Session 02: Combat and Action Economy Panel

**Session ID**: `phase02-session02-combat-and-action-economy-panel`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Expose opponent, tank, and action state in a dedicated combat panel without relying on unconfirmed damage-bonus data.

---

## Scope

### In Scope (MVP)

- Render opponent and tank names and health from confirmed combat MSDP fields.
- Parse and display `ACTIONS` once its payload shape is confirmed by fixture or source facts.
- Keep combat state visually distinct from general character state.
- Keep empty combat state quiet and non-alarming.
- Add fixture or mapping coverage for action payload behavior.

### Out of Scope

- Free-form combat log parsing.
- Live combat automation.
- Damage bonus display as a guaranteed value unless live emission is confirmed.
- Group member combat state, which belongs to Session 03.

---

## Prerequisites

- [ ] Session 01 completed or its shared display helpers are available.
- [ ] Representative combat and `ACTIONS` payload examples are available or can be constructed from source facts.

---

## Deliverables

1. Combat panel for opponent and tank state.
2. Action economy rendering for confirmed `ACTIONS` payload shapes.
3. Empty and partial combat states that do not reset unrelated panels.
4. Fixture or mapping coverage for combat/action state.

---

## Success Criteria

- [ ] Combat state updates without full page or panel resets.
- [ ] Empty combat state is visually quiet.
- [ ] `ACTIONS` rendering is covered by fixture or mapping tests.
- [ ] `DAMAGE_BONUS` is not presented as reliable unless live support is confirmed.
