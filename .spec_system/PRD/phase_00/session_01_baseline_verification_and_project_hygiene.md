# Session 01: Baseline Verification and Project Hygiene

**Session ID**: `phase00-session01-baseline-verification-and-project-hygiene`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Establish a trusted baseline for the current app.

---

## Scope

### In Scope (MVP)

- Install or verify dependencies.
- Run lint and build.
- Record current failures, warnings, and environment assumptions.
- Fix only blocking hygiene issues that prevent baseline verification.
- Document repeatable local commands for future sessions.

### Out of Scope

- Feature behavior changes beyond required baseline fixes.
- Broad test-suite design.
- Terminal renderer replacement.
- Proxy security hardening.

---

## Prerequisites

- [ ] Master PRD is present at `.spec_system/PRD/PRD.md`.
- [ ] Project dependencies can be installed or are already present.
- [ ] Baseline source files are available in `src/`, `server/`, and `shared/`.

---

## Deliverables

1. Verified or documented dependency state.
2. Recorded lint and build results.
3. Minimal blocking hygiene fixes, if required.
4. Repeatable baseline verification commands.

---

## Success Criteria

- [ ] `npm run lint` passes or documented failures are converted into actionable follow-up work.
- [ ] `npm run build` passes or documented failures are converted into actionable follow-up work.
- [ ] The current app can be started in development.
- [ ] No feature behavior is changed beyond required baseline fixes.
