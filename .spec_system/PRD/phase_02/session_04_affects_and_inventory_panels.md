# Session 04: Affects and Inventory Panels

**Session ID**: `phase02-session04-affects-and-inventory-panels`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Render temporary effects and inventory data from structured MSDP values with useful fallbacks for uncertain payload shapes.

---

## Scope

### In Scope (MVP)

- Normalize `AFFECTS` table and array payloads.
- Render affects with names, durations, modifiers, or raw fallback fields as available.
- Normalize `INVENTORY` payloads once shape is confirmed by fixture or source facts.
- Render inventory with useful grouping or a controlled raw-structure fallback.
- Add fixtures for empty, list, table, and unknown-field variants.

### Out of Scope

- Inventory command automation.
- Drag-and-drop equipment management.
- Source-level inventory or affect variable changes.
- Mapper, room, or quest behavior.

---

## Prerequisites

- [ ] MSDP parser table and array behavior is covered by tests.
- [ ] Representative affects and inventory fixtures are available or can be safely constructed.

---

## Deliverables

1. Affects normalization and panel rendering.
2. Inventory normalization and panel rendering.
3. Empty, partial, and unknown-field fallback states.
4. Fixture coverage for representative affects and inventory payloads.

---

## Success Criteria

- [ ] Affects and inventory panels handle empty, list, and table data.
- [ ] Unknown fields are visible enough for debugging without overwhelming players.
- [ ] Fixtures cover representative payloads.
- [ ] Panel layout remains usable with long item or affect names.
