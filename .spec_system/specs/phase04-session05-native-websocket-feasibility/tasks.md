# Task Checklist

**Session ID**: `phase04-session05-native-websocket-feasibility`
**Total Tasks**: 17
**Estimated Duration**: 2.5-3.5 hours
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
| Implementation | 6 | 6 | 0 |
| Testing | 3 | 3 | 0 |
| **Total** | **17** | **17** | **0** |

---

## Setup (3 tasks)

Initial verification and session bookkeeping.

- [x] T001 [S0405] Verify Luminari Web, Luminari-Source, and `mud-r` reference checkout state without using live private data (`.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md`)
- [x] T002 [S0405] Run prerequisite checks for `rg`, `node`, `npm`, and the source/reference paths, recording any blockers (`.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md`)
- [x] T003 [S0405] Create implementation notes, security review stub, validation stub, and audited path inventory (`.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md`)

---

## Foundation (5 tasks)

Reference audit, current-boundary audit, and decision framing.

- [x] T004 [S0405] [P] Audit `mud-r` dual Telnet/WebSocket architecture as behavioral reference without copying code (`EXAMPLES/mud-r/src/main.rs`, `EXAMPLES/mud-r/Cargo.toml`, `EXAMPLES/mud-r/web_client.html`)
- [x] T005 [S0405] [P] Audit current Luminari Web `/ws` contract, bridge decision, deployment guardrails, and proxy-owned controls (`docs/api/http-and-websocket.md`, `docs/bridge-deployment-options.md`, `docs/deployment.md`)
- [x] T006 [S0405] [P] Audit Luminari-Source networking, descriptor lifecycle, copyover, and protocol parser implications for any future native listener (`/home/aiwithapex/projects/Luminari-Source/docs/systems/CORE_SERVER_ARCHITECTURE.md`, `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md`)
- [x] T007 [S0405] Compare integrated proxy, isolated integrated proxy, terminal-only bridge, mapped bridge, and native source WebSocket options with explicit rollback expectations (`.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md`)
- [x] T008 [S0405] Define the native transport threat model and decision criteria with origin/auth, message validation, quotas, logging, parser, operations, and privacy gates (`.spec_system/specs/phase04-session05-native-websocket-feasibility/security-compliance.md`)

---

## Implementation (6 tasks)

Decision record, synchronized status, and documentation.

- [x] T009 [S0405] Create native WebSocket ADR with pursue, defer, or reject outcome, rationale, consequences, and follow-up gates (`docs/adr/0003-native-websocket-transport-direction.md`)
- [x] T010 [S0405] Update source protocol backlog with final O3 decision, comparison summary, and future phase or session breakdown (`docs/source-protocol-backlog.md`)
- [x] T011 [S0405] Update web architecture, API, bridge, deployment, and development docs while preserving the current `/ws` application protocol (`docs/ARCHITECTURE.md`, `docs/api/http-and-websocket.md`, `docs/bridge-deployment-options.md`, `docs/deployment.md`, `docs/development.md`)
- [x] T012 [S0405] Update protocol feature checklist and shared status records with evidence-backed native WebSocket status and exhaustive claim tests (`docs/protocol-feature-checklist.md`, `shared/protocol-feature-status.ts`, `tests/protocol-feature-status.test.ts`)
- [x] T013 [S0405] Update source maintainer docs to distinguish no current native WebSocket support from any future gated transport path (`/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md`, `/home/aiwithapex/projects/Luminari-Source/docs/systems/CORE_SERVER_ARCHITECTURE.md`)
- [x] T014 [S0405] Update session notes and security review with final decision, validated evidence, follow-up scope, and privacy-safe reference observations (`.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md`, `.spec_system/specs/phase04-session05-native-websocket-feasibility/security-compliance.md`)

---

## Testing (3 tasks)

Verification and quality gates.

- [x] T015 [S0405] Run focused protocol status tests and record results (`tests/protocol-feature-status.test.ts`)
- [x] T016 [S0405] Run full web tests, lint, and build, documenting any existing warnings separately from failures (`package.json`)
- [x] T017 [S0405] Validate ASCII/LF for spec-system files and complete the validation report (`.spec_system/specs/phase04-session05-native-websocket-feasibility/validation.md`)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] Native WebSocket decision recorded and synchronized
- [x] Future phase/session breakdown documented if native transport remains a candidate
- [x] Focused protocol status tests passing
- [x] `npm test`, `npm run lint`, and `npm run build` passing or blockers documented
- [x] All files ASCII-encoded
- [x] `implementation-notes.md` updated
- [x] `security-compliance.md` updated
- [x] `validation.md` updated
- [x] Ready for the validate workflow step

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
