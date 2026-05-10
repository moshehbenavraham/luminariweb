# Task Checklist

**Session ID**: `phase00-session05-state-mapping-tests`
**Total Tasks**: 20
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
| Implementation | 7 | 7 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (4 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0005] Verify Session 01-04 completion, current `node:test` support, fixture corpus availability, and no-test-runner baseline (`.spec_system/specs/phase00-session05-state-mapping-tests/implementation-notes.md`)
- [x] T002 [S0005] [P] Create implementation notes scaffold with command output, mapping extraction decisions, fixture coverage, and follow-up sections (`.spec_system/specs/phase00-session05-state-mapping-tests/implementation-notes.md`)
- [x] T003 [S0005] [P] Create security compliance notes for fixture-only tests, no live secrets, unknown-variable safety, and unchanged proxy exposure (`.spec_system/specs/phase00-session05-state-mapping-tests/security-compliance.md`)
- [x] T004 [S0005] Add `npm test` script using `node --import tsx --test tests/*.test.ts` without adding runtime dependencies (`package.json`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T005 [S0005] Create shared MSDP state-mapping module with configured-variable filtering and variable-key resolution (`shared/msdp-state.ts`)
- [x] T006 [S0005] Move scalar, structured, list-like, and exhaustive mapping helpers into the shared module with unchanged conversion behavior (`shared/msdp-state.ts`)
- [x] T007 [S0005] Update proxy server to import shared MSDP mapping helpers without changing connection, parser, or WebSocket behavior (`server/index.ts`)
- [x] T008 [S0005] [P] Create fixture loader helper that reads manifest-listed files and validates expected pair shapes without live MUD access (`tests/helpers/msdp-fixtures.ts`)
- [x] T009 [S0005] [P] Document test command scope, fixture use, and what parser/proxy coverage remains deferred (`tests/README.md`)

---

## Implementation (7 tasks)

Main feature implementation.

- [x] T010 [S0005] Write variable-map tests for source-backed defaults, override-only blanks, invalid input fallback, trimming, and user override preservation (`tests/msdp-variable-map.test.ts`)
- [x] T011 [S0005] Write configured-variable tests for blank filtering and duplicate-trigger prevention in outbound MSDP request lists (`tests/msdp-variable-map.test.ts`)
- [x] T012 [S0005] Write scalar state-mapping tests for metadata, character, resources, combat, money, position, zero values, and nonnumeric numeric failures (`tests/msdp-state-mapping.test.ts`)
- [x] T013 [S0005] Write structured mapping tests for room, exits, actions, inventory, affects, group, and quest override payloads without lossy coercion (`tests/msdp-state-mapping.test.ts`)
- [x] T014 [S0005] Write safety tests for unknown variables, blank configured mappings, unsupported defaults, and explicit settings overrides at the mapping boundary (`tests/msdp-state-mapping.test.ts`)
- [x] T015 [S0005] Write fixture-driven tests that load every manifest file and map configured expected pairs into `MudState` partials (`tests/msdp-fixture-mapping.test.ts`)
- [x] T016 [S0005] Update implementation notes with final helper boundaries, test case inventory, command documentation, and deferred parser/proxy coverage (`.spec_system/specs/phase00-session05-state-mapping-tests/implementation-notes.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0005] Run `npm test` and record focused mapping test results (`.spec_system/specs/phase00-session05-state-mapping-tests/implementation-notes.md`)
- [x] T018 [S0005] Run `npm run lint` and fix or document any lint issues from shared helpers and tests (`.spec_system/specs/phase00-session05-state-mapping-tests/implementation-notes.md`)
- [x] T019 [S0005] Run `npm run build` and verify server helper extraction preserves production build behavior (`.spec_system/specs/phase00-session05-state-mapping-tests/implementation-notes.md`)
- [x] T020 [S0005] Validate ASCII encoding, LF line endings, fixture-only test data boundaries, and scoped git diff before handoff (`.spec_system/specs/phase00-session05-state-mapping-tests/tasks.md`)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for the validate workflow step

---

## Next Steps

Run the validate workflow step to verify session completeness.
