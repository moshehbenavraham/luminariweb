# Session 06: Map and Quest Fallback Strategy

**Session ID**: `phase02-session06-map-and-quest-fallback-strategy`
**Status**: Complete
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours
**Validated**: 2026-05-11

---

## Objective

Implement first usable map behavior from reliable room data and make quest data explicitly unavailable until a structured server variable exists.

---

## Scope

### In Scope (MVP)

- Build a minimal room/exits map from confirmed room variables.
- Use `MINIMAP` only if live population is confirmed during the session.
- Keep the quest panel as unavailable or optional-data unless a structured quest MSDP variable is present.
- Do not parse free-form quest command output.
- Record the selected structured quest MSDP work for Phase 04.

### Out of Scope

- Full mapper UX from reference clients.
- Source-level quest variable implementation.
- Free-form command-output scraping for quests.
- GMCP or native WebSocket protocol changes.

---

## Prerequisites

- [x] Session 05 room context data is implemented and its normalized room/exits helpers are available.
- [x] Quest support decision from the master PRD remains current.
- [x] Any `MINIMAP` live-support evidence is documented before it is used.

---

## Deliverables

1. Minimal map panel based on reliable room and exit data.
2. Quest panel unavailable or optional-data state aligned with source facts.
3. Phase 04 follow-up note for structured quest MSDP work.
4. Validation notes for map behavior and quest fallback messaging.

---

## Success Criteria

- [x] Map panel has a useful first version based on reliable data.
- [x] Quest panel states clearly that quest data is unavailable unless the server emits structured quest data.
- [x] Any required source-level quest work is recorded for Phase 04.
- [x] No free-form quest command output parsing is added.
