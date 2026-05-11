# Task Checklist

**Session ID**: `phase03-session06-protocol-feature-checklist`
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

- [x] T001 [S0306] Verify parser tests, MSDP fixtures, protocol docs, Phase 04 PRD text, and quality commands are available (`tests/README.md`)
- [x] T002 [S0306] [P] Create implementation notes for protocol audit findings, status decisions, validation results, and handoff evidence (`.spec_system/specs/phase03-session06-protocol-feature-checklist/implementation-notes.md`)
- [x] T003 [S0306] [P] Create security and compliance notes for protocol-claim risk, command privacy, local-only data, and unsupported feature wording (`.spec_system/specs/phase03-session06-protocol-feature-checklist/security-compliance.md`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0306] Audit current Telnet parser negotiation behavior for ANSI text, UTF-8 decoding, TTYPE, NAWS, MSDP readiness, MCCP rejection, CHARSET rejection, MXP rejection, and unsupported options without changing behavior (`server/telnet-parser.ts`)
- [x] T005 [S0306] Audit source-confirmed, optional, and override-only MSDP variables for protocol status inputs and future-source gaps (`shared/mud.ts`)
- [x] T006 [S0306] Audit PRD source facts, Phase 04 objectives, bridge deployment boundaries, and quest/minimap follow-up notes for checklist evidence (`.spec_system/PRD/PRD.md`)
- [x] T007 [S0306] Create typed protocol feature status catalog with exhaustive status values, evidence links, deterministic grouping, and Phase 04 follow-up tags (`shared/protocol-feature-status.ts`)
- [x] T008 [S0306] [P] Create ranked Phase 04 protocol follow-up document for TODO audit, parser harness, missing MSDP variables, MCCP/GMCP decision, and native WebSocket feasibility (`.spec_system/specs/phase03-session06-protocol-feature-checklist/phase04-protocol-follow-up.md`)

---

## Implementation (8 tasks)

Main feature implementation.

- [x] T009 [S0306] Create maintainer protocol checklist with supported, partial, rejected, deferred, and validation-gap rows linked to tests, source facts, docs, and prerequisites (`docs/protocol-feature-checklist.md`)
- [x] T010 [S0306] Update architecture documentation to link the protocol checklist and clarify client, proxy, source, and bridge support boundaries (`docs/ARCHITECTURE.md`)
- [x] T011 [S0306] Update HTTP/WebSocket contract docs to link protocol feature statuses and preserve the structured `/ws` application protocol boundary (`docs/api/http-and-websocket.md`)
- [x] T012 [S0306] Update development guide with protocol checklist workflow, focused test command, and conservative source-validation guidance (`docs/development.md`)
- [x] T013 [S0306] Add Protocol inspector tab id support with parser-safe stored preference handling for unknown and future tab values (`shared/client-layout-preferences.ts`)
- [x] T014 [S0306] Render Protocol inspector status sections from the shared catalog with exhaustive status handling, deterministic ordering, accessible tab labels, focus preservation, and no live-support overclaiming (`src/App.tsx`)
- [x] T015 [S0306] Style Protocol inspector rows, status badges, evidence links, and long notes with responsive wrapping at desktop, 390px, and 360px widths (`src/App.css`)
- [x] T016 [S0306] Update README and test documentation with protocol checklist links, focused status-test coverage, and manual Protocol tab smoke checks (`README.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0306] [P] Add protocol status tests for required feature coverage, evidence presence, status exhaustiveness, deterministic grouping, deferred follow-ups, and MCCP/GMCP not marked supported (`tests/protocol-feature-status.test.ts`)
- [x] T018 [S0306] [P] Update layout preference tests for the Protocol tab, corrupt storage fallback, unknown future ids, and stored tab restoration (`tests/client-layout-preferences.test.ts`)
- [x] T019 [S0306] Run focused tests, full test suite, lint, and production build, then fix or document any failures (`package.json`)
- [x] T020 [S0306] Validate ASCII encoding, docs consistency, UI status wording, mobile manual-check notes, no protocol behavior changes, and final handoff notes (`.spec_system/specs/phase03-session06-protocol-feature-checklist/implementation-notes.md`)

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

Run the validate workflow step to verify session completeness.
