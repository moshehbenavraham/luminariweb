# Session 03: Missing MSDP Variables

**Session ID**: `phase04-session03-missing-msdp-variables`
**Status**: Not Started
**Estimated Tasks**: ~18-24
**Estimated Duration**: 2-4 hours

---

## Objective

Select and implement only the smallest safe MSDP variable additions that are source-owned, testable, and directly useful to current Luminari Web panels.

---

## Scope

### In Scope (MVP)

- Evaluate `QUEST_INFO`, `TITLE`, `FORTITUDE`, `REFLEX`, `WILLPOWER`, live `DAMAGE_BONUS`, and live `MINIMAP` against audit results and harness readiness.
- Select a narrow variable set that fits one session and defer the rest explicitly.
- Define payload contracts, source emission points, and older-server fallback behavior for selected variables.
- Update source docs and Luminari Web mappings or fixtures for selected variables.
- Preserve explicit unavailable states when connected to older servers or unselected variables.

### Out of Scope

- Free-form quest command-output parsing.
- Implementing every desired missing variable in one session.
- Treating synthetic client fixtures as proof of live source support.
- Storing quest, command, host, transcript, or credential data in browser-local configuration.

---

## Prerequisites

- [ ] Session 01 ranks missing MSDP variables as accepted, deferred, or rejected candidates.
- [ ] Session 02 provides enough validation coverage for selected source changes.
- [ ] Quest payload shape is approved before structured quest data is emitted.
- [ ] Client fallbacks for older servers remain documented and testable.

---

## Deliverables

1. Selected MSDP variable contract or explicit deferral list.
2. Source emission, documentation, and validation updates for selected variables.
3. Luminari Web mapping, fixture, and fallback updates needed to consume selected variables safely.

---

## Success Criteria

- [ ] Selected variables are emitted by Luminari-Source and consumed by Luminari Web.
- [ ] Unselected variables remain documented as deferred or rejected.
- [ ] Older-server fallback behavior still works and remains visible to users.
- [ ] Quest support, if selected, uses structured server data and not free-form command-output scraping.
