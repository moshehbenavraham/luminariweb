# Session Specification

**Session ID**: `phase04-session02-protocol-parser-test-harness`
**Phase**: 04 - Source-Level Protocol Path
**Status**: Complete
**Created**: 2026-05-11

---

## 1. Session Overview

This session creates the validation baseline needed before Luminari-Source protocol behavior changes are attempted. Session 01 ranked parser and protocol safety work as the highest-value follow-up, but that work should not proceed until maintainers have repeatable checks for malformed Telnet, MSDP, GMCP, NAWS, TTYPE, and related negotiation boundaries.

The session should first identify the smallest practical source-side harness. If the existing CuTest layout can exercise `ProtocolInput` and adjacent helpers without broad source rewrites, add a focused C harness and a runnable make target. If direct linking proves too coupled for one session, document the exact blocker and create a repeatable manual or scripted validation procedure instead, while keeping the future implementation path explicit.

The output must keep Luminari Web and Luminari-Source claims conservative. Harness coverage is a safety net for future changes; it does not make MCCP, GMCP modules, MXP, live `MINIMAP`, `QUEST_INFO`, `TITLE`, saves, or `DAMAGE_BONUS` supported features.

---

## 2. Objectives

1. Establish a repeatable source protocol validation path for the highest-risk Phase 04 parser and negotiation cases.
2. Cover or explicitly document blockers for split IAC, doubled IAC, incomplete subnegotiations, malformed MSDP, malformed GMCP, TTYPE, NAWS, unsupported options, and oversized protocol response paths.
3. Record the exact local command or manual procedure maintainers can run without live private data.
4. Sync Luminari Web protocol documentation with the new coverage boundary without changing unsupported feature claims.

---

## 3. Prerequisites

### Required Sessions

- [x] `phase04-session01-luminari-source-protocol-todo-audit` - Provides the ranked protocol backlog and identifies parser validation as the next safety baseline.
- [x] `phase03-session06-protocol-feature-checklist` - Provides the web protocol status contract and conservative claim boundaries.

### Required Tools/Knowledge

- `rg` for source and documentation audit.
- `gcc` and `make` for the Luminari-Source CuTest harness where available.
- `node --import tsx --test` for existing Luminari Web parser tests.
- Familiarity with Telnet IAC/SB/SE framing, MSDP variables, GMCP payloads, NAWS dimensions, TTYPE responses, MCCP rejection, and source descriptor state.

### Environment Requirements

- Local Luminari-Source checkout exists at `/home/aiwithapex/projects/Luminari-Source`.
- Validation fixtures must be synthetic and must not include commands, credentials, private hosts, tokens, or terminal transcripts.
- Source changes should be limited to test harness, make target, and testing documentation unless a production change is necessary to expose a test seam.

---

## 4. Scope

### In Scope (MVP)

- Maintainer can run or follow a source protocol validation procedure - add a focused CuTest target or document the exact blocker and manual fallback.
- Maintainer can validate parser boundary cases - include split IAC, doubled IAC, incomplete subnegotiation, malformed MSDP, malformed GMCP, TTYPE, NAWS, and unsupported options.
- Maintainer can inspect oversized response-path coverage - cover or document blocked validation for MSDP list replies, MSSP, MXP tag creation, and copyover protocol strings.
- Maintainer can compare source harness coverage with existing Luminari Web parser tests - use current TypeScript tests as parity reference, not proof of source safety.
- Maintainer can see what remains unvalidated - record gaps as blockers or follow-ups in implementation notes and docs.

### Out of Scope (Deferred)

- Runtime protocol behavior changes - *Reason: this session creates validation before behavior changes.*
- Full parser rewrites - *Reason: broad parser changes belong in a later hardening session after harness coverage exists.*
- Implementing MCCP compression, GMCP module APIs, MXP browser UI, native WebSocket, or new MSDP variables - *Reason: these are later Phase 04 decisions or implementation sessions.*
- Using live captures as fixtures - *Reason: privacy boundaries require synthetic, redacted validation data.*
- Claiming new Luminari Web support - *Reason: harness coverage does not change runtime client or proxy capability.*

---

## 5. Technical Approach

### Architecture

Use the existing source test infrastructure first. The preferred path is a small CuTest file under `/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/` plus a make target in the same directory. The harness should create minimal descriptor/protocol fixtures or test doubles needed to call protocol parser entry points with synthetic byte buffers. It should avoid starting the MUD, opening sockets, requiring a database, or depending on live player data.

Luminari Web remains the comparison baseline for desired parser behavior. Existing TypeScript tests already cover web proxy parser edge cases; this session should align source-side cases to those names and expectations where practical while documenting any source-specific differences.

### Design Patterns

- Test seam before behavior change: add validation around the existing source behavior before modifying parser logic.
- Synthetic byte fixtures: define explicit byte arrays for Telnet and protocol frames instead of storing live transcripts.
- Conservative claims: mark coverage as validation only and leave unsupported runtime features unsupported.
- Fail-closed documentation: if a harness case cannot be automated in scope, document the blocker and required follow-up rather than silently dropping it.

### Technology Stack

- Luminari-Source C protocol files and CuTest harness.
- Luminari Web TypeScript parser tests for parity references.
- Markdown maintainer documentation in both source and web repositories.

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/test_protocol_parser.c` | Focused source protocol parser harness or documented blocked harness stub. | ~280 |
| `/home/aiwithapex/projects/Luminari-Source/docs/testing/PROTOCOL_PARSER_HARNESS.md` | Runnable validation command, case matrix, privacy rules, and known gaps. | ~120 |
| `.spec_system/specs/phase04-session02-protocol-parser-test-harness/implementation-notes.md` | Session notes, commands, coverage decisions, blockers, and validation results. | ~90 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/Makefile` | Add protocol harness object, executable, and focused test target if CuTest integration is feasible. | ~45 |
| `docs/source-protocol-backlog.md` | Add Session 02 coverage notes and keep accepted/deferred/rejected boundaries intact. | ~35 |
| `docs/protocol-feature-checklist.md` | Link source harness procedure and preserve unsupported feature labels. | ~20 |
| `.spec_system/specs/phase04-session02-protocol-parser-test-harness/tasks.md` | Mark tasks complete during implementation. | ~25 |

---

## 7. Success Criteria

### Functional Requirements

- [x] A source parser harness, scripted check, or documented runnable procedure exists and is repeatable locally.
- [x] Split IAC, doubled IAC, incomplete subnegotiation, malformed MSDP, malformed GMCP, TTYPE, NAWS, and unsupported option cases are covered or listed as explicit blockers.
- [x] Oversized response paths for MSDP lists, MSSP, MXP tags, and copyover strings are covered or listed as explicit blockers.
- [x] Validation data is synthetic and free of commands, credentials, private hosts, tokens, and transcripts.
- [x] Luminari Web protocol docs describe the harness boundary without marking unsupported features supported.

### Testing Requirements

- [x] Source harness command or fallback procedure is run or documented with exact blockers.
- [x] Existing Luminari Web parser/protocol tests are run where applicable.
- [x] `npm run lint` and `npm run build` are run or any blockers are documented.

### Non-Functional Requirements

- [x] Harness code is bounded, readable, and avoids broad production refactors.
- [x] Test cases use deterministic byte fixtures and explicit expected outcomes.
- [x] Future source protocol implementation sessions can use this coverage before behavior changes.

### Quality Gates

- [x] All spec-system files ASCII-encoded.
- [x] Unix LF line endings.
- [x] Code follows Luminari Web and source project conventions.

---

## 8. Implementation Notes

### Key Considerations

- Session 01 accepted parser boundary hardening, string/allocation cleanup, and harness work as A1-A4. This session should build the safety net, not fix every finding.
- The source `ProtocolInput` path depends on descriptor and protocol state. Keep test doubles minimal and document any unavailable dependency instead of turning the session into a source architecture refactor.
- Existing web tests under `tests/telnet-parser-edge-cases.test.ts` are useful parity references, but source parser behavior may differ because it runs before normal MUD command interpretation.
- The source CuTest makefile currently uses C89-style flags. New test code should stay compatible with that style unless the local source project conventions say otherwise.

### Potential Challenges

- Directly linking `protocol.c` may pull in broad game dependencies: mitigate by isolating the smallest callable test seam or documenting a manual harness fallback.
- Some parser helpers are static: test through public entry points where possible and avoid changing visibility unless a narrow test seam is justified.
- Oversized string paths may be hard to exercise without descriptor output plumbing: document blocked coverage explicitly if automation exceeds the session.
- Source checkout changes are outside the Luminari Web repository: record every external file path changed in implementation notes.

### Relevant Considerations

- [P03] **Shared helper surface**: Keep web protocol alignment in shared helpers and tests rather than expanding `src/App.tsx`.
- [P03] **Source vs override boundaries**: Harness coverage must not blur source-confirmed data with override-only web fields.
- [P03] **Evidence-backed protocol inventory**: Treat validation as evidence for future work, not as a runtime support claim.
- [P03] **Overclaiming protocol support**: Unsupported or deferred protocol features remain labeled as such until implementation and tests prove support.
- [P03] **Browser-local config boundary**: Do not store commands, hosts, transcripts, tokens, or other sensitive data in fixtures or docs.

### Behavioral Quality Focus

Checklist active: Yes

Top behavioral risks for this session:

- Parser fixture cases may accidentally encode private player data if live captures are used.
- A harness that cannot run repeatably may create false confidence for later protocol changes.
- Documentation may overstate support when it should only describe validation coverage.

---

## 9. Testing Strategy

### Unit Tests

- Run the new source protocol parser harness target if CuTest integration is feasible.
- Run `node --import tsx --test tests/telnet-parser-edge-cases.test.ts` for web parser parity.
- Run any focused web tests touched by protocol checklist or backlog changes.

### Integration Tests

- No live MUD integration is expected. If a source harness cannot exercise parser behavior without live state, document the blocker and exact follow-up requirement.

### Manual Testing

- Review the harness procedure from a maintainer perspective and confirm the command or checklist is runnable without private data.
- Review protocol docs for unchanged support labels on MCCP, GMCP, MXP, `MINIMAP`, `QUEST_INFO`, `TITLE`, saves, and `DAMAGE_BONUS`.

### Edge Cases

- Split IAC across buffers.
- Doubled IAC literal byte handling.
- Subnegotiation missing `IAC SE`.
- Short NAWS payloads and repeated NAWS negotiation.
- TTYPE SEND and repeated terminal-type responses.
- Malformed MSDP and GMCP payloads.
- Unsupported MCCP, CHARSET, MXP, MSP, and unknown option negotiation.
- Overlong variable names, variable values, MSSP payloads, MXP tags, and copyover protocol strings.

---

## 10. Dependencies

### External Libraries

- CuTest in `/home/aiwithapex/projects/Luminari-Source/unittests/CuTest/`.
- No new third-party dependencies expected.

### Other Sessions

- **Depends on**: `phase04-session01-luminari-source-protocol-todo-audit`
- **Depended by**: `phase04-session03-missing-msdp-variables`, `phase04-session04-mccp-and-gmcp-decision`, `phase04-session05-native-websocket-feasibility`

---

## Next Steps

Session complete. The next workflow step is `plansession` for Phase 04 Session 03 because Phase 04 still has remaining sessions.
