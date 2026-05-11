# Session Specification

**Session ID**: `phase04-session03-missing-msdp-variables`
**Phase**: 04 - Source-Level Protocol Path
**Status**: Implemented
**Created**: 2026-05-11

---

## 1. Session Overview

This session turns the Phase 04 MSDP backlog into a narrow source-backed contract for currently missing character and map variables. Session 01 accepted `TITLE`, `FORTITUDE`, `REFLEX`, and `WILLPOWER` as the safest first source additions, while Session 02 added the source parser harness needed before more protocol behavior changes are made.

The local Luminari-Source checkout now also includes upstream commit `7dbddcd1`, "Added some MSDP support for the new web client." That commit adds live `MINIMAP` emission and changes `ALIGNMENT` from numeric to text. Session 03 must verify and document those upstream changes, update Luminari Web fixtures and mappings where the source contract is now real, and avoid duplicating upstream source work.

The session must keep `QUEST_INFO` and live `DAMAGE_BONUS` conservative. Quest data remains deferred because no structured source payload contract exists. `DAMAGE_BONUS` remains deferred unless a side-effect-free calculation can be proven and tested within scope.

---

## 2. Objectives

1. Verify the current source contract for `MINIMAP`, text `ALIGNMENT`, and remaining missing MSDP variables against the latest Luminari-Source `master`.
2. Add or confirm source-owned `TITLE`, `FORTITUDE`, `REFLEX`, and `WILLPOWER` emission with explicit payload contracts and source validation coverage.
3. Update Luminari Web default mappings, fixtures, display copy, and protocol documentation for variables that are now source-backed.
4. Preserve explicit older-server fallbacks and defer `QUEST_INFO` and live `DAMAGE_BONUS` unless their contracts are safe and testable.

---

## 3. Prerequisites

### Required Sessions

- [x] `phase04-session01-luminari-source-protocol-todo-audit` - Ranks missing MSDP variables and claim boundaries.
- [x] `phase04-session02-protocol-parser-test-harness` - Provides source parser harness and maintainer test command.
- [x] `phase03-session06-protocol-feature-checklist` - Provides the conservative web protocol status contract.

### Required Tools/Knowledge

- `rg` for source and web protocol audits.
- `make` and `gcc` for the focused Luminari-Source CuTest target.
- `node --import tsx --test` for focused Luminari Web protocol tests.
- Knowledge of MSDP scalar variables, source `MSDPSetString` / `MSDPSetNumber`, and Luminari Web mapping defaults.

### Environment Requirements

- Luminari Web checkout at `/home/aiwithapex/projects/luminariweb`.
- Luminari-Source checkout at `/home/aiwithapex/projects/Luminari-Source`.
- Luminari-Source is based on `master` including upstream `7dbddcd1` and the Session 02 harness commit.
- Fixtures must remain synthetic and must not include commands, credentials, private hosts, tokens, character names from live players, or terminal transcripts.

---

## 4. Scope

### In Scope (MVP)

- Maintainer can see which missing MSDP candidates are selected, confirmed upstream, or deferred - document `TITLE`, saves, `MINIMAP`, `ALIGNMENT`, `DAMAGE_BONUS`, and `QUEST_INFO` decisions.
- Source emits selected character fields - add `TITLE`, `FORTITUDE`, `REFLEX`, and `WILLPOWER` table entries and update paths if they are still absent.
- Source `MINIMAP` and text `ALIGNMENT` are verified - use upstream source changes as existing implementation inputs, then update web docs and fixtures.
- Luminari Web consumes source-backed variables by default - update default MSDP mappings and tests for selected variables only.
- Older-server behavior remains explicit - disconnected, missing, empty, and unconfigured states stay distinct.

### Out of Scope (Deferred)

- Free-form quest command-output parsing - *Reason: brittle, private, and not a structured source contract.*
- Full quest `QUEST_INFO` payload design - *Reason: requires a separate source quest schema and fixtures.*
- Live `DAMAGE_BONUS` if only `compute_hit_damage()` is available - *Reason: current source comments note side effects from that path.*
- Full parser hardening for split IAC, short NAWS, or retained subnegotiation buffers - *Reason: Session 02 documents these as future parser-hardening work.*
- Public claim changes for MCCP, GMCP, MXP, MSP, CHARSET, native WebSocket, or MSSP - *Reason: later Phase 04 sessions decide those boundaries.*

---

## 5. Technical Approach

### Architecture

Treat Luminari-Source as the source contract and Luminari Web as the consumer. Source changes should be limited to protocol table entries, MSDP update emission, source docs, and focused harness coverage. Luminari Web changes should stay in shared protocol mappings, display helpers, fixtures, tests, and protocol documentation.

The web client should move only proven variables from override-only to source-backed defaults. `TITLE`, `FORTITUDE`, `REFLEX`, `WILLPOWER`, and upstream-confirmed `MINIMAP` are candidates. `QUEST_INFO` remains override-only and unavailable by default. `DAMAGE_BONUS` remains override-only unless implementation proves a side-effect-free source calculation.

### Design Patterns

- Source contract first: add source table/emission/docs before changing default web requests.
- Conservative promotion: only promote a variable to source-backed after source emission and web fixture coverage exist.
- Synthetic fixtures only: model representative payloads without live captures or private data.
- Fail-closed support claims: docs distinguish source support, web support, validation gaps, and deferred work.

### Technology Stack

- Luminari-Source C protocol code and CuTest harness.
- Luminari Web TypeScript shared protocol helpers and Node test runner.
- Markdown documentation in both repositories.

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `.spec_system/specs/phase04-session03-missing-msdp-variables/implementation-notes.md` | Session evidence, source commit facts, decisions, commands, and validation results. | ~120 |
| `.spec_system/specs/phase04-session03-missing-msdp-variables/security-compliance.md` | Security, privacy, and behavioral quality review. | ~60 |
| `.spec_system/specs/phase04-session03-missing-msdp-variables/validation.md` | Final validation report for updateprd. | ~80 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `/home/aiwithapex/projects/Luminari-Source/src/protocol.h` | Add selected MSDP enum entries if absent and document payload types. | ~10 |
| `/home/aiwithapex/projects/Luminari-Source/src/protocol.c` | Add selected variable table rows and keep type bounds explicit. | ~10 |
| `/home/aiwithapex/projects/Luminari-Source/src/comm.c` | Emit selected title and saving-throw values; verify upstream `MINIMAP` and text `ALIGNMENT` paths. | ~35 |
| `/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c` | Add protocol variable registration and set-helper coverage for selected fields. | ~80 |
| `/home/aiwithapex/projects/Luminari-Source/docs/systems/MSDP_VARIABLES.md` | Document selected variables, text alignment, and minimap contract. | ~35 |
| `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md` | Update maintainer protocol summary and boundaries. | ~25 |
| `shared/mud.ts` | Promote selected source-backed variables to defaults and confirmed keys while keeping deferred variables override-only. | ~25 |
| `shared/msdp-display.ts` | Update title and save availability copy from override-only to source-backed semantics. | ~30 |
| `shared/msdp-map-display.ts` | Update live `MINIMAP` wording from override-only to source-backed where default-mapped. | ~25 |
| `tests/fixtures/msdp/core-scalars.json` | Add source-backed title and save scalar fixtures. | ~90 |
| `tests/fixtures/msdp/room-and-exits.json` | Add source-backed minimap fixture coverage if default-mapped. | ~70 |
| `tests/fixtures/msdp/README.md` | Update coverage matrix and override-only exclusions. | ~30 |
| `tests/msdp-variable-map.test.ts` | Assert selected variables are default requested and deferred variables remain blank. | ~35 |
| `tests/msdp-state-mapping.test.ts` | Assert selected variables map by default and older override behavior remains safe. | ~45 |
| `tests/msdp-display.test.ts` | Update character display expectations for selected source-backed fields. | ~45 |
| `tests/msdp-map-display.test.ts` | Update minimap default, waiting, empty, and fallback expectations. | ~45 |
| `docs/source-protocol-backlog.md` | Record selected/deferred Session 03 decisions and upstream `MINIMAP` change. | ~45 |
| `docs/protocol-feature-checklist.md` | Update protocol status without overclaiming deferred features. | ~30 |
| `docs/development.md` | Update developer protocol notes for selected variables. | ~15 |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Source contract includes or verifies `TITLE`, `FORTITUDE`, `REFLEX`, `WILLPOWER`, `MINIMAP`, and text `ALIGNMENT` with explicit types.
- [ ] Luminari Web requests and maps only source-backed selected variables by default.
- [ ] `QUEST_INFO` remains unavailable or override-only by default with no free-form command parsing.
- [ ] `DAMAGE_BONUS` remains deferred unless a side-effect-free calculation and tests are added.
- [ ] Older servers that do not emit selected variables still show explicit waiting, unavailable, empty, or fallback states.

### Testing Requirements

- [ ] Source protocol harness target is run or blockers are documented.
- [ ] Focused web mapping, display, fixture, and map tests pass.
- [ ] Full `npm test` passes.
- [ ] `npm run lint` and `npm run build` pass or blockers are documented.

### Non-Functional Requirements

- [ ] Fixture data is synthetic and privacy-safe.
- [ ] Protocol claims remain evidence-backed and do not infer unsupported features.
- [ ] Source changes are limited to protocol contract/emission/test/docs paths.
- [ ] Web display copy remains concise on narrow widths.

### Quality Gates

- [ ] All spec-system files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows Luminari Web and Luminari-Source conventions.

---

## 8. Implementation Notes

### Key Considerations

- Upstream source commit `7dbddcd1` already adds `MINIMAP` emission and changes `ALIGNMENT` to string. Implementation must verify that behavior and adjust web defaults/docs instead of re-implementing it.
- `TITLE` should use source player title data with an empty string when no title is available.
- Saving throws should use the same source calculation displayed in character information, likely `compute_mag_saves(ch, SAVING_FORT/REFL/WILL, 0)`, unless the implementation audit finds a better source contract.
- `DAMAGE_BONUS` should not call `compute_hit_damage()` from periodic MSDP updates while the source comment warns that it can send messages.

### Potential Challenges

- Adding enum entries can shift source protocol table indexes: verify `VariableNameTable` order matches `variable_t`.
- `MINIMAP` source emission may include color or layout assumptions: strip colors and test plain text mapping.
- Web tests currently assert title, saves, damage, minimap, and quest are override-only: update only the selected expectations.
- Source and web repositories are separate git worktrees: record external source file changes in implementation notes.

### Relevant Considerations

- [P03] **Shared helper surface**: Keep protocol mapping and display changes in shared helpers with tests, not in `src/App.tsx`.
- [P03] **Source vs override boundaries**: Move only source-confirmed variables out of override-only defaults.
- [P03] **Evidence-backed protocol inventory**: Update docs from source facts and tests, not desired UI behavior.
- [P03] **Overclaiming protocol support**: Deferred variables remain clearly deferred.
- [P03] **Browser-local config boundary**: Do not store quest, command, host, transcript, or credential data in fixtures or settings.

### Behavioral Quality Focus

Checklist active: Yes

Top behavioral risks for this session:

- Source-backed defaults may make older servers look broken unless missing data keeps explicit fallback states.
- Promoting `MINIMAP` from override-only could erase the room/exits fallback if empty map text is not handled carefully.
- Source docs and web docs can drift if upstream `MINIMAP` and selected variable support are described differently.

---

## 9. Testing Strategy

### Unit Tests

- Source CuTest target for protocol variable registration and set helper behavior.
- Web `msdp-variable-map`, `msdp-state-mapping`, `msdp-display`, and `msdp-map-display` tests for defaults and fallbacks.

### Integration Tests

- Full Luminari Web `npm test` to ensure fixture corpus and parser behavior remain aligned.
- Luminari Web lint and build to catch TypeScript and documentation-link regressions.

### Manual Testing

- Review Protocol inspector and character/map panel copy if display labels change.
- Check that old override-only settings still normalize without corrupting saved client configuration.

### Edge Cases

- Empty title string.
- Negative, zero, and positive saving throws.
- Empty or whitespace-only `MINIMAP` with room/exits fallback still available.
- Older server sends no selected variables.
- Server sends `ALIGNMENT` as either old number or new text during transition.

---

## 10. Dependencies

### External Libraries

- None expected.

### Other Sessions

- **Depends on**: `phase04-session01-luminari-source-protocol-todo-audit`, `phase04-session02-protocol-parser-test-harness`
- **Depended by**: `phase04-session04-mccp-and-gmcp-decision`, `phase04-session05-native-websocket-feasibility`, future mapper or quest sessions

---

## Next Steps

Run the validate workflow step to verify session completeness.
