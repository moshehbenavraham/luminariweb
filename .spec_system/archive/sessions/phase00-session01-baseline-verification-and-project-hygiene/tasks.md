# Task Checklist

**Session ID**: `phase00-session01-baseline-verification-and-project-hygiene`
**Total Tasks**: 21
**Estimated Duration**: 3-4 hours
**Created**: 2026-05-10

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[SNNMM]` = Session reference (NN=phase number, MM=session number)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 4 | 4 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 8 | 8 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **21** | **21** | **0** |

---

## Setup (4 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0001] Verify Node, npm, and dependency install state, then record exact versions and blockers (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)
- [x] T002 [S0001] [P] Review npm scripts and package metadata for the baseline quality gate contract (`package.json`)
- [x] T003 [S0001] [P] Review documented development commands and ports for baseline accuracy (`docs/development.md`)
- [x] T004 [S0001] Create the baseline implementation notes scaffold with command, result, blocker, and follow-up sections (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)

---

## Foundation (5 tasks)

Core baseline checks and classification before any edits.

- [x] T005 [S0001] Run production dependency audit and record vulnerability status without logging secrets (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)
- [x] T006 [S0001] Run `npm run lint` and record pass/fail output with affected files (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)
- [x] T007 [S0001] Run `npm run build` and record pass/fail output with affected files (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)
- [x] T008 [S0001] Inspect build output entrypoints when build succeeds, or document the missing-output blocker when it fails (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)
- [x] T009 [S0001] Classify each baseline failure as minimal hygiene, deferred follow-up, environment issue, or out-of-scope product work (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)

---

## Implementation (8 tasks)

Minimal baseline recording and directly blocking hygiene fixes only.

- [x] T010 [S0001] Apply minimal shared contract lint or type hygiene only if it directly blocks lint/build, preserving MSDP behavior (`shared/mud.ts`)
- [x] T011 [S0001] Apply minimal client lint or type hygiene only if it directly blocks lint/build, preserving terminal focus and UI behavior (`src/App.tsx`)
- [x] T012 [S0001] Apply minimal proxy lint or type hygiene only if it directly blocks lint/build, preserving WebSocket, Telnet, and `/health` behavior (`server/index.ts`)
- [x] T013 [S0001] Apply minimal configuration hygiene only if script or build config directly blocks baseline verification (`tsconfig.json`)
- [x] T014 [S0001] Amend development command documentation only if observed commands, ports, or health checks differ from the current guide (`docs/development.md`)
- [x] T015 [S0001] Capture unresolved follow-up items with affected files, severity, and recommended next session placement (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)
- [x] T016 [S0001] Record any intentionally skipped security or protocol findings as out-of-scope for this baseline session (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)
- [x] T017 [S0001] Confirm and record that no feature behavior changed beyond directly required hygiene fixes (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T018 [S0001] Start local development services long enough to verify `GET /health`, then stop started processes (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)
- [x] T019 [S0001] Verify the frontend dev URL responds or document the exact blocker and environment assumption (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)
- [x] T020 [S0001] Run final `npm run lint` and final `npm run build` after any hygiene fixes (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md`)
- [x] T021 [S0001] Validate ASCII and LF line endings for session artifacts, then review git diff for scoped changes (`.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/tasks.md`)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing or failures documented as actionable follow-up work
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for the validate workflow step

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
