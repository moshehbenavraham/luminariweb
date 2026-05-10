# Session 02: MSDP Tables, Arrays, and Malformed Payloads

**Session ID**: `phase01-session02-msdp-tables-arrays-malformed-payloads`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Harden structured MSDP parsing for tables, arrays, nested values, empty values, and malformed payloads.

---

## Scope

### In Scope (MVP)

- Add or extend fixtures for MSDP arrays, tables, nested data, and empty values.
- Test malformed MSDP payloads without unhandled exceptions.
- Validate parser output against expected fixture results.
- Define normalization behavior for numeric and string values where current behavior is ambiguous.
- Keep changes compatible with the Phase 00 state-mapping tests.

### Out of Scope

- Adding new server-side MSDP variables.
- Free-form command-output parsing.
- UI panel redesign.
- xterm.js migration work.

---

## Prerequisites

- [ ] Session 01 completed or parser edge-case gaps are documented.
- [ ] Phase 00 MSDP fixture manifest is available.

---

## Deliverables

1. Structured MSDP fixtures and expected outputs.
2. Automated tests for arrays, tables, nested values, empty values, and malformed payloads.
3. Parser or normalization fixes needed for safe structured payload handling.

---

## Success Criteria

- [ ] Parser handles table and array fixtures correctly.
- [ ] Empty and nested values have documented expected behavior.
- [ ] Malformed payloads are ignored or partially parsed safely.
- [ ] No malformed fixture crashes the proxy or tests.
