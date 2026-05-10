# Session 01: Telnet Parser Edge-Case Tests

**Session ID**: `phase01-session01-telnet-parser-edge-case-tests`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Cover core Telnet parser edge cases before changing parser behavior.

---

## Scope

### In Scope (MVP)

- Add tests for split IAC sequences.
- Add tests for doubled IAC bytes.
- Add tests for subnegotiation boundaries.
- Add tests for malformed and partial MSDP payload boundaries.
- Add tests for text flush behavior around control bytes.
- Record any parser defects found during coverage work.

### Out of Scope

- Broad parser rewrites.
- Renderer migration.
- Proxy deployment policy changes.
- Live MUD integration testing.

---

## Prerequisites

- [ ] Phase 00 test commands still run locally.
- [ ] Existing fixture and parser test structure is understood.

---

## Deliverables

1. Focused Telnet parser edge-case tests.
2. Minimal parser fixes only where required to make the new tests pass.
3. Implementation notes listing any defects deferred to later sessions.

---

## Success Criteria

- [ ] Split IAC behavior is covered.
- [ ] Doubled IAC byte behavior is covered.
- [ ] Subnegotiation boundary behavior is covered.
- [ ] Text flush behavior around control bytes is covered.
- [ ] Tests do not require a live MUD.
