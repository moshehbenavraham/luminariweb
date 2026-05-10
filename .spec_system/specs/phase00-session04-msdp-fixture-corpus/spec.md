# Session Specification

**Session ID**: `phase00-session04-msdp-fixture-corpus`
**Phase**: 00 - Align With Real Luminari Data
**Status**: Not Started
**Created**: 2026-05-10

---

## 1. Session Overview

This session creates the representative MSDP fixture corpus that later parser and state-mapping tests can use without live MUD access. The project has already aligned default MSDP mappings with audited Luminari-Source variables and made unsupported data visible as deliberate unavailable states. The next durable step is to capture those protocol assumptions as small, readable, versioned fixture files.

The work is fixture and documentation focused. It should not harden the parser, add a full test runner, change UI rendering, or change proxy behavior. Instead, it should establish a stable fixture location, a clear fixture format, expected parsed output for each payload, and source-fact notes that explain why each fixture exists.

The resulting corpus should cover the data shapes Phase 01 and Phase 02 will rely on: scalar values, numeric normalization, arrays, tables, nested table-like payloads, group data, affects data, inventory data, room data, and malformed MSDP payloads that must be safe to consume in future tests.

---

## 2. Objectives

1. Create a versioned MSDP fixture corpus in a test-friendly project location.
2. Cover confirmed Luminari scalar, room, collection, group, affects, inventory, and malformed payload shapes.
3. Include expected parsed output for every fixture.
4. Document whether fixtures are real captures or synthetic examples, with source facts for expected values.
5. Preserve current application behavior while preparing Session 05 and later parser tests.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-baseline-verification-and-project-hygiene` - Provides baseline commands, project environment facts, and the current no-test-runner constraint.
- [x] `phase00-session02-msdp-variable-map-alignment` - Provides source-aligned default MSDP mappings and confirmed field groups.
- [x] `phase00-session03-unavailable-data-ux` - Provides optional-data behavior cases that future mapping tests should preserve.

### Required Tools/Knowledge
- Luminari-Source protocol facts from `.spec_system/PRD/PRD.md`.
- Phase 00 fixture requirements from `.spec_system/PRD/phase_00/session_04_msdp_fixture_corpus.md`.
- Current MSDP parser control byte constants and parser behavior in `server/index.ts`.
- Current shared MSDP variable map and `MudState` contract in `shared/mud.ts`.
- JSON validation through Node.js or `jq`.

### Environment Requirements
- Node.js and npm are available.
- Dependencies are installed from `package-lock.json`.
- `npm run lint` and `npm run build` remain the quality gates.
- No new test runner is expected in this session.

---

## 4. Scope

### In Scope (MVP)
- Maintainer can use versioned fixture files without live MUD access - Add a documented corpus under `tests/fixtures/msdp/`.
- Maintainer can validate scalar parsing assumptions - Include core character, resource, combat, metadata, and numeric fixtures with expected pairs.
- Maintainer can validate structured payload assumptions - Include arrays, tables, nested table data, room/exits, group, affects, actions, and inventory fixtures.
- Maintainer can validate malformed payload safety - Include truncated, marker-skipping, empty-variable, and incomplete table/array fixtures with expected safe parser output.
- Maintainer can distinguish fixture origin - Label each fixture as synthetic or real capture, with real capture support left ready for future additions.
- Maintainer can trace expectations to source facts - Document which confirmed variables and PRD facts each fixture covers.

### Out of Scope (Deferred)
- Live MUD capture tooling - *Reason: The stub explicitly defers live capture unless already available and low risk.*
- Parser refactoring or behavior changes - *Reason: Phase 01 owns parser hardening after fixtures exist.*
- State mapping tests or a committed test runner - *Reason: Session 05 owns state mapping tests and documented test commands.*
- UI rendering changes - *Reason: Session 03 handled unavailable-data UX; this session prepares test data only.*
- Luminari-Source protocol changes - *Reason: Source-level protocol work is deferred to Phase 04.*
- Importing GPL reference code or fixtures - *Reason: Reference repositories are behavior inputs only unless licensing strategy changes.*

---

## 5. Technical Approach

### Architecture
Create a fixture-only corpus at `tests/fixtures/msdp/`. Use JSON files for fixture data so the corpus is readable today and easy for a future Node or TypeScript test runner to load. Keep application source out of scope so existing lint and build behavior remains stable.

Each fixture file should include an `id`, `version`, `origin`, `description`, `coverage`, `sourceFacts`, `payloadTokens`, and `expectedPairs`. `payloadTokens` should use documented MSDP control names such as `VAR`, `VAL`, `TABLE_OPEN`, `TABLE_CLOSE`, `ARRAY_OPEN`, and `ARRAY_CLOSE` instead of opaque byte arrays as the primary representation. Malformed fixtures should make the malformed condition explicit and still define the expected safe parse result.

The manifest should index every fixture by id, file, origin, coverage tags, and parser expectation. The README should document control-byte meanings, fixture shape, source-fact citation style, and how later tests should convert token payloads into bytes.

### Design Patterns
- Corpus manifest: A single index makes fixture coverage visible and prevents later tests from hard-coding file names.
- Readable token payloads: Human-readable control tokens reduce review cost before a binary encoder exists.
- Expected output beside input: Each fixture carries its own expected parser pairs.
- Explicit origin metadata: Synthetic examples and real captures are never conflated.
- Fixture-only change: Avoid source behavior changes before tests are ready to consume the corpus.

### Technology Stack
- JSON fixture files
- Markdown documentation
- Node.js or `jq` for JSON validation
- Existing TypeScript, React, Vite, Express, and `ws` stack remains unchanged

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `.spec_system/specs/phase00-session04-msdp-fixture-corpus/implementation-notes.md` | Implementation log, fixture decisions, validation results, and follow-up notes | ~130 |
| `.spec_system/specs/phase00-session04-msdp-fixture-corpus/security-compliance.md` | Session security/GDPR impact notes for fixture data and live-capture avoidance | ~45 |
| `tests/fixtures/msdp/README.md` | Fixture schema, control token guide, source facts, and contribution notes | ~140 |
| `tests/fixtures/msdp/manifest.json` | Versioned fixture index with origin and coverage metadata | ~90 |
| `tests/fixtures/msdp/core-scalars.json` | Metadata, character, ability, and numeric normalization fixtures | ~100 |
| `tests/fixtures/msdp/combat-and-resources.json` | Resource, experience, combat, tank, position, money, and practice fixtures | ~100 |
| `tests/fixtures/msdp/room-and-exits.json` | Room, area, vnum, exits, world time, and room table fixtures | ~100 |
| `tests/fixtures/msdp/collections.json` | Actions, inventory, affects, and simple array/table collection fixtures | ~120 |
| `tests/fixtures/msdp/group-data.json` | Group payload examples and expected parsed group shapes | ~100 |
| `tests/fixtures/msdp/nested-tables.json` | Nested table and mixed array/table examples for parser coverage | ~100 |
| `tests/fixtures/msdp/malformed-payloads.json` | Truncated and malformed MSDP examples with safe expected output | ~120 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| _None expected_ | Fixture-only session; application source should remain unchanged | ~0 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Fixture files exist under `tests/fixtures/msdp/` and are indexed by `manifest.json`.
- [ ] Each fixture declares origin metadata as synthetic or real capture.
- [ ] Each fixture includes expected parsed output.
- [ ] Scalar fixtures cover confirmed metadata, character, resource, combat, and numeric values.
- [ ] Structured fixtures cover arrays, tables, nested data, room/exits, group, affects, actions, and inventory.
- [ ] Malformed fixtures document safe expected parser output and do not require live MUD access.

### Testing Requirements
- [ ] All fixture JSON files parse successfully.
- [ ] Manifest entries point to existing fixture files.
- [ ] Fixture ids are unique across the corpus.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.

### Non-Functional Requirements
- [ ] Fixture files are small, readable, and versioned.
- [ ] Source-fact notes align with `.spec_system/PRD/PRD.md` and Phase 00 requirements.
- [ ] No player secrets, real credentials, or private live capture content are committed.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.

---

## 8. Implementation Notes

### Key Considerations
- The PRD is authoritative for confirmed Luminari-Source MSDP variables.
- Session 02 already identifies confirmed, optional, and override-only MSDP keys in `shared/mud.ts`.
- Session 05 depends on this fixture corpus for state-mapping tests.
- The current parser functions are not exported for direct tests yet; fixtures should be usable once a test harness or parser extraction exists.
- Fixtures should describe expected parser pairs, not UI state, except where notes identify future state-mapping coverage.

### Potential Challenges
- Fixture payloads can become hard to review: Prefer tokenized payloads and concise expected values over raw byte dumps.
- Synthetic examples can drift from real server data: Label them clearly and tie each expectation to source facts.
- Malformed examples can encode accidental parser behavior: Document the intended safety expectation without requiring parser changes in this session.
- Future tests may need byte arrays: Keep token names one-to-one with MSDP control codes so a later encoder can be trivial.
- JSON comments are not allowed: Put explanations in fields such as `notes` and `sourceFacts`.

### Relevant Considerations
- P00-TD3 **Server parser concentration**: Add fixtures before major parser extraction or hardening.
- P00-TD4 **No committed test runner or fixtures**: This session closes the fixture half of that gap without adding a runner.
- P00-EXT2 **GPL reference repositories**: Do not copy fixture data or code from GPL/LGPL examples.
- P00-EXT3 **Live dependency risk**: Prefer repeatable synthetic fixtures over live MUD access.
- P00-SEC-005 **No automated security regression tests**: Malformed fixture cases prepare later parser and WebSocket validation tests.

---

## 9. Testing Strategy

### Unit Tests
- No unit test runner is expected in this session.
- Record future parser and mapping test candidates in `implementation-notes.md`.

### Integration Tests
- Parse every JSON fixture and the manifest with Node.js or `jq`.
- Verify manifest entries point to existing files and fixture ids are unique.
- Run `npm run lint`.
- Run `npm run build`.

### Manual Testing
- Review fixture coverage against confirmed PRD variables and Session 04 scope.
- Review malformed payload expectations for safe output rather than crash-prone assumptions.
- Confirm fixture documentation explains synthetic versus real-capture status.

### Edge Cases
- Numeric strings and negative numeric strings normalize to numbers.
- Empty strings remain distinguishable from missing values.
- Empty arrays and empty tables are represented explicitly.
- Unknown or unsupported variables appear only in malformed or override-specific examples.
- Truncated table/array payloads define safe partial or empty expected output.

---

## 10. Dependencies

### External Libraries
- None added in this session.

### Other Sessions
- **Depends on**: `phase00-session01-baseline-verification-and-project-hygiene`, `phase00-session02-msdp-variable-map-alignment`, `phase00-session03-unavailable-data-ux`.
- **Depended by**: `phase00-session05-state-mapping-tests`, Phase 01 parser hardening sessions, and Phase 02 game-panel mapping work.

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
