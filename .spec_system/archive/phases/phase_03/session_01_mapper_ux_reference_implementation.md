# Session 01: Mapper UX Reference Implementation

**Session ID**: `phase03-session01-mapper-ux-reference-implementation`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Evolve the minimal room map into a more useful original mapper experience based on confirmed Luminari room and exit data.

---

## Scope

### In Scope (MVP)

- Study mapper behavior from `EXAMPLES/mud-web-client` as behavior-only reference input.
- Define a Luminari-safe mapper data model driven by `ROOM`, `ROOM_NAME`, `ROOM_VNUM`, `AREA_NAME`, and `ROOM_EXITS`.
- Add current-room highlighting and directional expansion where known exits are available.
- Preserve simple fallback rendering when room metadata is incomplete or malformed.
- Add or update tests for mapper normalization and bounded fallback output.
- Document license-sensitive reference use in implementation notes.

### Out of Scope

- Copying GPL reference code.
- Assuming live `MINIMAP` support.
- Persistent world-map storage across browser sessions.
- Server-side mapper or GMCP work.

---

## Prerequisites

- [ ] Phase 02 map and room fallback behavior is complete.
- [ ] License posture in `.spec_system/PRD/PRD.md` remains unchanged.
- [ ] Representative room and exit fixtures are available or updated during planning.

---

## Deliverables

1. Mapper data-model and display updates based on confirmed room variables.
2. Current-room and exit expansion behavior with explicit incomplete-data states.
3. Focused mapper tests or fixtures.
4. Implementation notes documenting original implementation and reference boundaries.

---

## Success Criteria

- [ ] Mapper remains useful with only room identity and exit data.
- [ ] Unknown, partial, and malformed room payloads do not break layout.
- [ ] Reference repository use is documented as behavioral inspiration only.
- [ ] Desktop and narrow-sidebar display remain readable.
