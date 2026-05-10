# Task Checklist

**Session ID**: `phase01-session02-msdp-tables-arrays-malformed-payloads`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-05-11

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
| Setup | 3 | 3 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 8 | 8 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0102] Verify Session 01 parser extraction and current test runner behavior (`server/telnet-parser.ts`)
- [x] T002 [S0102] Review existing structured fixture coverage and identify any payload token gaps (`tests/fixtures/msdp/manifest.json`)
- [x] T003 [S0102] Create implementation notes shell for normalization decisions and parser-risk tracking (`.spec_system/specs/phase01-session02-msdp-tables-arrays-malformed-payloads/implementation-notes.md`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0102] Extend fixture type definitions to expose `payloadTokens` with fixture-id-aware validation (`tests/helpers/msdp-fixtures.ts`)
- [x] T005 [S0102] [P] Create MSDP payload token encoder for symbolic control tokens and UTF-8 string fragments (`tests/helpers/msdp-payload-encoder.ts`)
- [x] T006 [S0102] Add encoder validation for unknown tokens and unsupported payload values with schema-validated input and explicit error mapping (`tests/helpers/msdp-payload-encoder.ts`)
- [x] T007 [S0102] [P] Create parser fixture test file that imports parser helpers without server startup side effects (`tests/msdp-parser-fixtures.test.ts`)
- [x] T008 [S0102] Document integer-only numeric normalization and explicit empty collection behavior (`.spec_system/specs/phase01-session02-msdp-tables-arrays-malformed-payloads/implementation-notes.md`)

---

## Implementation (8 tasks)

Main feature implementation.

- [x] T009 [S0102] Assert scalar and numeric-normalization fixture parsing against expected pairs (`tests/msdp-parser-fixtures.test.ts`)
- [x] T010 [S0102] Assert array and empty collection fixture parsing with explicit empty values preserved (`tests/msdp-parser-fixtures.test.ts`)
- [x] T011 [S0102] Assert table and nested table fixture parsing with deterministic recursive output (`tests/msdp-parser-fixtures.test.ts`)
- [x] T012 [S0102] Assert mixed array/table, group, inventory, and affects parsing with types matching declared contract; exhaustive enum handling (`tests/msdp-parser-fixtures.test.ts`)
- [x] T013 [S0102] Assert malformed, truncated, empty-variable, incomplete-table, and incomplete-array fixtures with no-throw handling for malformed payload tokens (`tests/msdp-parser-fixtures.test.ts`)
- [x] T014 [S0102] Add boundary coverage for valid variables after malformed structured values with stale-output prevention (`tests/msdp-parser-fixtures.test.ts`)
- [x] T015 [S0102] Apply minimal parser fixes for structured or malformed payload gaps with schema-validated input and explicit error mapping (`server/telnet-parser.ts`)
- [x] T016 [S0102] Assert parser-produced structured values still feed Phase 00 state mapping without lossy coercion (`tests/msdp-parser-fixtures.test.ts`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0102] [P] Update test documentation with structured MSDP parser fixture coverage and no-live-MUD constraints (`tests/README.md`)
- [x] T018 [S0102] Run `npm test` and fix parser or fixture regressions without weakening existing coverage (`tests/msdp-parser-fixtures.test.ts`)
- [x] T019 [S0102] Run `npm run lint` and `npm run build`, fixing import and type regressions (`server/telnet-parser.ts`)
- [x] T020 [S0102] Validate ASCII/LF output and record deferred parser risks (`.spec_system/specs/phase01-session02-msdp-tables-arrays-malformed-payloads/implementation-notes.md`)

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

Run the implement workflow step to begin AI-led implementation.
