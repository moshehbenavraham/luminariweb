# Session Specification

**Session ID**: `phase04-session01-luminari-source-protocol-todo-audit`
**Phase**: 04 - Source-Level Protocol Path
**Status**: Complete
**Created**: 2026-05-11

---

## 1. Session Overview

This session converts the existing Luminari-Source protocol TODOs, source protocol facts, and Luminari Web follow-up notes into a ranked source protocol backlog. It is the entry point for Phase 04 because later sessions need an agreed baseline before they can build a parser harness, choose missing MSDP variables, or decide MCCP, GMCP, and native WebSocket direction.

The work is intentionally audit and documentation focused. It should inspect the local Luminari-Source checkout, compare source-level findings against the Phase 00-03 web client needs, and document which source protocol items are accepted candidates, deferred work, or rejected for the current product path. No source behavior changes are included in this session.

The output should let future implementers choose work without re-litigating the audit baseline. Each accepted candidate must include web client value, implementation risk, required source or client validation, and older-server fallback expectations.

---

## 2. Objectives

1. Produce a ranked source protocol backlog grounded in inspected source files and protocol docs.
2. Separate accepted, deferred, and rejected source protocol work with rationale and risk notes.
3. Map accepted candidates to Luminari Web value, required tests or fixtures, and fallback behavior.
4. Update maintainer-facing protocol documentation so Phase 04 follow-up sessions start from the same evidence.

---

## 3. Prerequisites

### Required Sessions

- [x] `phase03-session06-protocol-feature-checklist` - Provides the conservative protocol status checklist and Phase 04 handoff.
- [x] `phase03-session05-bridge-deployment-options` - Provides current proxy and bridge deployment boundaries.

### Required Tools/Knowledge

- `rg` for source and documentation audit.
- Read access to `/home/aiwithapex/projects/Luminari-Source`.
- Familiarity with MSDP, GMCP, MCCP, MXP, NAWS, CHARSET, TTYPE, and Telnet negotiation.
- Luminari Web protocol docs and tests under `docs/`, `shared/`, `server/`, and `tests/`.

### Environment Requirements

- Local Luminari-Source checkout exists at `/home/aiwithapex/projects/Luminari-Source`.
- No live captures are required. If any validation notes mention live data, redact commands, credentials, private hosts, and terminal transcripts.
- Source facts copied into this repository must be summarized with file references, not pasted as large source excerpts.

---

## 4. Scope

### In Scope (MVP)

- Maintainer can review source protocol TODOs from Luminari-Source - inspect `protocol.c`, `protocol.h`, `comm.c`, and protocol docs.
- Maintainer can see ranked source protocol candidates - score player value, risk, and testability in `docs/source-protocol-backlog.md`.
- Maintainer can distinguish accepted, deferred, and rejected work - include explicit reason and next validation step for each item.
- Maintainer can trace accepted candidates to web client value - map candidates to panels, proxy behavior, fixtures, and fallback expectations.
- Maintainer can start later Phase 04 sessions from the audit - link the backlog from `docs/protocol-feature-checklist.md`.

### Out of Scope (Deferred)

- Implementing protocol behavior changes - *Reason: Session 02 must define validation coverage before behavior changes.*
- Claiming MCCP, GMCP, live `MINIMAP`, `QUEST_INFO`, `TITLE`, saves, or `DAMAGE_BONUS` support - *Reason: Current evidence is incomplete or explicitly rejected/deferred.*
- Replacing the current `/ws` proxy contract - *Reason: Native WebSocket feasibility is Session 05.*
- Adding client UI panels or mappings - *Reason: This session only ranks and documents source-level options.*
- Copying large source excerpts into this repository - *Reason: Keep the backlog concise, maintainable, and license-safe.*

---

## 5. Technical Approach

### Architecture

The session creates a maintainer-facing audit artifact in Luminari Web while treating Luminari-Source as a read-only authority. The audit should cross-reference the source files and docs with the existing web protocol checklist, parser tests, MSDP fixture coverage, bridge deployment notes, and Phase 04 PRD stubs.

The backlog should use a simple decision matrix: accepted candidate, deferred, or rejected; player value; source risk; validation requirement; client fallback expectation; and follow-up session. Accepted candidates must not imply support. They only authorize further scoped planning and validation.

### Design Patterns

- Evidence-backed documentation: cite source files and existing web docs for each decision.
- Conservative protocol claims: keep unsupported features unavailable until implementation and tests prove them.
- Read-only source audit: inspect external source without modifying it during this session.
- Follow-up mapping: assign accepted work to Session 02, Session 03, Session 04, Session 05, or future phases.

### Technology Stack

- Luminari-Source C protocol files and Markdown docs.
- Luminari Web React/TypeScript, Node proxy, shared protocol helpers, and test fixtures.
- Markdown maintainer documentation.

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `docs/source-protocol-backlog.md` | Ranked source protocol backlog, defer/reject list, validation mapping, and fallback notes. | ~220 |
| `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md` | Session notes, source files inspected, decisions made, and commands run. | ~80 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `docs/protocol-feature-checklist.md` | Link to the new backlog and update Phase 04 audit handoff notes without changing unsupported feature claims. | ~20 |
| `.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md` | Mark tasks complete during implementation. | ~20 |

### Read-Only Inputs

| File | Purpose |
|------|---------|
| `/home/aiwithapex/projects/Luminari-Source/src/protocol.c` | Protocol negotiation, MSDP/GMCP handling, MCCP stubs, parser risks. |
| `/home/aiwithapex/projects/Luminari-Source/src/protocol.h` | Protocol enums, structs, option declarations, and public helpers. |
| `/home/aiwithapex/projects/Luminari-Source/src/comm.c` | MSDP update and emission paths. |
| `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md` | Source-level protocol documentation and claims to verify. |
| `/home/aiwithapex/projects/Luminari-Source/docs/systems/MSDP_VARIABLES.md` | Source MSDP variable reference. |
| `/home/aiwithapex/projects/Luminari-Source/docs/project-management-zusuk/PROTOCOL_TODO.md` | Existing source protocol TODO/security backlog. |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Ranked backlog exists with source file or doc references for every item.
- [ ] Accepted candidates include player value, implementation risk, validation requirement, and fallback expectation.
- [ ] Deferred and rejected items explain why they are not safe or useful yet.
- [ ] Webclient-only alternatives are listed where source changes are unnecessary.
- [ ] Follow-up sessions can select work from the backlog without repeating the audit.

### Testing Requirements

- [ ] Documentation links resolve to existing local files.
- [ ] `npm run lint` and `npm run build` are either run successfully or documented as not applicable/blocking for this documentation session.
- [ ] Manual review confirms no new support claim is made for unsupported protocol features.

### Non-Functional Requirements

- [ ] Source facts are summarized and do not include large copied source excerpts.
- [ ] Any mention of live validation data preserves privacy redaction boundaries.
- [ ] The current proxy remains documented as the supported production path.

### Quality Gates

- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code and docs follow project conventions.

---

## 8. Implementation Notes

### Key Considerations

- The source TODO file calls out security-sensitive parser and string handling work. Rank it carefully, but do not broaden Session 01 into implementation.
- `docs/protocol-feature-checklist.md` is a status contract; update links and next actions without marking deferred features supported.
- The PRD keeps MCCP rejected until source compression and proxy decompression are real and tested.
- The PRD keeps GMCP deferred until source module schemas, proxy parser support, client contracts, and tests exist.
- Missing MSDP variables should stay candidates until source payload contracts and fallback behavior are specified.

### Potential Challenges

- Source docs may overstate support relative to current code: resolve conflicts by recording the discrepancy and requiring validation.
- TODO line numbers may drift: cite file paths and functions or sections where possible instead of fragile line-only references.
- Parser/security work can exceed one session quickly: keep this session to ranking and validation mapping.
- External source checkout may contain uncommitted changes: record the audit path and avoid modifying it.

### Relevant Considerations

- [P03] **Shared helper surface**: Future client protocol additions should stay behind tested shared helpers.
- [P03] **Source vs override boundaries**: Keep source-confirmed protocol data distinct from local UI preferences and override-only fields.
- [P03] **Evidence-backed protocol inventory**: Treat the checklist as maintainer guidance, not proof of live support.
- [P03] **Overclaiming protocol support**: Unsupported or deferred features stay marked as such until source-level support exists.
- [P03] **Browser-local config boundary**: Do not store commands, hosts, transcripts, tokens, or other sensitive data in browser-local configuration.

---

## 9. Testing Strategy

### Unit Tests

- No new unit tests are expected because this session creates documentation only.

### Integration Tests

- No integration tests are expected unless documentation changes unexpectedly touch code or generated docs tooling.

### Manual Testing

- Verify all Markdown links to repo-local files resolve.
- Review the backlog against the Phase 04 PRD and protocol checklist for conservative support claims.
- Confirm the source checkout paths are readable and named correctly.

### Edge Cases

- Source TODOs with critical security wording should be ranked by risk without implying immediate implementation.
- Features present in source docs but absent in Luminari Web support should remain deferred or validation-gap items.
- Older-server fallback expectations must be included for any candidate that changes emitted variables.

---

## 10. Dependencies

### External Libraries

- None.

### Other Sessions

- **Depends on**: `phase03-session06-protocol-feature-checklist`, `phase03-session05-bridge-deployment-options`
- **Depended by**: `phase04-session02-protocol-parser-test-harness`, `phase04-session03-missing-msdp-variables`, `phase04-session04-mccp-and-gmcp-decision`, `phase04-session05-native-websocket-feasibility`

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
