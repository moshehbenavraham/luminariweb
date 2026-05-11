# Implementation Notes

**Session ID**: `phase04-session03-missing-msdp-variables`
**Started**: 2026-05-11 10:49
**Last Updated**: 2026-05-11 11:35

---

## Session Progress

| Metric | Value |
|--------|-------|
| Tasks Completed | 22 / 22 |
| Estimated Remaining | 0 hours |
| Blockers | 0 |

---

## Selected Variable Contract

| Variable | Decision | Contract | Older-Server Fallback |
|----------|----------|----------|-----------------------|
| `TITLE` | Selected | Read-only string, stripped of source color codes, empty string when unavailable. | Show title as unavailable unless a user override supplies a value. |
| `FORTITUDE` | Selected | Read-only signed integer from `compute_mag_saves(ch, SAVING_FORT, 0)`. | Show save as unavailable; do not infer from ability scores. |
| `REFLEX` | Selected | Read-only signed integer from `compute_mag_saves(ch, SAVING_REFL, 0)`. | Show save as unavailable; do not infer from ability scores. |
| `WILLPOWER` | Selected | Read-only signed integer from `compute_mag_saves(ch, SAVING_WILL, 0)`. | Show save as unavailable; do not infer from ability scores. |
| `MINIMAP` | Confirmed upstream | Read-only plain string from automap output after color stripping, empty string when unavailable. | Keep room/exits fallback when minimap is missing or empty. |
| `ALIGNMENT` | Confirmed upstream | Read-only text string from `get_align_by_num(GET_ALIGNMENT(ch))`. | Accept old numeric data during transition without breaking display. |
| `DAMAGE_BONUS` | Deferred | No live payload selected. Existing source damage helper path is side-effect-prone. | Keep unavailable or override-only. |
| `QUEST_INFO` | Deferred | No structured source quest schema exists. | Keep unavailable or override-only; do not parse free-form quest output. |

---

## Task Log

### 2026-05-11 - Session Start

**Environment verified**:
- [x] Spec system state resolved current session as `phase04-session03-missing-msdp-variables`
- [x] Required session directory present
- [x] Base prerequisite check passed for `.spec_system`, `jq`, and `git`
- [x] Monorepo package scope not applicable

---

### Task T001 - Verify branches and source commits

**Started**: 2026-05-11 10:49
**Completed**: 2026-05-11 10:49
**Duration**: 1 minute

**Notes**:
- Luminari Web is on `main` tracking `origin/main` at `ef1fadd`.
- Luminari Web had pre-existing spec-system working tree changes from session planning: `.spec_system/state.json` modified and the current session spec directory untracked.
- Luminari-Source is on `master` tracking `origin/master` at `0cd5036e`.
- Source commit `7dbddcd1` is present with subject `Added some MSDP support for the new web client.`
- Source HEAD `0cd5036e` is the Session 02 harness commit with `unittests/CuTest/test_protocol_parser.c`.

**Files Changed**:
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Created session implementation log and recorded repository state.

**BQC Fixes**:
- N/A - bookkeeping only.

---

### Task T002 - Run required tool prerequisite checks

**Started**: 2026-05-11 10:50
**Completed**: 2026-05-11 10:50
**Duration**: 1 minute

**Notes**:
- Spec-system tool check passed for `rg`, `node`, `npm`, `make`, and `gcc`.
- Tool versions: `ripgrep 15.1.0`, `node v24.14.0`, `npm 10.5.1`, `GNU Make 4.3`, `gcc 13.3.0`.
- No live host, character, transcript, command, credential, or private payload data was used.

**Files Changed**:
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded tool prerequisite evidence.

**BQC Fixes**:
- N/A - environment verification only.

---

### Task T003 - Create session stubs and external source inventory

**Started**: 2026-05-11 10:51
**Completed**: 2026-05-11 10:51
**Duration**: 1 minute

**Notes**:
- Created the security review stub and validation report stub for this session.
- Established the external source inventory that may be touched under `/home/aiwithapex/projects/Luminari-Source`.
- External source inventory: `src/protocol.h`, `src/protocol.c`, `src/comm.c`, `src/handler.c`, `unittests/CuTest/test_protocol_parser.c`, `docs/systems/MSDP_VARIABLES.md`, and `docs/systems/PROTOCOL_SYSTEMS.md`.

**Files Changed**:
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded session stubs and source inventory.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/security-compliance.md` - Created initial security and BQC review stub.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/validation.md` - Created initial validation report stub.

**BQC Fixes**:
- N/A - bookkeeping only.

---

### Task T004 - Audit selected MSDP table entries

**Started**: 2026-05-11 10:52
**Completed**: 2026-05-11 10:53
**Duration**: 1 minute

**Notes**:
- `TITLE`, `FORTITUDE`, `REFLEX`, and `WILLPOWER` are absent from `variable_t` and `VariableNameTable`.
- `DAMAGE_BONUS` is registered as a read-only number, but is not currently safe to promote because source emission is commented out.
- `MINIMAP` is already registered as a read-only string.
- `ALIGNMENT` is already registered as a read-only string in the current source tree, matching upstream `7dbddcd1`.
- `VariableNameTable` uses enum-index alignment checks in `ProtocolCreate`, so new rows must be inserted in the same order as enum entries.

**Files Changed**:
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded selected variable table audit.

**BQC Fixes**:
- Contract alignment: Confirmed table rows must match enum order before source changes are marked complete.

---

### Task T005 - Audit source emission paths

**Started**: 2026-05-11 10:53
**Completed**: 2026-05-11 10:54
**Duration**: 1 minute

**Notes**:
- `msdp_update()` emits `CHARACTER_NAME`, text `ALIGNMENT`, core stats, room fields, combat fields, and source-backed `MINIMAP`.
- `update_msdp_automap()` emits stripped plain text minimap data from `get_map_string()` and emits an empty string when the map is unavailable.
- `TITLE`, `FORTITUDE`, `REFLEX`, and `WILLPOWER` are not emitted yet.
- Existing score displays use `compute_mag_saves(ch, SAVING_FORT, 0)`, `compute_mag_saves(ch, SAVING_REFL, 0)`, and `compute_mag_saves(ch, SAVING_WILL, 0)`.
- `DAMAGE_BONUS` emission remains commented out because the source comment says `compute_hit_damage()` can send random messages; no side-effect-free source contract was proven during the audit.

**Files Changed**:
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded source emission audit.

**BQC Fixes**:
- Error information boundaries: Kept live damage bonus deferred rather than exposing a value from a side-effect-prone path.
- Contract alignment: Confirmed minimap and alignment are already source-owned before web promotion work.

---

### Task T006 - Define selected and deferred variable contract

**Started**: 2026-05-11 10:55
**Completed**: 2026-05-11 10:56
**Duration**: 1 minute

**Notes**:
- Added the Session 03 source contract update to the web protocol backlog.
- Selected `TITLE`, `FORTITUDE`, `REFLEX`, and `WILLPOWER` for source emission.
- Confirmed upstream source-backed `MINIMAP` and text `ALIGNMENT`.
- Kept `DAMAGE_BONUS` and `QUEST_INFO` deferred.
- Documented older-server fallbacks for selected variables without requiring live private data.

**Files Changed**:
- `docs/source-protocol-backlog.md` - Added Session 03 selected/deferred contract table and current source commit baseline.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded contract decision evidence.

**BQC Fixes**:
- Contract alignment: Documented exact payload types before source and web mapping changes.
- State freshness on re-entry: Preserved older-server fallback behavior for missing or empty source values.

---

### Task T007 - Update source protocol docs

**Started**: 2026-05-11 10:57
**Completed**: 2026-05-11 10:58
**Duration**: 1 minute

**Notes**:
- Updated source MSDP variable docs for text `ALIGNMENT`, `TITLE`, `FORTITUDE`, `REFLEX`, `WILLPOWER`, and plain source-backed `MINIMAP`.
- Documented that `DAMAGE_BONUS` remains table-reserved but live emission is deferred.
- Documented that structured quest data is not in the current source MSDP contract.

**Files Changed**:
- `/home/aiwithapex/projects/Luminari-Source/docs/systems/MSDP_VARIABLES.md` - Updated variable catalog and current contract notes.
- `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md` - Updated maintainer protocol summary and deferred boundaries.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded source documentation changes.

**BQC Fixes**:
- Contract alignment: Source docs now match the selected Session 03 web backlog contract.

---

### Task T008 - Record final selected set and older-server fallback policy

**Started**: 2026-05-11 10:59
**Completed**: 2026-05-11 10:59
**Duration**: 1 minute

**Notes**:
- Added the selected variable contract table to these implementation notes.
- Older-server policy is explicit: missing selected variables remain unavailable, empty `MINIMAP` falls back to room/exits, and numeric older `ALIGNMENT` stays tolerated by web normalization.

**Files Changed**:
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Added selected variable contract and fallback policy.

**BQC Fixes**:
- State freshness on re-entry: Re-entry to older servers keeps unavailable/fallback states explicit instead of treating missing source data as zero.
- Contract alignment: Session notes now match source and web backlog docs.

---

### Task T009 - Add selected source MSDP enum and table rows

**Started**: 2026-05-11 11:00
**Completed**: 2026-05-11 11:02
**Duration**: 2 minutes

**Notes**:
- Added `eMSDP_TITLE`, `eMSDP_FORTITUDE`, `eMSDP_REFLEX`, and `eMSDP_WILLPOWER`.
- Added matching `VariableNameTable` rows in enum order.
- Added explicit read-only bounds for the new rows: title length `0..MAX_VARIABLE_LENGTH`, saves `-1000..1000`.

**Files Changed**:
- `/home/aiwithapex/projects/Luminari-Source/src/protocol.h` - Added selected MSDP enum entries and comments.
- `/home/aiwithapex/projects/Luminari-Source/src/protocol.c` - Added explicit bounded table macros and selected variable rows.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded source table implementation.

**BQC Fixes**:
- Contract alignment: Kept enum and table order aligned so `ProtocolCreate()` validation remains valid.

---

### Task T010 - Emit title and saving throws from source update loop

**Started**: 2026-05-11 11:02
**Completed**: 2026-05-11 11:03
**Duration**: 1 minute

**Notes**:
- Added null-safe title emission in `msdp_update()`.
- Title values are copied into the existing bounded buffer and passed through `strip_colors()` before `MSDPSetString()`.
- Added signed integer save emissions for Fortitude, Reflex, and Willpower using `compute_mag_saves()` with modifier `0`.

**Files Changed**:
- `/home/aiwithapex/projects/Luminari-Source/src/comm.c` - Emitted selected title and saving throw variables.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded source emission implementation.

**BQC Fixes**:
- Failure path completeness: Null title data emits an empty string instead of dereferencing a missing pointer.
- Error information boundaries: Title source color codes are stripped before emitting to clients.

---

### Task T011 - Preserve damage and quest deferrals

**Started**: 2026-05-11 11:04
**Completed**: 2026-05-11 11:05
**Duration**: 1 minute

**Notes**:
- Updated web protocol docs so `DAMAGE_BONUS` remains deferred until a side-effect-free source helper exists.
- Kept `QUEST_INFO` deferred until a structured source-owned payload is designed.
- Updated `MINIMAP` status from speculative deferred work to source-confirmed with room/exits fallback still required.

**Files Changed**:
- `docs/source-protocol-backlog.md` - Updated deferred rows, candidate summary, follow-up map, and claim boundaries.
- `docs/protocol-feature-checklist.md` - Split selected additions from deferred MSDP fields.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded deferral documentation.

**BQC Fixes**:
- Contract alignment: Removed stale `MINIMAP` deferral language while keeping web fixture requirements.
- Failure path completeness: Kept damage and quest unsupported states documented instead of allowing ambiguous UI claims.

---

### Task T012 - Add source harness coverage for selected variables

**Started**: 2026-05-11 11:06
**Completed**: 2026-05-11 11:08
**Duration**: 2 minutes

**Notes**:
- Added a CuTest case that enables MSDP reporting for `TITLE`, `FORTITUDE`, `REFLEX`, and `WILLPOWER`.
- The test verifies default initialized values, uses `MSDPSetString()` and `MSDPSetNumber()`, runs `MSDPUpdate()`, and asserts emitted MSDP payload fragments.
- The test calls `harness_destroy()` on completion so protocol resources are released through the existing harness cleanup path.

**Files Changed**:
- `/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c` - Added selected MSDP variable report and set-helper coverage.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded source harness coverage.

**BQC Fixes**:
- Resource cleanup: The new harness case destroys protocol state on scope exit.
- Contract alignment: The emitted names and values are asserted at the MSDP byte-fragment level.

---

### Task T013 - Promote selected source-backed web mappings

**Started**: 2026-05-11 11:09
**Completed**: 2026-05-11 11:10
**Duration**: 1 minute

**Notes**:
- Promoted `title`, `fortitude`, `reflex`, `willpower`, and `minimap` to default MSDP mappings.
- Added the selected keys to the confirmed source-backed key list.
- Kept only `damageBonus` and `questInfo` in the override-only list.

**Files Changed**:
- `shared/mud.ts` - Updated default, confirmed, optional, and override-only MSDP variable groups.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded web mapping promotion.

**BQC Fixes**:
- Contract alignment: Default web requests now match the source-selected Session 03 variables.
- State freshness on re-entry: Deferred variables remain override-only and cannot be requested accidentally by defaults.

---

### Task T014 - Update character display availability copy

**Started**: 2026-05-11 11:11
**Completed**: 2026-05-11 11:12
**Duration**: 1 minute

**Notes**:
- Updated title and saving throw unavailable copy from future-server language to source-backed mapping-disabled language.
- Updated waiting copy to describe requested source data rather than override-only data.
- Preserved explicit empty, offline, and error states.

**Files Changed**:
- `shared/msdp-display.ts` - Updated source-backed title and save availability notices.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded character display copy updates.

**BQC Fixes**:
- Failure path completeness: Missing selected values still surface as waiting, disabled, empty, offline, or error states.
- Accessibility and platform compliance: Existing aria-label generation continues to include the updated notices.

---

### Task T015 - Update map display availability copy

**Started**: 2026-05-11 11:13
**Completed**: 2026-05-11 11:14
**Duration**: 1 minute

**Notes**:
- Updated live minimap copy from override-only wording to source-backed `MINIMAP` wording.
- Kept room/exits fallback logic unchanged when `MINIMAP` is missing or empty.
- Preserved disabled, loading, empty, offline, and error map states.

**Files Changed**:
- `shared/msdp-map-display.ts` - Updated map availability text for source-backed `MINIMAP`.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded map display copy updates.

**BQC Fixes**:
- Failure path completeness: Empty source `MINIMAP` remains a visible empty state and missing values still fall back to room/exits when available.
- Accessibility and platform compliance: Existing map aria labels continue to use the updated notices.

---

### Task T016 - Update synthetic MSDP fixtures

**Started**: 2026-05-11 11:15
**Completed**: 2026-05-11 11:18
**Duration**: 3 minutes

**Notes**:
- Added synthetic `TITLE`, `FORTITUDE`, `REFLEX`, and `WILLPOWER` fixture pairs to core scalar coverage.
- Kept `ALIGNMENT` as text in the character identity and core panel fixtures.
- Added a synthetic plain-text `MINIMAP` fixture and updated manifest counts.
- Updated fixture documentation so only `DAMAGE_BONUS` and `QUEST_INFO` remain excluded from source-backed fixture coverage.
- Verified edited fixture JSON parses successfully.

**Files Changed**:
- `tests/fixtures/msdp/core-scalars.json` - Added title and saving throw pairs to source-backed scalar fixtures.
- `tests/fixtures/msdp/room-and-exits.json` - Added source-backed minimap scalar fixture.
- `tests/fixtures/msdp/manifest.json` - Updated fixture totals, room fixture count, minimap coverage, and fixture id list.
- `tests/fixtures/msdp/README.md` - Updated coverage matrix, room fixture notes, and override-only exclusions.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded fixture updates.

**BQC Fixes**:
- Trust boundary enforcement: Fixture data remains synthetic and sanitized with no live commands, hosts, credentials, or player captures.
- Contract alignment: Expected pairs now match default web mappings for selected source-backed variables.

---

### Task T017 - Update focused mapping and display tests

**Started**: 2026-05-11 11:19
**Completed**: 2026-05-11 11:23
**Duration**: 4 minutes

**Notes**:
- Updated variable-map expectations for default `TITLE`, saves, and `MINIMAP`.
- Updated state-mapping tests so selected variables map by default and deferred `DAMAGE_BONUS` / `QUEST_INFO` remain ignored unless configured.
- Updated display tests for source-backed title/save loading and disabled-mapping states.
- Updated map tests for default source-backed `MINIMAP` and explicit disabled minimap behavior.
- Updated fixture mapping total to match the added minimap fixture.

**Files Changed**:
- `tests/msdp-variable-map.test.ts` - Updated default minimap normalization expectation.
- `tests/msdp-state-mapping.test.ts` - Added selected source-backed mapping assertions and deferred-variable coverage.
- `tests/msdp-display.test.ts` - Updated selected vs deferred display-state expectations.
- `tests/msdp-map-display.test.ts` - Updated live minimap default-mapping coverage.
- `tests/msdp-fixture-mapping.test.ts` - Updated manifest fixture total.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded focused test updates.

**BQC Fixes**:
- Contract alignment: Focused tests now match the selected source-backed default mappings.
- Failure path completeness: Tests keep disabled, loading, empty, fallback, and deferred override states distinct.

---

### Task T018 - Update protocol status and developer documentation

**Started**: 2026-05-11 11:24
**Completed**: 2026-05-11 11:29
**Duration**: 5 minutes

**Notes**:
- Updated protocol checklist and developer documentation for selected source-backed variables and deferred damage/quest boundaries.
- Updated protocol status source text and MSDP settings copy so title, saves, and minimap are no longer described as override-only.
- Updated architecture, API, shared, and test documentation to remove stale `MINIMAP` override-only language.
- Kept MCCP, GMCP, MXP, MSP, CHARSET, native WebSocket, and quest support claims conservative.

**Files Changed**:
- `docs/protocol-feature-checklist.md` - Updated selected and deferred MSDP status boundaries.
- `docs/development.md` - Updated developer protocol notes.
- `docs/ARCHITECTURE.md` - Updated high-level protocol support boundary.
- `docs/api/http-and-websocket.md` - Updated MSDP mapping and map/quest contract wording.
- `shared/protocol-feature-status.ts` - Updated protocol status source text for selected/deferred MSDP fields.
- `shared/README_shared.md` - Updated minimap display helper summary.
- `src/App.tsx` - Updated MSDP settings group copy and support notes.
- `tests/README.md` - Updated test coverage and manual-check language.
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded documentation updates.

**BQC Fixes**:
- Contract alignment: Documentation and UI status copy now match default mappings and fixture coverage.
- Error information boundaries: Deferred claims remain bounded to stable product-facing language.

---

### Task T019 - Run source parser harness

**Started**: 2026-05-11 11:30
**Completed**: 2026-05-11 11:31
**Duration**: 1 minute

**Notes**:
- Ran `make protocol-parser` in `/home/aiwithapex/projects/Luminari-Source/unittests/CuTest`.
- Result: pass, `OK (8 tests)`.
- GCC emitted existing warning categories in `protocol.c` for unused parameters, signedness comparisons, and missing initializers; none failed the harness target.

**Files Changed**:
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded source harness result.

**BQC Fixes**:
- N/A - verification task.

---

### Task T020 - Run focused web protocol tests

**Started**: 2026-05-11 11:31
**Completed**: 2026-05-11 11:32
**Duration**: 1 minute

**Notes**:
- Ran `node --import tsx --test tests/msdp-variable-map.test.ts tests/msdp-state-mapping.test.ts tests/msdp-display.test.ts tests/msdp-map-display.test.ts tests/msdp-fixture-mapping.test.ts tests/protocol-feature-status.test.ts`.
- Result: pass, 45 tests passed.

**Files Changed**:
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded focused web test results.

**BQC Fixes**:
- N/A - verification task.

---

### Task T021 - Run full Luminari Web test suite

**Started**: 2026-05-11 11:32
**Completed**: 2026-05-11 11:33
**Duration**: 1 minute

**Notes**:
- Ran `npm test`.
- Result: pass, 163 tests passed.

**Files Changed**:
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded full test suite result.

**BQC Fixes**:
- N/A - verification task.

---

### Task T022 - Run lint and build

**Started**: 2026-05-11 11:33
**Completed**: 2026-05-11 11:34
**Duration**: 1 minute

**Notes**:
- Ran `npm run lint`.
- Result: pass.
- Ran `npm run build`.
- Result: pass.
- Vite emitted the existing large chunk warning for `dist/client/assets/index-BmP4XiBL.js` at 759.69 kB after minification; this is a warning, not a build failure.

**Files Changed**:
- `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` - Recorded lint and build results.

**BQC Fixes**:
- N/A - verification task.

---

## Closeout Notes

- Security review finalized with PASS.
- Validation report finalized with PASS.
- Implementation summary created.
- ASCII and LF checks passed for changed files in both worktrees after converting pre-existing non-ASCII comments in `/home/aiwithapex/projects/Luminari-Source/src/protocol.h` to ASCII.
