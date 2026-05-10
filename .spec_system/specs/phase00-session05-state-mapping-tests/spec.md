# Session Specification

**Session ID**: `phase00-session05-state-mapping-tests`
**Phase**: 00 - Align With Real Luminari Data
**Status**: Not Started
**Created**: 2026-05-10

---

## 1. Session Overview

This session adds the first focused automated tests for MSDP variable normalization and the mapping from MSDP variable/value pairs into client-visible `MudState`. Phase 00 has already aligned the default variable map, made unsupported data explicit in the UI, and created a fixture corpus. The remaining Phase 00 work is to lock those behaviors down with repeatable local tests.

The current mapping helper lives inside `server/index.ts`, which also starts the Express and WebSocket server at module load. The implementation should create a small shared mapping module that can be imported by both the server and tests without opening sockets or starting listeners. This keeps the test seam narrow while preserving current runtime behavior.

The session should use the existing stack where practical. Because no test runner is committed yet, add a minimal Node test command using the built-in `node:test` runner with the existing `tsx` TypeScript loader, then document the command for future parser and proxy sessions.

---

## 2. Objectives

1. Add a repeatable `npm test` command for focused TypeScript tests.
2. Extract MSDP state mapping helpers into a server-safe shared module.
3. Test default MSDP variable normalization, override preservation, and configured request filtering.
4. Test confirmed, unknown, unsupported, override-only, scalar, and structured MSDP mapping behavior.
5. Reuse the Session 04 fixture corpus for state-mapping coverage where it matches current defaults.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-baseline-verification-and-project-hygiene` - Provides documented lint/build commands and current environment facts.
- [x] `phase00-session02-msdp-variable-map-alignment` - Provides source-aligned default MSDP variables and current server mapping behavior.
- [x] `phase00-session03-unavailable-data-ux` - Provides unsupported-data expectations that mapping tests should protect.
- [x] `phase00-session04-msdp-fixture-corpus` - Provides MSDP fixtures and manifest data for fixture-driven mapping tests.

### Required Tools/Knowledge
- Node.js 24 with the built-in `node:test` runner.
- Existing `tsx` dev dependency for running TypeScript tests.
- Current shared MSDP contract in `shared/mud.ts`.
- Current server mapping behavior in `server/index.ts`.
- Fixture schema and manifest under `tests/fixtures/msdp/`.

### Environment Requirements
- Dependencies installed with the current lockfile.
- `npm run lint` and `npm run build` remain required quality gates.
- New test command must run locally without live MUD access.

---

## 4. Scope

### In Scope (MVP)
- Maintainer can run focused MSDP state tests locally - Add `npm test` with Node's built-in test runner and document usage.
- Maintainer can import mapping helpers without starting the proxy server - Move mapping-only helpers into `shared/msdp-state.ts`.
- Maintainer can verify default MSDP mappings - Test confirmed defaults, blank override-only slots, trimming, invalid input fallback, and configured request filtering.
- Maintainer can verify MSDP-to-`MudState` behavior - Test confirmed scalar fields, structured room and collection payloads, unknown variables, malformed scalar values, and settings overrides.
- Maintainer can reuse fixtures - Load the Session 04 fixture manifest and assert expected state partials for default mapped fixture pairs.

### Out of Scope (Deferred)
- Full Telnet parser tests - *Reason: Phase 01 owns split IAC, doubled IAC, subnegotiation, and malformed parser hardening.*
- Proxy lifecycle and reconnect tests - *Reason: Phase 01 owns repeated connect/disconnect behavior.*
- Browser-level UI tests or visual regression - *Reason: this session targets shared mapping behavior, not rendered panel behavior.*
- Source-level Luminari protocol changes - *Reason: Phase 04 owns server-source protocol work.*
- New runtime dependencies - *Reason: the existing `tsx` dependency and Node test runner are sufficient for focused tests.*

---

## 5. Technical Approach

### Architecture

Create `shared/msdp-state.ts` for pure mapping behavior that both the proxy and tests can import. Move or recreate the current server-local functions for configured variable filtering, variable-key resolution, scalar conversion, list/structured preservation, and `mapMsdpUpdate`. Update `server/index.ts` to import those helpers and remove the duplicated local mapping implementation.

Add tests under `tests/` using `node:test` and `node:assert/strict`. Keep helper files below `tests/helpers/` and test files at `tests/*.test.ts` so a simple package script can run them with `node --import tsx --test tests/*.test.ts`. Tests should import shared modules directly and should not require an Express server, WebSocket server, live TCP socket, or browser DOM.

Fixture-driven tests should load `tests/fixtures/msdp/manifest.json`, resolve listed fixture files, read `expectedPairs`, and feed those pairs through `mapMsdpUpdate` with the normalized default map. Assertions should focus on pairs whose variables are configured by default or explicitly configured for override tests, while unknown and unsupported names must be asserted as safe ignored output.

### Design Patterns
- Pure helper extraction: Keep mapping logic side-effect free and easy to test.
- Shared contract tests: Assert behavior at the `MudState` contract boundary, not implementation internals.
- Fixture manifest loading: Avoid hard-coded fixture file lists so coverage stays aligned with the corpus.
- Existing dependency reuse: Use `node:test` plus `tsx` instead of adding a new test framework.

### Technology Stack
- TypeScript 6.0.2
- Node.js 24 built-in `node:test`
- Existing `tsx` dev dependency
- React 19, Vite, Express, and `ws` remain unchanged runtime stack

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `shared/msdp-state.ts` | Pure MSDP configured-variable and state-mapping helpers | ~180 |
| `tests/helpers/msdp-fixtures.ts` | Fixture manifest/file loader and expected-pair helpers | ~140 |
| `tests/msdp-variable-map.test.ts` | Normalization, default, override, and configured-request tests | ~170 |
| `tests/msdp-state-mapping.test.ts` | Direct scalar, structured, unknown, and override mapping tests | ~220 |
| `tests/msdp-fixture-mapping.test.ts` | Fixture-driven mapping coverage for Session 04 corpus pairs | ~180 |
| `tests/README.md` | Test command documentation and scope notes | ~80 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `package.json` | Add focused `npm test` script | ~2 |
| `server/index.ts` | Import shared mapping helpers and remove local mapping-only helpers | ~80 |
| `.spec_system/specs/phase00-session05-state-mapping-tests/implementation-notes.md` | Record task progress, decisions, command output, and follow-ups | ~180 |
| `.spec_system/specs/phase00-session05-state-mapping-tests/security-compliance.md` | Record no-live-data testing boundary and trust-boundary implications | ~90 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] `npm test` runs focused TypeScript tests without live MUD access.
- [ ] Default confirmed MSDP variables normalize to expected source-backed names.
- [ ] Override-only unsupported defaults remain blank unless a user override supplies a name.
- [ ] Confirmed scalar MSDP pairs map to expected `MudState` fields and preserve zero values.
- [ ] Structured room, action, inventory, affects, and group values are preserved without lossy scalar coercion.
- [ ] Unknown variables and blank configured mappings produce empty state partials.
- [ ] Settings overrides map demoted variables only when explicitly configured.

### Testing Requirements
- [ ] Unit tests written and passing with `npm test`.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Test commands documented in `tests/README.md` and implementation notes.

### Non-Functional Requirements
- [ ] Tests run deterministically from local fixtures and shared helpers.
- [ ] No live MUD host, browser, WebSocket, or TCP socket is required for mapping tests.
- [ ] Mapping helper extraction does not change runtime proxy behavior.
- [ ] Fixture tests do not include passwords, raw player commands, or live private session data.

### Quality Gates
- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions

---

## 8. Implementation Notes

### Key Considerations
- Do not import `server/index.ts` from tests because it starts the HTTP/WebSocket server at module load.
- Keep `shared/mud.ts` as the type and default-variable contract; put mapping behavior in a separate shared module.
- Use source-backed defaults from the PRD and Session 02; do not make unsupported variables appear source-backed.
- Test behavior and protocol contracts, not private implementation details.

### Potential Challenges
- Server extraction can accidentally change runtime behavior: Move helpers in small steps and compare the switch coverage against the current mapper.
- Fixture expected pairs include parser-oriented data: Only assert state mapping where a configured variable exists, and explicitly assert ignored output for unknown or unsupported defaults.
- Tests may need Node APIs: Import Node APIs explicitly to avoid relying on implicit globals.
- TypeScript path and extension rules are strict: Keep `.ts` import extensions consistent with the existing `allowImportingTsExtensions` setup.

### Relevant Considerations
- P00-TD1 **Default MSDP mapping mismatch**: Tests should assert source-aligned defaults and override-only blanks so unsupported values do not silently return.
- P00-TD3 **Server combines proxy and mapping logic**: Extract only the pure mapping helper needed for tests; defer broader parser/proxy extraction.
- P00-TD4 **No committed test runner or fixtures**: This session closes the focused mapping-test half of the gap using the existing fixture corpus.
- P00-SEC-005 **No automated security regression tests**: Mapping tests are not full security coverage, but they should protect unknown-variable and malformed-scalar safety behavior.
- Lesson **Lint and build are current quality gates**: Keep `npm run lint` and `npm run build` as required validation alongside the new `npm test`.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Tests import a module that starts sockets or server listeners.
- Unsupported or unknown MSDP variables are accidentally treated as trusted state.
- Structured MSDP values are coerced into lossy strings or numbers.
- User-provided MSDP overrides regress during normalization.

---

## 9. Testing Strategy

### Unit Tests
- Test `normalizeMsdpVariableMap`, confirmed defaults, override-only blanks, trimming, invalid input fallback, and override preservation.
- Test `getConfiguredMsdpVariables` deduplication and blank filtering.
- Test `mapMsdpUpdate` for confirmed metadata, character, resources, combat, room/world, collections, and group fields.
- Test unknown variables, blank configured mappings, unsupported defaults, nonnumeric scalar values, zero values, arrays, and tables.

### Integration Tests
- Fixture-driven mapping tests should load `tests/fixtures/msdp/manifest.json`, load each fixture file, and feed expected pairs into the shared mapping helper.
- Verify fixture pairs for configured default variables produce non-empty state partials matching expected fields.
- Verify unsupported or unknown fixture pairs remain ignored unless a test supplies an explicit override map.

### Manual Testing
- Run `npm test`.
- Run `npm run lint`.
- Run `npm run build`.
- Inspect the scoped diff to confirm server behavior was only refactored into the shared helper.

### Edge Cases
- Empty string mappings remain blank when their default fallback is blank.
- User override strings are trimmed and preserved.
- Duplicate configured variable names are requested only once.
- Numeric string `0` maps to numeric zero, not unavailable.
- Nonnumeric scalar data for numeric fields maps to `undefined`.
- Arrays and tables preserve structure for list-like and structured fields.

---

## 10. Dependencies

### External Libraries
- No new runtime dependency.
- Existing `tsx` dev dependency is used to load TypeScript tests.
- Node.js built-in `node:test` and `node:assert/strict` provide the test runner and assertions.

### Other Sessions
- **Depends on**: `phase00-session01-baseline-verification-and-project-hygiene`, `phase00-session02-msdp-variable-map-alignment`, `phase00-session03-unavailable-data-ux`, `phase00-session04-msdp-fixture-corpus`
- **Depended by**: Phase 01 parser hardening, Phase 01 proxy lifecycle hardening, Phase 02 game-panel rendering, Phase 04 source-level protocol changes

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
