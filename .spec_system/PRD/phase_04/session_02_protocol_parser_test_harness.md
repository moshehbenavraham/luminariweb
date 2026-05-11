# Session 02: Protocol Parser Test Harness

**Session ID**: `phase04-session02-protocol-parser-test-harness`
**Status**: Complete
**Estimated Tasks**: ~15-22
**Estimated Duration**: 2-4 hours

---

## Objective

Create or document a focused Luminari-Source protocol validation harness so parser and negotiation behavior can be checked before protocol behavior changes are made.

---

## Scope

### In Scope (MVP)

- Identify the smallest practical local test strategy for C protocol code.
- Add or document validation for highest-risk protocol paths where feasible.
- Prepare fixtures or scripted cases for MSDP, GMCP, MCCP, MXP, NAWS, CHARSET, malformed input, doubled IAC, split IAC, and incomplete subnegotiation boundaries.
- Record the exact local command or manual procedure for running the harness.
- Keep Luminari Web client and proxy expectations aligned with source validation results.

### Out of Scope

- Broad protocol parser rewrites.
- Full coverage of unrelated game systems.
- Public claims that partial harness coverage proves full feature support.

---

## Prerequisites

- [x] Session 01 backlog identifies the highest-risk source protocol paths.
- [x] Local C build or test prerequisites are known or documented as blockers.
- [x] Validation data does not include commands, credentials, private hosts, or terminal transcripts.

---

## Deliverables

1. Source protocol validation harness, fixture set, or documented runnable procedure.
2. Maintainer command or checklist for repeating validation locally.
3. Notes linking harness coverage to future source protocol changes.

---

## Success Criteria

- [x] At least the highest-risk accepted protocol paths have automated, scripted, or documented validation.
- [x] Validation can be repeated without live private data.
- [x] Any unavailable test coverage is called out as a blocker or follow-up.
- [x] Future protocol implementation sessions have a safety net before behavior changes.

---

Completed on 2026-05-11. Validation passed and the repeatable source harness command is documented in `/home/aiwithapex/projects/Luminari-Source/docs/testing/PROTOCOL_PARSER_HARNESS.md`.
