# Session 03: Group Panel

**Session ID**: `phase02-session03-group-panel`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Make `GROUP` data useful for party play while handling missing or variant member fields safely.

---

## Scope

### In Scope (MVP)

- Parse known `GROUP` payload shapes into a display-friendly structure.
- Render member names, leader marker, health, movement, and relevant status values when present.
- Handle missing per-member fields without breaking row layout.
- Add tests or fixtures for representative group payloads.
- Keep group state separate from single-player character state.

### Out of Scope

- Party chat, invite, or leadership commands.
- Group combat automation.
- Source-level group payload changes.
- Mapper or room context work.

---

## Prerequisites

- [ ] Phase 00 fixture corpus is available.
- [ ] Existing MSDP parser handles table and array payloads for representative `GROUP` data.

---

## Deliverables

1. Normalized group payload handling.
2. Group panel rows that remain stable with partial data.
3. Fixture or mapping coverage for expected group variants.
4. Implementation notes documenting any unknown group fields.

---

## Success Criteria

- [ ] Group data renders consistently across expected payload variants.
- [ ] Missing values do not break row layout.
- [ ] Group rendering can be validated without live MUD access.
- [ ] Unknown fields are ignored or surfaced in a controlled debug-friendly way.
