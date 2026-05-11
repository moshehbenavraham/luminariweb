# Session Specification

**Session ID**: `phase04-session04-mccp-and-gmcp-decision`
**Phase**: 04 - Source-Level Protocol Path
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session converts the Phase 04 MCCP and GMCP backlog into explicit maintainer decisions. The current web proxy rejects MCCP, does not parse GMCP, and relies on MSDP as the first-party structured game-state protocol. Luminari-Source has GMCP functions and MCCP framework notes, but MCCP compression is still represented as a stubbed source path and GMCP is not a stable web module contract.

The work should decide whether MCCP and GMCP are pursued, deferred, or rejected for the current Luminari Web path. It must preserve the current proxy behavior unless a tiny documentation or status-code correction is required. Any real compression, decompression, GMCP parser, module schema, or MSDP migration work belongs in follow-up specs if the decision accepts that direction.

The session also keeps protocol claims synchronized across docs, the shared protocol status catalog, tests, and source-side maintainer notes so users and maintainers do not infer support from source placeholders.

---

## 2. Objectives

1. Decide the current MCCP outcome with rationale, prerequisites, and follow-up scope if the feature is pursued later.
2. Decide the current GMCP outcome with module, schema, proxy, client, and MSDP overlap implications.
3. Synchronize Luminari Web docs, protocol status catalog, tests, and source maintainer notes with the decisions.
4. Preserve current unsupported behavior until implementation and validation exist.

---

## 3. Prerequisites

### Required Sessions

- [x] `phase04-session01-luminari-source-protocol-todo-audit` - Ranks MCCP and GMCP against value, source risk, and validation requirements.
- [x] `phase04-session02-protocol-parser-test-harness` - Provides source harness coverage for malformed GMCP and rejected/unsupported negotiation paths.
- [x] `phase04-session03-missing-msdp-variables` - Confirms MSDP remains the current source-backed game-state path for selected client panels.
- [x] `phase03-session06-protocol-feature-checklist` - Provides the web protocol status catalog and conservative claim contract.

### Required Tools/Knowledge

- `rg` for source, web, and documentation audits.
- `node --import tsx --test` for focused protocol status tests.
- Knowledge of Telnet option negotiation, MCCP v2 compression boundaries, GMCP module conventions, and the current MSDP mapping path.

### Environment Requirements

- Luminari Web checkout at `/home/aiwithapex/projects/luminariweb`.
- Luminari-Source checkout at `/home/aiwithapex/projects/Luminari-Source`.
- Any examples or validation notes must be synthetic and must not include commands, credentials, private hosts, character names, tokens, or terminal transcripts.

---

## 4. Scope

### In Scope (MVP)

- Maintainer can see the MCCP decision - document pursue, defer, or reject with source compression, proxy decompression, reconnect, failure, and test responsibilities.
- Maintainer can see the GMCP decision - document pursue, defer, or reject with module schema, parser, client mapping, and MSDP coexistence responsibilities.
- Luminari Web protocol status stays conservative - update shared status records, checklist docs, and tests without claiming support that is not implemented.
- Source-side documentation reflects the current decision - align maintainer notes with web-client boundaries where those notes currently overstate readiness.
- Follow-up implementation work is explicit - create scoped follow-up notes instead of folding runtime support into this decision session.

### Out of Scope (Deferred)

- Implementing zlib compression in Luminari-Source - *Reason: changes the byte stream and needs source compression tests plus rollback planning.*
- Adding proxy decompression for MCCP - *Reason: requires stream framing, failure handling, reconnect fixtures, and timeout behavior beyond a decision session.*
- Adding a GMCP parser, module schema, or client mapping contract - *Reason: requires source, proxy, client, fixture, and migration design.*
- Replacing existing MSDP panels with GMCP data - *Reason: MSDP is the current tested contract and GMCP needs a migration plan first.*
- Changing the `/ws` browser application protocol - *Reason: native transport feasibility is Session 05 work.*

---

## 5. Technical Approach

### Architecture

Treat this as a protocol governance session. Runtime behavior should remain unchanged unless a test proves the current conservative rejection path is drifting. Decisions should be captured in an ADR and mirrored into the protocol backlog, feature checklist, shared protocol status catalog, and source-side maintainer notes.

MCCP analysis should follow the whole data path: source negotiation and compression start, proxy decompression and parser ordering, browser message semantics, reconnect cleanup, timeout/failure behavior, and production observability. GMCP analysis should follow the whole contract path: source module names and versions, JSON payload schemas, negotiation behavior, proxy parsing, client state mapping, overlap with MSDP, and fixture/test requirements.

### Design Patterns

- Decision record first: capture outcome and rationale before changing status text.
- Conservative claim synchronization: docs, shared status records, and tests must agree.
- Follow-up decomposition: accepted runtime support becomes future specs with explicit owners and validation gates.
- Current behavior preservation: rejected or deferred features remain unavailable to users until support exists.

### Technology Stack

- Markdown documentation and ADRs.
- TypeScript shared protocol status catalog.
- Node test runner with `tsx`.
- Luminari-Source C protocol documentation and parser harness notes.

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `docs/adr/0002-mccp-and-gmcp-protocol-direction.md` | Decision record for MCCP and GMCP outcomes, rationale, and follow-up scope. | ~120 |
| `.spec_system/specs/phase04-session04-mccp-and-gmcp-decision/implementation-notes.md` | Session evidence, audited paths, options, decisions, commands, and validation results. | ~120 |
| `.spec_system/specs/phase04-session04-mccp-and-gmcp-decision/security-compliance.md` | Security, privacy, and behavioral quality review. | ~70 |
| `.spec_system/specs/phase04-session04-mccp-and-gmcp-decision/validation.md` | Final validation report for updateprd. | ~80 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `docs/source-protocol-backlog.md` | Replace deferred Session 04 placeholders with final MCCP/GMCP decisions and follow-up boundaries. | ~50 |
| `docs/protocol-feature-checklist.md` | Update MCCP and GMCP status text, next actions, and claim boundaries. | ~35 |
| `shared/protocol-feature-status.ts` | Update protocol status records and evidence links while preserving unsupported behavior. | ~45 |
| `tests/protocol-feature-status.test.ts` | Update expected status counts and conservative claim assertions. | ~20 |
| `docs/development.md` | Update maintainer protocol guidance for MCCP/GMCP decisions. | ~15 |
| `docs/ARCHITECTURE.md` | Align high-level protocol boundary summary. | ~15 |
| `docs/api/http-and-websocket.md` | Clarify that `/ws` remains uncompressed app-level JSON over browser WebSocket. | ~20 |
| `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md` | Align source maintainer wording for MCCP framework and GMCP readiness. | ~45 |
| `/home/aiwithapex/projects/Luminari-Source/docs/testing/PROTOCOL_PARSER_HARNESS.md` | Link decision implications to existing GMCP/MCCP validation gaps. | ~25 |

---

## 7. Success Criteria

### Functional Requirements

- [ ] MCCP has an explicit pursue, defer, or reject decision with source, proxy, test, and rollout implications.
- [ ] GMCP has an explicit pursue, defer, or reject decision with module, schema, proxy, client, and MSDP migration implications.
- [ ] Luminari Web still rejects or leaves unsupported behavior unavailable until implementation and validation exist.
- [ ] Any accepted runtime work is split into follow-up specs rather than hidden inside this session.
- [ ] Source and web docs agree on what is supported, deferred, or rejected.

### Testing Requirements

- [ ] Focused protocol status tests pass.
- [ ] Telnet parser rejection tests are run if MCCP rejection wording or behavior is touched.
- [ ] `npm test` passes or blockers are documented.
- [ ] `npm run lint` and `npm run build` pass or blockers are documented.

### Non-Functional Requirements

- [ ] Protocol claims remain evidence-backed and conservative.
- [ ] No commands, credentials, private hosts, transcripts, or tokens are added to docs or fixtures.
- [ ] Browser-local settings and `/ws` message contracts remain unchanged.
- [ ] Follow-up work includes clear validation gates before public support claims.

### Quality Gates

- [ ] All spec-system files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows Luminari Web and Luminari-Source conventions.

---

## 8. Implementation Notes

### Key Considerations

- Luminari Web currently rejects MCCP with `DONT` in `server/telnet-parser.ts`; this protects the proxy from receiving compressed bytes it cannot decompress.
- Luminari-Source has `USING_MCCP` defined while `CompressStart()` and `CompressEnd()` still report that they do nothing. The decision must address that mismatch explicitly.
- Source GMCP exists as negotiation/send/parse helpers and Mudlet package delivery, but Luminari Web has no GMCP Telnet option constant, parser, module schema, state mapping, or fixtures.
- MSDP is now source-backed for selected web panel fields; GMCP must not replace that path without a migration and coexistence plan.

### Potential Challenges

- Source docs may describe GMCP and MCCP more optimistically than the runtime and web proxy can support: mitigate by separating source framework presence from web support.
- MCCP can appear simple at negotiation level while changing every downstream byte boundary: mitigate by listing compression/decompression and reconnect tests before accepting runtime work.
- GMCP can duplicate MSDP data while adding schema ambiguity: mitigate by requiring module names, versions, ownership, and migration rules.

### Relevant Considerations

- [P03] **Evidence-backed protocol inventory**: Keep the checklist as a maintainer aid, not proof of live support.
- [P03] **Overclaiming protocol support**: Unsupported or deferred features stay marked as such until source-level support exists.
- [P03] **Source vs override boundaries**: Keep source-confirmed protocol data and future module plans separate.
- [P03] **Shared helper surface**: Keep protocol status changes in shared helpers with tests, not ad hoc UI text.
- [P03] **Browser-local config boundary**: Do not store commands, hosts, transcripts, tokens, or private examples in docs or fixtures.

### Behavioral Quality Focus

Checklist active: Yes

Top behavioral risks for this session:

- Maintainer docs could overstate MCCP or GMCP support and encourage unsafe runtime enablement.
- Static protocol status UI could show stale or unsupported claims if shared records and checklist docs diverge.
- Follow-up implementation could be too broad unless source, proxy, client, test, and rollout responsibilities are split explicitly.

---

## 9. Testing Strategy

### Unit Tests

- `node --import tsx --test tests/protocol-feature-status.test.ts` for status catalog counts, evidence, and conservative claims.
- `node --import tsx --test tests/telnet-parser-edge-cases.test.ts` if MCCP rejection behavior or constants are touched.

### Integration Tests

- `npm test` to catch broader protocol documentation and helper regressions.
- `npm run lint` and `npm run build` to verify TypeScript and production build health.

### Manual Testing

- Review Protocol inspector wording if shared status labels or summaries change.
- Review ADR, backlog, checklist, and source docs together for contradictory support claims.

### Edge Cases

- Source advertises MCCP while compression remains stubbed.
- Server sends MCCP negotiation to the current web proxy.
- Source sends malformed GMCP or Mudlet-specific GMCP package data.
- GMCP and MSDP both offer overlapping game-state data.
- Future browser client connects to older source without any GMCP module contract.

---

## 10. Dependencies

### External Libraries

- None expected.

### Other Sessions

- **Depends on**: `phase04-session01-luminari-source-protocol-todo-audit`, `phase04-session02-protocol-parser-test-harness`, `phase04-session03-missing-msdp-variables`
- **Depended by**: `phase04-session05-native-websocket-feasibility`, future MCCP implementation, future GMCP module implementation, future source hardening phases

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
