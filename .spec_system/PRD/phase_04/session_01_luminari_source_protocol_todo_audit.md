# Session 01: Luminari-Source Protocol TODO Audit

**Session ID**: `phase04-session01-luminari-source-protocol-todo-audit`
**Status**: Not Started
**Estimated Tasks**: ~12-18
**Estimated Duration**: 2-4 hours

---

## Objective

Convert Luminari-Source protocol TODOs and known protocol gaps into a ranked backlog that is grounded in source facts, web client value, risk, and testability.

---

## Scope

### In Scope (MVP)

- Re-read `protocol.c`, `protocol.h`, `comm.c`, and protocol documentation in `/home/aiwithapex/projects/Luminari-Source`.
- Compare source TODOs and protocol gaps with Luminari Web needs from Phases 00-03.
- Rank source changes by player value, implementation risk, and validation approach.
- Identify work that should remain deferred or rejected.
- Map each accepted candidate to required source tests, client fixture updates, and fallback behavior.

### Out of Scope

- Implementing protocol behavior changes.
- Claiming support for MCCP, GMCP, live `MINIMAP`, `QUEST_INFO`, `TITLE`, saves, or `DAMAGE_BONUS`.
- Replacing the current Luminari Web proxy or `/ws` contract.

---

## Prerequisites

- [ ] Phase 03 protocol checklist is available and linked from maintainer docs.
- [ ] Local Luminari-Source checkout is readable.
- [ ] Any source facts copied into this repo are summarized, not copied as large source excerpts.

---

## Deliverables

1. Ranked source protocol backlog with rationale and risk notes.
2. Explicit defer or reject list for source protocol work that should not proceed yet.
3. Mapping from accepted candidates to web client value, required tests, and fallback expectations.

---

## Success Criteria

- [ ] Every ranked item cites source files or docs inspected during the audit.
- [ ] Accepted items have clear validation requirements before implementation.
- [ ] Deferred and rejected items explain why they are not safe or useful yet.
- [ ] Follow-up sessions can choose work without re-litigating the audit baseline.
