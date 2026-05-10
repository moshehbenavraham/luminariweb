# Session Specification

**Session ID**: `phase01-session02-msdp-tables-arrays-malformed-payloads`
**Phase**: 01 - Harden Terminal and Proxy
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session hardens structured MSDP payload handling after the Phase 01 parser extraction. Session 01 made the Telnet parser importable without server side effects and covered byte-level Telnet framing. Session 02 now turns the existing MSDP fixture corpus into parser-level verification for tables, arrays, nested structures, empty values, and malformed payloads.

The work matters because Phase 02 game panels will depend on structured values such as `ROOM`, `ROOM_EXITS`, `ACTIONS`, `AFFECTS`, `INVENTORY`, and `GROUP`. Parser behavior must be deterministic before the UI assumes that these values can be displayed or normalized safely.

The implementation should remain narrowly focused on fixtures, parser assertions, and minimal fixes in the side-effect-free parser module. It must not expand server-side variables, redesign panels, or start the xterm.js migration.

---

## 2. Objectives

1. Convert manifest-listed MSDP fixture `payloadTokens` into deterministic parser byte buffers.
2. Assert `parseMsdpPayload()` output for scalar, array, table, nested, empty, and malformed fixture payloads.
3. Document and preserve current numeric and string normalization behavior for structured values.
4. Apply only minimal parser fixes required to make malformed payload handling safe and fixture-compatible.

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session04-msdp-fixture-corpus` - Provides the versioned MSDP fixture corpus and manifest.
- [x] `phase00-session05-state-mapping-tests` - Provides shared state mapping tests that structured parser output must continue to satisfy.
- [x] `phase01-session01-telnet-parser-edge-case-tests` - Provides the side-effect-free `server/telnet-parser.ts` module and parser test harness.

### Required Tools/Knowledge

- Node built-in `node:test` runner through `npm test`.
- TypeScript modules imported through `node --import tsx`.
- MSDP control tokens: `VAR`, `VAL`, `TABLE_OPEN`, `TABLE_CLOSE`, `ARRAY_OPEN`, `ARRAY_CLOSE`.
- Existing fixture schema under `tests/fixtures/msdp/`.

### Environment Requirements

- Dependencies installed from `package-lock.json`.
- No live MUD server, TCP socket, browser, Express listener, or WebSocket listener required.
- Use existing commands: `npm test`, `npm run lint`, and `npm run build`.

---

## 4. Scope

### In Scope (MVP)

- Maintainer can encode fixture `payloadTokens` into byte buffers - Implement a test helper that maps symbolic MSDP tokens and UTF-8 string fragments deterministically.
- Maintainer can verify structured payload parsing - Add parser-level tests for arrays, tables, nested tables, mixed array/table payloads, and empty arrays/tables.
- Maintainer can verify malformed payload behavior - Assert no-throw parsing and documented safe partial output for malformed, truncated, incomplete table, and incomplete array fixtures.
- Maintainer can preserve Phase 00 mapping compatibility - Ensure parser-produced `MudValue` output still feeds `mapMsdpUpdate()` without lossy coercion.
- Maintainer can understand normalization rules - Record integer-string normalization and string preservation behavior in implementation notes.

### Out of Scope (Deferred)

- Adding new server-side MSDP variables - *Reason: Source-level protocol expansion is Phase 04 work.*
- Free-form command-output parsing - *Reason: PRD explicitly rejects this for first-release quest support.*
- UI panel redesign - *Reason: Phase 02 owns game panel presentation after parser hardening.*
- xterm.js migration work - *Reason: Phase 01 Session 05 is the bounded terminal-renderer spike.*
- Connection lifecycle or reconnect cleanup - *Reason: Phase 01 Session 03 owns socket and state reset behavior.*

---

## 5. Technical Approach

### Architecture

Use the existing side-effect-free parser surface in `server/telnet-parser.ts` as the test target. Extend the fixture helper layer so manifest-listed JSON fixtures expose both expected pairs and typed payload tokens. Add a small encoder helper in `tests/helpers/` that converts symbolic tokens into MSDP byte payloads. The parser fixture test should import `parseMsdpPayload()` directly and should not import `server/index.ts`.

Parser fixes, if required, should stay inside `parseMsdpPayload()`, `readValue()`, `readScalar()`, or closely related helpers. Keep output as `MudValue` and preserve the current integer-only numeric normalization behavior so Phase 00 state mapping tests remain stable.

### Design Patterns

- Fixture-driven characterization: Existing fixture JSON remains the behavioral contract for parser output.
- Pure module testing: Parser tests import pure helpers and avoid network or server startup side effects.
- Defensive parsing: Malformed input should skip invalid regions, return safe partial pairs where documented, and never throw.
- Minimal change surface: Parser adjustments should be narrow and covered by fixture assertions.

### Technology Stack

- TypeScript 6.0
- Node.js built-in `node:test`
- `tsx` loader for TypeScript test imports
- Existing `MudValue` types from `shared/mud.ts`
- Existing parser constants and helpers from `server/telnet-parser.ts`

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `tests/helpers/msdp-payload-encoder.ts` | Encode fixture payload tokens into MSDP byte buffers for parser tests | ~110 |
| `tests/msdp-parser-fixtures.test.ts` | Parser fixture assertions for structured and malformed MSDP payloads | ~170 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `tests/helpers/msdp-fixtures.ts` | Expose typed `payloadTokens` and validate fixture token arrays | ~45 |
| `server/telnet-parser.ts` | Apply minimal structured/malformed payload fixes if fixture tests expose gaps | ~30 |
| `tests/README.md` | Document structured MSDP parser fixture coverage | ~20 |
| `.spec_system/specs/phase01-session02-msdp-tables-arrays-malformed-payloads/implementation-notes.md` | Record normalization decisions, parser fixes, and deferred risks | ~90 |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Every manifest-listed fixture with `payloadTokens` can be encoded into a parser payload.
- [ ] Parser output exactly matches expected pairs for scalars, arrays, tables, nested values, and empty values.
- [ ] Malformed payload fixtures parse without unhandled exceptions and match documented safe partial output.
- [ ] Parser-produced structured values still map through Phase 00 state mapping helpers.

### Testing Requirements

- [ ] Structured parser tests written and passing.
- [ ] Existing MSDP fixture, state mapping, and Telnet parser tests still pass.
- [ ] `npm test` completed successfully.
- [ ] `npm run lint` and `npm run build` completed successfully.

### Non-Functional Requirements

- [ ] Parser work does not start HTTP, WebSocket, TCP, or browser processes.
- [ ] Malformed Telnet/MSDP input cannot crash parser tests.
- [ ] Fixture data remains synthetic or sanitized and contains no secrets.

### Quality Gates

- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.

---

## 8. Implementation Notes

### Key Considerations

- Existing fixture files already cover arrays, tables, nested tables, mixed array/table payloads, empty values, and malformed payloads. This session should leverage that corpus rather than inventing a parallel format.
- Numeric normalization is currently integer-only: strings matching `^-?\d+$` become numbers, while other strings remain strings.
- Empty arrays and empty tables are explicit values and must not be treated as unavailable data.
- Keep structured value preservation aligned with `shared/msdp-state.ts`.

### Potential Challenges

- Fixture token validation: Keep helper errors actionable so malformed fixture metadata points to the fixture id and token index.
- Incomplete tables or arrays: Preserve documented safe partial output without skipping valid following pairs unless a test proves the current behavior is wrong.
- Nested recursion: Avoid broad parser rewrites; add local guardrails and tests around recursion paths.

### Relevant Considerations

- [P01] **Parser and reconnect coverage first**: This session expands parser coverage before any lifecycle or UI work depends on structured values.
- [P01] **Fixture-backed tests worked**: Reuse the existing manifest-verified corpus and `node --import tsx --test` approach.
- [P01] **Do not add broad parser rewrites**: Any parser fix should be minimal and fixture-proven.
- [P01] **Compatibility depends on Luminari-Source protocol facts**: Structured payloads should be treated as parser coverage unless live payload shape is confirmed later.
- [P01] **No raw command logging**: Test fixtures must remain sanitized and must not include player secrets or private commands.

### Behavioral Quality Focus

Checklist active: Yes
Top behavioral risks for this session:

- Malformed external MSDP payloads could crash parser logic or emit stale values.
- Incomplete arrays or tables could accidentally consume following variables.
- Ambiguous numeric normalization could cause UI state mapping regressions.

---

## 9. Testing Strategy

### Unit Tests

- Test fixture token encoding for every control token and UTF-8 string payload.
- Test `parseMsdpPayload()` against every manifest-listed fixture expected pair.
- Test malformed fixtures with no-throw assertions and exact output.
- Test parser output integration with `mapMsdpUpdate()` for default structured variables.

### Integration Tests

- No server integration tests are required. The integration boundary for this session is fixture corpus to parser to shared state mapping.

### Manual Testing

- Review `tests/README.md` and implementation notes to confirm no live MUD, browser, or server dependency was introduced.

### Edge Cases

- Empty arrays and empty tables.
- Empty variable names.
- Truncated scalar values.
- Leading orphan control markers.
- Incomplete table and array markers.
- Nested tables inside arrays and arrays inside tables.
- Negative integer strings and zero values.

---

## 10. Dependencies

### External Libraries

- None added.

### Internal Dependencies

- `server/telnet-parser.ts` for parser constants and `parseMsdpPayload()`.
- `shared/mud.ts` for `MudValue` and MSDP variable types.
- `shared/msdp-state.ts` for Phase 00 mapping compatibility.
- `tests/helpers/msdp-fixtures.ts` for manifest-driven fixture loading.

### Other Sessions

- **Depends on**: `phase00-session04-msdp-fixture-corpus`, `phase00-session05-state-mapping-tests`, `phase01-session01-telnet-parser-edge-case-tests`.
- **Depended by**: `phase01-session03-connection-lifecycle-reconnect-cleanup`, `phase02` game panel sessions.

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
