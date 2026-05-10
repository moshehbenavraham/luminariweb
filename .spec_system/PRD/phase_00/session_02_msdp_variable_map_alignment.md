# Session 02: MSDP Variable Map Alignment

**Session ID**: `phase00-session02-msdp-variable-map-alignment`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Align requested client variables with confirmed Luminari-Source variables.

---

## Scope

### In Scope (MVP)

- Update default MSDP mappings to prioritize confirmed variables.
- Add state fields for `ROOM`, `ROOM_NAME`, `AREA_NAME`, `ROOM_EXITS`, `ROOM_VNUM`, `ACTIONS`, and `INVENTORY`.
- Remove or demote assumptions around `TITLE`, `QUEST_INFO`, saves, `MINIMAP`, and `DAMAGE_BONUS`.
- Preserve user-configurable overrides where they are still useful.

### Out of Scope

- Source-level Luminari-Source protocol changes.
- Quest command-output parsing.
- Full map, inventory, affects, or group UI implementation.
- Parser rewrites unrelated to variable mapping.

---

## Prerequisites

- [ ] Session 01 baseline findings are available.
- [ ] Confirmed MSDP variable list in the master PRD has been reviewed.
- [ ] Current default MSDP request and state mapping code has been identified.

---

## Deliverables

1. Source-aligned default MSDP request map.
2. Client state fields for confirmed room, action, and inventory data.
3. Fallback or demotion strategy for unsupported variables.
4. Settings normalization or migration behavior where needed.

---

## Success Criteria

- [ ] Default client requests match confirmed source variables.
- [ ] Unsupported values are not presented as guaranteed data.
- [ ] Existing settings migration or normalization avoids breaking saved settings.
- [ ] User-configurable overrides remain available where appropriate.
