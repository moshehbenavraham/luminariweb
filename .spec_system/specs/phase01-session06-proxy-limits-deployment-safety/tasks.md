# Task Checklist

**Session ID**: `phase01-session06-proxy-limits-deployment-safety`
**Total Tasks**: 22
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
| Foundation | 6 | 6 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **22** | **22** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0106] Verify Phase 1 Session 05 completion, current proxy tests, and deployment safety prerequisites, then record evidence (`.spec_system/specs/phase01-session06-proxy-limits-deployment-safety/implementation-notes.md`)
- [x] T002 [S0106] Define public/private proxy policy defaults, environment variable names, failure modes, and no-command-log expectations (`.spec_system/specs/phase01-session06-proxy-limits-deployment-safety/security-compliance.md`)
- [x] T003 [S0106] [P] Review curated app presets and existing deployment safety notes to confirm allowed route sources (`.spec_system/specs/phase01-session06-proxy-limits-deployment-safety/implementation-notes.md`)

---

## Foundation (6 tasks)

Core structures and base implementations.

- [x] T004 [S0106] [P] Create network classification helpers for IPv4, IPv6, IPv4-mapped IPv6, metadata-service, private, loopback, link-local, multicast, reserved, and public ranges (`server/proxy-network.ts`)
- [x] T005 [S0106] Create proxy policy module for typed environment parsing, normalized allowlists, origin settings, timeout settings, and sanitized accept/reject decisions with schema-validated input and explicit error mapping (`server/proxy-policy.ts`)
- [x] T006 [S0106] Add network classification regression tests for unsafe ranges, public ranges, malformed addresses, and banned service ports (`tests/proxy-network.test.ts`)
- [x] T007 [S0106] Add proxy policy regression tests for public allowlist mode, custom-routing mode, origin policy, DNS failures, unsafe resolved addresses, and sanitized rejection details (`tests/proxy-policy.test.ts`)
- [x] T008 [S0106] Extend MUD socket abstractions and session options for timeout hooks while preserving active-socket cleanup ownership with cleanup on scope exit for all acquired resources (`server/mud-session.ts`)
- [x] T009 [S0106] Update proxy lifecycle harness fake socket support for timeout events, active socket identity, and policy-aware connection assertions (`tests/helpers/proxy-lifecycle-harness.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T010 [S0106] Wire proxy policy construction into server startup, preserving `/health`, `/api/settings`, `/ws`, HTTP rate limits, and WebSocket quota behavior (`server/index.ts`)
- [x] T011 [S0106] Enforce WebSocket origin policy before MUD socket creation with authorization enforced at the boundary closest to the resource (`server/index.ts`)
- [x] T012 [S0106] Validate browser `connect` messages through asynchronous destination policy before `MudSession.connect` with duplicate-trigger prevention while in-flight (`server/index.ts`)
- [x] T013 [S0106] Enforce destination allowlists, explicit custom-routing mode, DNS resolution checks, unsafe address rejection, and banned ports with timeout, retry/backoff, and failure-path handling (`server/proxy-policy.ts`)
- [x] T014 [S0106] Add connect timeout and idle timeout behavior that resets parser, MSDP state, and timers only for the active MUD socket (`server/mud-session.ts`)
- [x] T015 [S0106] Preserve command redaction in policy rejections, socket errors, timeout statuses, and lifecycle cleanup details (`server/mud-session.ts`)
- [x] T016 [S0106] [P] Update deployment documentation for public/private proxy mode, destination allowlists, origin checks, DNS/IP blocking, quotas, rate limits, and timeouts (`docs/deployment.md`)
- [x] T017 [S0106] [P] Update environment documentation with proxy safety variables, defaults, required production values, and private-operator override warnings (`docs/environments.md`)
- [x] T018 [S0106] [P] Update WebSocket API documentation with connect rejection behavior, sanitized status details, and public deployment failure cases (`docs/api/http-and-websocket.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T019 [S0106] Add lifecycle regression tests for connect timeout, idle timeout, stale timeout callbacks, manual disconnect races, and no raw command leakage (`tests/proxy-lifecycle.test.ts`)
- [x] T020 [S0106] [P] Update test documentation with proxy safety coverage, focused commands, and live-MUD-free validation limits (`tests/README.md`)
- [x] T021 [S0106] Run `npm test`, `npm run lint`, and `npm run build`, then record command evidence and any follow-up risks (`.spec_system/specs/phase01-session06-proxy-limits-deployment-safety/implementation-notes.md`)
- [x] T022 [S0106] Validate ASCII encoding, Unix LF line endings, security notes, documentation consistency, and completion checklist readiness (`.spec_system/specs/phase01-session06-proxy-limits-deployment-safety/security-compliance.md`)

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

Run the implement workflow step to begin AI-led implementation.
