# Session 04: MSDP Fixture Corpus

**Session ID**: `phase00-session04-msdp-fixture-corpus`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Create representative MSDP parser fixtures for confirmed Luminari data shapes.

---

## Scope

### In Scope (MVP)

- Collect or synthesize fixtures for scalar values, arrays, tables, nested table data, group data, affects data, inventory data, room data, and malformed payloads.
- Store fixtures in a test-friendly location.
- Document which fixtures are real captures versus constructed examples.
- Include source facts that explain expected parser output.

### Out of Scope

- Live MUD capture tooling unless already available and low risk.
- Full parser hardening.
- UI rendering changes.
- Luminari-Source protocol changes.

---

## Prerequisites

- [ ] Confirmed variable list and payload assumptions are available from the master PRD.
- [ ] Session 01 has identified baseline commands and test tooling constraints.
- [ ] Fixture storage location has been chosen.

---

## Deliverables

1. Small versioned MSDP fixture files.
2. Expected parsed output for each fixture.
3. Notes that distinguish real captures from constructed examples.
4. Source-fact references for expected values.

---

## Success Criteria

- [ ] Fixture files are small, readable, and versioned.
- [ ] Each fixture has expected parsed output.
- [ ] Later parser tests can use the fixtures without live MUD access.
- [ ] Malformed payload fixtures are included without causing test harness crashes.
