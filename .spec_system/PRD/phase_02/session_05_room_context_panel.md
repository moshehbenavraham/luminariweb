# Session 05: Room Context Panel

**Session ID**: `phase02-session05-room-context-panel`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Show current room identity and exits using confirmed room variables while preserving terminal text as the primary room description.

---

## Scope

### In Scope (MVP)

- Request and map `ROOM`, `ROOM_NAME`, `AREA_NAME`, `ROOM_EXITS`, and `ROOM_VNUM` if any are still missing from defaults.
- Render room name, area, vnum, and exits when available.
- Preserve terminal room text as the primary descriptive source.
- Add raw/debug fallback behavior for uncertain room payload shapes.
- Cover string, array, and table-like exit payloads where practical.

### Out of Scope

- Full mapper behavior beyond current room context.
- Dependence on `MINIMAP`.
- Free-form room text parsing.
- Source-level room payload changes.

---

## Prerequisites

- [ ] Confirmed room variables remain documented in the master PRD.
- [ ] Existing MSDP mapping helpers can be extended without parser rewrites.

---

## Deliverables

1. Room context panel for room name, area, vnum, and exits.
2. Mapping/default request updates for confirmed room variables, if needed.
3. Exit display handling for representative payload shapes.
4. Tests or implementation notes for room data fallbacks.

---

## Success Criteria

- [ ] Room panel updates when room MSDP values change.
- [ ] Exit display handles strings, arrays, and table-like structures as needed.
- [ ] Room context does not depend on `MINIMAP`.
- [ ] Terminal room output remains the primary descriptive source.
