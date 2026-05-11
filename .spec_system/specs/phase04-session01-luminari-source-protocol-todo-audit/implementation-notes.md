# Implementation Notes

**Session ID**: `phase04-session01-luminari-source-protocol-todo-audit`
**Started**: 2026-05-11 09:47
**Last Updated**: 2026-05-11 10:47

---

## Session Progress

| Metric | Value |
|--------|-------|
| Tasks Completed | 18 / 18 |
| Estimated Remaining | 0 hours |
| Blockers | 0 |

---

## Validation Summary

**Validated**: 2026-05-11

**Checks run**:
- `npm run lint` - passed.
- `npm run build` - passed with the existing Vite large-chunk warning only.
- Local link and path checks for the session backlog and protocol checklist - passed.
- ASCII and LF checks for the session deliverables - passed.

**Result**: Session validation passed. No unsupported protocol support claims were added.

---

## Task Log

### 2026-05-11 - Session Start

**Environment verified**:
- [x] Prerequisites confirmed
- [x] Tools available
- [x] Directory structure ready
- [x] Source checkout readable

**Commands run**:
- `bash .spec_system/scripts/analyze-project.sh --json`
- `bash .spec_system/scripts/check-prereqs.sh --json --env`
- `bash .spec_system/scripts/check-prereqs.sh --json --tools rg,npm`
- `git -C /home/aiwithapex/projects/Luminari-Source status --short`
- `git -C /home/aiwithapex/projects/Luminari-Source rev-parse --short HEAD`

---

### Task T001 - Verify Luminari-Source checkout readability and status

**Started**: 2026-05-11 09:47
**Completed**: 2026-05-11 09:48
**Duration**: 1 minute

**Notes**:
- Confirmed `/home/aiwithapex/projects/Luminari-Source` is readable.
- Recorded source checkout commit `60cbeff6`.
- `git status --short` returned no output, so the source checkout was clean at audit start.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T001 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded source checkout facts.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T002 - Inventory Phase 04 inputs and protocol handoff docs

**Started**: 2026-05-11 09:48
**Completed**: 2026-05-11 09:50
**Duration**: 2 minutes

**Notes**:
- Reviewed Phase 04 PRD and all five Phase 04 session stubs.
- Reviewed the Phase 03 protocol follow-up handoff and bridge deployment decision.
- Confirmed Session 01 must produce a backlog only; parser harness, MSDP additions, MCCP/GMCP decisions, and native WebSocket feasibility remain future sessions.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T002 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded Phase 04 input inventory.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T003 - Inventory protocol status and claim boundaries

**Started**: 2026-05-11 09:49
**Completed**: 2026-05-11 09:50
**Duration**: 1 minute

**Notes**:
- Reviewed `docs/protocol-feature-checklist.md`, `shared/protocol-feature-status.ts`, and protocol status tests.
- Confirmed current claim boundaries: MSDP, TTYPE, NAWS, UTF-8, and ANSI rendering have support claims; MCCP, MXP, and CHARSET are rejected; GMCP and MSP are deferred; MSSP and override-only MSDP fields remain validation gaps.
- Confirmed new backlog must not change unsupported feature claims.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T003 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded protocol claim boundaries.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T004 - Audit source protocol TODO and security backlog

**Started**: 2026-05-11 09:50
**Completed**: 2026-05-11 09:53
**Duration**: 3 minutes

**Notes**:
- Reviewed `/home/aiwithapex/projects/Luminari-Source/docs/project-management-zusuk/PROTOCOL_TODO.md`.
- Found the source TODO centers on protocol parser memory safety, bounds checking, unsafe string operations, allocation safety, null validation, error handling, and test/fuzz coverage.
- Treated TODO severity wording as audit input, but will rank by web client value, source risk, and validation readiness rather than copying the source TODO priority order verbatim.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T004 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded source TODO audit findings.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T005 - Audit source protocol tables and helpers

**Started**: 2026-05-11 09:53
**Completed**: 2026-05-11 10:04
**Duration**: 11 minutes

**Notes**:
- Reviewed `src/protocol.c` protocol variable table, negotiation, `ProtocolInput`, `MSDPSend*`, `ParseMSDP`, `ParseGMCP`, `SendMSSP`, and MCCP stubs.
- Confirmed `DAMAGE_BONUS` and `MINIMAP` exist in the variable table, but `DAMAGE_BONUS` emission is commented out in `comm.c` and no `MINIMAP` emission was found in audited protocol/update paths.
- Confirmed MCCP negotiation can call `CompressStart`/`CompressEnd`, but both functions are stubs, so it should remain rejected for the web client until source compression and proxy decompression exist.
- Confirmed GMCP is implemented as a fallback/transmission path and Mudlet package delivery path, not as a validated modern JSON module contract for Luminari Web.
- Confirmed parser hardening remains a high-risk prerequisite because `ProtocolInput` still has adjacent-byte reads around IAC and MXP parsing and several string-building paths still rely on fixed buffers.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T005 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded source protocol audit findings.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T006 - Audit protocol enums, structs, and declarations

**Started**: 2026-05-11 10:00
**Completed**: 2026-05-11 10:05
**Duration**: 5 minutes

**Notes**:
- Reviewed `src/protocol.h` protocol option constants, negotiated flags, `variable_t`, `protocol_t`, and public MSDP/MSSP/MXP helper declarations.
- Confirmed the header includes protocol error codes and documents calloc-style allocation, but `protocol.c` still uses `malloc` in key allocation paths, so docs and implementation do not fully align.
- Confirmed no enum entries exist for `TITLE`, `FORTITUDE`, `REFLEX`, `WILLPOWER`, or `QUEST_INFO`.
- Confirmed `eMSDP_MINIMAP` exists as a declared variable but needs an emission contract before the web client can request it by default.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T006 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded protocol header findings.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T007 - Audit MSDP emission paths

**Started**: 2026-05-11 10:04
**Completed**: 2026-05-11 10:07
**Duration**: 3 minutes

**Notes**:
- Reviewed `src/comm.c` `update_msdp_room()` and `msdp_update()` plus focused searches for update helpers in `actions.c`, `handler.c`, and `act.other.c`.
- Confirmed current emissions cover core character resources, ability scores, position, attack bonus, armor class, race/class, room identity/exits/sector table, opponent/tank state, affects, actions, group, and inventory.
- Confirmed `DAMAGE_BONUS` calculation is present only inside a commented-out block because `compute_hit_damage()` has side effects that must be addressed before live emission.
- Confirmed `TITLE`, saves, `QUEST_INFO`, and `MINIMAP` do not have matching live emission in the audited paths even where source docs or enums imply availability.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T007 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded MSDP emission findings.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T008 - Compare source docs with code findings

**Started**: 2026-05-11 10:07
**Completed**: 2026-05-11 10:12
**Duration**: 5 minutes

**Notes**:
- Reviewed `docs/systems/PROTOCOL_SYSTEMS.md` and `docs/systems/MSDP_VARIABLES.md` in the source checkout.
- Found source docs broadly describe MSDP/GMCP/MSSP/MXP/MSP/TTYPE/NAWS/CHARSET as implemented, but code-level support varies by feature and does not equal Luminari Web support.
- Found source docs list `MINIMAP`, `DAMAGE_BONUS`, and `WORLD_TIME`, but audited emission paths either do not emit them or need additional confirmation.
- Found a documentation mismatch on update frequency: protocol systems docs say every game pulse, while MSDP variables docs say once per second.
- Identified source doc link/path issues to cover in the web backlog: the MSDP variables "See Also" paths are relative to the source docs location and may not resolve as written.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T008 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded doc/code comparison findings.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T009 - Draft backlog structure

**Started**: 2026-05-11 10:12
**Completed**: 2026-05-11 10:15
**Duration**: 3 minutes

**Notes**:
- Created `docs/source-protocol-backlog.md` with evidence baseline, ranking rules, accepted, deferred, rejected, webclient-only, follow-up map, and claim-boundary sections.
- Kept support wording explicit: accepted candidates are future planning inputs, not current support claims.

**Files Changed**:
- `docs/source-protocol-backlog.md` - added backlog structure.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T009 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded backlog structure work.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T010 - Rank parser and security TODOs

**Started**: 2026-05-11 10:15
**Completed**: 2026-05-11 10:19
**Duration**: 4 minutes

**Notes**:
- Added ranked parser/security candidates A1-A4 to `docs/source-protocol-backlog.md`.
- Prioritized `ProtocolInput` boundary hardening and fixed-buffer response paths before broader allocation/error cleanup because they are highest risk for malformed client input.
- Required Session 02 source harness coverage before runtime protocol changes.

**Files Changed**:
- `docs/source-protocol-backlog.md` - added parser and security ranking table.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T010 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded parser/security ranking work.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T011 - Rank missing MSDP candidates

**Started**: 2026-05-11 10:19
**Completed**: 2026-05-11 10:25
**Duration**: 6 minutes

**Notes**:
- Added accepted MSDP candidates A5-A7 for `TITLE`, saves, and side-effect-free `DAMAGE_BONUS`.
- Deferred `MINIMAP`, `QUEST_INFO`, and `WORLD_TIME` contract cleanup until source payload contracts and fixtures exist.
- Preserved older-server fallback requirements for all missing variables.

**Files Changed**:
- `docs/source-protocol-backlog.md` - added missing MSDP candidate rankings and fallback notes.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T011 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded missing MSDP ranking work.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T012 - Rank protocol follow-ups without support-claim changes

**Started**: 2026-05-11 10:25
**Completed**: 2026-05-11 10:31
**Duration**: 6 minutes

**Notes**:
- Added O1-O9 rankings for MCCP, GMCP, native WebSocket, MXP, MSP, MSSP, CHARSET, TTYPE, and NAWS.
- Preserved current Luminari Web claims: MCCP/MXP/CHARSET remain rejected, GMCP/MSP/native WebSocket remain deferred, MSSP remains a validation gap, and TTYPE/NAWS remain supported with parser-harness follow-up.
- Added explicit rejected candidate boundaries for overclaiming current protocol support or replacing `/ws` with a blind bridge.

**Files Changed**:
- `docs/source-protocol-backlog.md` - added non-MSDP protocol rankings and rejected boundary table.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T012 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded protocol follow-up ranking work.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T013 - Map candidates to follow-up sessions

**Started**: 2026-05-11 10:31
**Completed**: 2026-05-11 10:34
**Duration**: 3 minutes

**Notes**:
- Added follow-up session map for Session 02 parser harness, Session 03 MSDP variables, Session 04 MCCP/GMCP decision, Session 05 native WebSocket feasibility, and future hardening/mapper/quest phases.
- Added candidate summary table that keeps current web claims separate from future source work.

**Files Changed**:
- `docs/source-protocol-backlog.md` - added follow-up session map and candidate summary.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T013 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded follow-up mapping work.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T014 - Link backlog from protocol checklist

**Started**: 2026-05-11 10:34
**Completed**: 2026-05-11 10:36
**Duration**: 2 minutes

**Notes**:
- Linked `docs/source-protocol-backlog.md` from the Phase 04 Inputs section of `docs/protocol-feature-checklist.md`.
- Preserved all existing unsupported feature boundaries and did not change any feature status.

**Files Changed**:
- `docs/protocol-feature-checklist.md` - added source backlog links under Phase 04 Inputs.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T014 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded checklist link work.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T015 - Review Markdown links and source references

**Started**: 2026-05-11 10:36
**Completed**: 2026-05-11 10:41
**Duration**: 5 minutes

**Notes**:
- Reviewed Markdown links in `docs/source-protocol-backlog.md` and `docs/protocol-feature-checklist.md`.
- Verified referenced Luminari Web docs, tests, and source-checkout files exist locally.
- Found and fixed a stale checklist link to the archived Phase 02 quest follow-up.
- Ran a Node link check for the modified docs; all Markdown links resolved.

**Files Changed**:
- `docs/protocol-feature-checklist.md` - corrected the archived quest follow-up link.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T015 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded link verification.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T016 - Run applicable quality gates

**Started**: 2026-05-11 10:41
**Completed**: 2026-05-11 10:43
**Duration**: 2 minutes

**Notes**:
- Ran `npm run lint`; it passed.
- Ran `npm run build`; it passed.
- Build emitted the existing Vite large-chunk warning for the main client bundle; no build failure occurred.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T016 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded quality gate results.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T017 - Validate ASCII encoding and LF line endings

**Started**: 2026-05-11 10:43
**Completed**: 2026-05-11 10:45
**Duration**: 2 minutes

**Notes**:
- Checked modified docs and session files for non-ASCII characters; none were found.
- Checked modified docs and session files for CRLF line endings; none were found.
- `file` reports the modified files as ASCII text.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T017 complete and updated progress.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded encoding and line-ending verification.

**BQC Fixes**:
- N/A - documentation-only task.

---

### Task T018 - Record implementation notes, commands, decisions, and follow-ups

**Started**: 2026-05-11 10:45
**Completed**: 2026-05-11 10:47
**Duration**: 2 minutes

**Notes**:
- Added final design decisions, verification summary, and remaining follow-ups.
- Confirmed implementation notes contain task logs for all checklist items.
- Final pass filled the webclient-only alternatives table and corrected the task checklist next step to point at validation.

**Files Changed**:
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` - marked T018 complete and checked completion checklist.
- `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` - recorded final implementation summary and follow-ups.

**BQC Fixes**:
- N/A - documentation-only task.

---

## Design Decisions

### Decision 1: Treat accepted candidates as future authorization, not support

**Context**: The source audit found declared or documented protocol features that are not current Luminari Web support.

**Options Considered**:
1. Mark source-declared features as supported in web docs - fast, but overclaims behavior.
2. Rank features as accepted, deferred, or rejected while preserving current support status - conservative and traceable.

**Chosen**: Option 2.
**Rationale**: Phase 04 requires source facts, tests, and fallback behavior before support claims change.

### Decision 2: Prioritize parser harness work before protocol behavior changes

**Context**: The source TODO and code audit found parser/security risk in high-traffic protocol paths.

**Options Considered**:
1. Start with missing MSDP variables because they have visible UI value.
2. Start with source parser and boundary validation because later work depends on safe protocol handling.

**Chosen**: Option 2.
**Rationale**: Parser harness coverage lowers risk for every later protocol change.

### Decision 3: Defer `MINIMAP` and `QUEST_INFO`

**Context**: `MINIMAP` is declared but no live emission was found, and `QUEST_INFO` is absent from the audited source variable table.

**Options Considered**:
1. Add both to the accepted Session 03 shortlist.
2. Defer both until payload contracts and fixtures exist.

**Chosen**: Option 2.
**Rationale**: Room/exits map fallback and explicit quest-unavailable states already preserve honest UX without brittle source assumptions.

## Verification Summary

**Commands run**:
- `node -e "<markdown link check>"` - all modified-doc Markdown links resolved.
- `npm run lint` - passed.
- `npm run build` - passed with Vite large-chunk warning only.
- `LC_ALL=C grep -nP '[^\\x00-\\x7F]' ...` - no non-ASCII output.
- `grep -n $'\\r' ...` - no CRLF output.
- `file ...` - modified docs and session files reported as ASCII text.
- Final `node -e "<markdown link check>"` after the webclient-only polish - all modified-doc Markdown links resolved.

## Remaining Follow-Ups

- Run the `validate` workflow step to verify session completeness.
- Use Session 02 to define source parser harness coverage before source behavior changes.
- Use Session 03 to decide whether `TITLE`, saves, and side-effect-free `DAMAGE_BONUS` fit the next implementation scope.
- Use Session 04 for MCCP and GMCP pursue/defer/reject decisions.
- Use Session 05 for native source WebSocket feasibility while preserving the integrated proxy as the supported app transport.
