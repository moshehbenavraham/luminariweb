# Task Checklist

**Session ID**: `phase03-session05-bridge-deployment-options`
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
| Foundation | 4 | 4 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0305] Verify Phase 01 proxy safeguards, current deployment docs, public-mode environment variables, and quality commands are available (`docs/deployment.md`)
- [x] T002 [S0305] [P] Create implementation notes for bridge reference review, topology findings, decisions, and validation evidence (`.spec_system/specs/phase03-session05-bridge-deployment-options/implementation-notes.md`)
- [x] T003 [S0305] [P] Create security and compliance notes for public-mode protections, bridge logging risks, command redaction, and no copied reference code (`.spec_system/specs/phase03-session05-bridge-deployment-options/security-compliance.md`)

---

## Foundation (4 tasks)

Core structures and base implementations.

- [x] T004 [S0305] [P] Review `websockify` deployment behavior, TLS, token routing, Docker operation, recording/logging risks, and license boundary (`EXAMPLES/websockify/README.md`)
- [x] T005 [S0305] [P] Review `wsgate-server` mapped-target behavior, JWT authorization, timeouts, TCP dump risks, and license boundary (`EXAMPLES/wsgate-server/README.md`)
- [x] T006 [S0305] Audit integrated proxy policy, origin checks, destination validation, rate limits, connection limits, timeout settings, and command-log posture (`server/proxy-policy.ts`)
- [x] T007 [S0305] Create topology comparison and recommendation document with integrated proxy default, bridge fallback limits, operator checklist, and behavior-only reference notes (`docs/bridge-deployment-options.md`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T008 [S0305] Update deployment docs with default topology, bridge decision link, public-mode checklist, HTTPS/WSS expectations, and reverse-proxy/operator responsibilities (`docs/deployment.md`)
- [x] T009 [S0305] Update environment docs with production public-mode defaults, custom-routing flags, timeout variables, and bridge/non-bridge expectations (`docs/environments.md`)
- [x] T010 [S0305] Update architecture docs to align with current proxy hardening and clarify integrated application `/ws` versus blind bridge byte forwarding (`docs/ARCHITECTURE.md`)
- [x] T011 [S0305] Update HTTP/WebSocket contract docs to state that `/ws` is structured app messaging and direct websockify or wsgate replacement is incompatible (`docs/api/http-and-websocket.md`)
- [x] T012 [S0305] Update server README with current proxy responsibilities, public deployment controls, and command-log redaction expectations (`server/README_server.md`)
- [x] T013 [S0305] Add bridge fallback runbook with decision criteria, safe operating boundaries, disabled recording/TCP dump guidance, rollback, and incident escalation paths (`docs/runbooks/bridge-fallback.md`)
- [x] T014 [S0305] Update README deployment links with operator docs and bridge decision references without changing product positioning (`README.md`)
- [x] T015 [S0305] Update onboarding guidance with deployment topology, proxy-policy validation, and reference-use boundaries (`docs/onboarding.md`)
- [x] T016 [S0305] Update test documentation with deployment-policy coverage, focused command, and manual public-mode smoke checks (`tests/README.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0305] [P] Add deployment-policy regression tests for public default rejection, allowlist acceptance, origin rejection, banned ports, unsafe network blocking, timeout clamping, and sanitized errors (`tests/proxy-deployment-policy.test.ts`)
- [x] T018 [S0305] [P] Run focused deployment-policy tests, then fix or document any failures (`tests/proxy-deployment-policy.test.ts`)
- [x] T019 [S0305] Run the full Node test suite, lint, and production build, then fix or document any failures (`package.json`)
- [x] T020 [S0305] Validate ASCII encoding, docs consistency, no copied reference code/config, command-log redaction posture, and final handoff notes (`.spec_system/specs/phase03-session05-bridge-deployment-options/implementation-notes.md`)

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
