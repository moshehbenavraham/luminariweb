# Session 05: State Mapping Tests

**Session ID**: `phase00-session05-state-mapping-tests`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Test mapping from MSDP variable and value pairs into client-visible state.

---

## Scope

### In Scope (MVP)

- Add focused tests around MSDP variable normalization.
- Add tests for mapping confirmed variables to `MudState`.
- Add tests for unsupported or unknown variables.
- Add tests for settings overrides.

### Out of Scope

- Full Telnet parser edge-case coverage.
- Proxy lifecycle and reconnect testing.
- Browser-level visual regression testing.
- Source-level protocol tests.

---

## Prerequisites

- [ ] Session 02 variable alignment behavior is implemented.
- [ ] Session 04 fixture corpus is available.
- [ ] Test command and framework choices from Session 01 are documented.

---

## Deliverables

1. Focused variable normalization tests.
2. MSDP-to-client-state mapping tests for confirmed values.
3. Safe handling tests for unknown and unsupported values.
4. Settings override tests and documented test commands.

---

## Success Criteria

- [ ] Confirmed variables map to expected client state.
- [ ] Unknown variables are ignored safely.
- [ ] Unsupported default assumptions are captured by tests.
- [ ] Test commands are documented.
