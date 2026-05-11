# Implementation Notes

**Session ID**: `phase04-session05-native-websocket-feasibility`
**Started**: 2026-05-11 11:50
**Last Updated**: 2026-05-11 11:50

---

## Session Progress

| Metric | Value |
|--------|-------|
| Tasks Completed | 17 / 17 |
| Estimated Remaining | 0 hours |
| Blockers | 0 |

---

## Task Log

### 2026-05-11 - Session Start

**Environment verified**:
- [x] Spec system state resolved
- [x] Prerequisites confirmed
- [x] Directory structure ready

**Resolved session**:
- Current session: `phase04-session05-native-websocket-feasibility`
- Monorepo: false
- Active package: none

---

### Task T001 - Verify checkout state

**Started**: 2026-05-11 11:50
**Completed**: 2026-05-11 11:50
**Duration**: 1 minute

**Notes**:
- Verified Luminari Web checkout at `/home/aiwithapex/projects/luminariweb`.
- Verified Luminari-Source checkout at `/home/aiwithapex/projects/Luminari-Source`.
- Verified behavioral reference checkout at `EXAMPLES/mud-r`.
- Required reference files are present: `EXAMPLES/mud-r/src/main.rs`, `EXAMPLES/mud-r/Cargo.toml`, and `EXAMPLES/mud-r/web_client.html`.
- Required Luminari-Source docs are present: `/home/aiwithapex/projects/Luminari-Source/docs/systems/CORE_SERVER_ARCHITECTURE.md` and `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md`.
- Luminari Web has pre-existing spec workflow changes for this session: `.spec_system/state.json` and `.spec_system/specs/phase04-session05-native-websocket-feasibility/`.
- Luminari-Source already has unrelated dirty files from prior work; these were preserved and not reverted.
- `mud-r` checkout is clean.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded checkout state and path inventory.

**BQC Fixes**:
- N/A - checkout verification only.

---

### Task T002 - Run prerequisite checks

**Started**: 2026-05-11 11:50
**Completed**: 2026-05-11 11:51
**Duration**: 1 minute

**Notes**:
- Ran spec-system environment prerequisite check; result: pass.
- Ran tool prerequisite check for `rg`, `node`, and `npm`; result: pass.
- Tool versions observed: ripgrep 15.1.0, Node v24.14.0, npm 10.5.1.
- Source and reference paths required by the session were present.
- Blockers: none.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded prerequisite results.

**BQC Fixes**:
- N/A - prerequisite verification only.

---

## Audited Path Inventory

### Luminari Web

- `docs/adr/0003-native-websocket-transport-direction.md`
- `docs/source-protocol-backlog.md`
- `docs/protocol-feature-checklist.md`
- `docs/bridge-deployment-options.md`
- `docs/api/http-and-websocket.md`
- `docs/deployment.md`
- `docs/ARCHITECTURE.md`
- `docs/development.md`
- `shared/protocol-feature-status.ts`
- `tests/protocol-feature-status.test.ts`
- `server/index.ts`
- `server/mud-session.ts`
- `shared/mud.ts`

### Luminari-Source

- `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md`
- `/home/aiwithapex/projects/Luminari-Source/docs/systems/CORE_SERVER_ARCHITECTURE.md`
- `/home/aiwithapex/projects/Luminari-Source/src/comm.c`
- `/home/aiwithapex/projects/Luminari-Source/src/protocol.c`
- `/home/aiwithapex/projects/Luminari-Source/src/protocol.h`

### Behavioral Reference

- `EXAMPLES/mud-r/Cargo.toml`
- `EXAMPLES/mud-r/src/main.rs`
- `EXAMPLES/mud-r/web_client.html`

---

### Task T003 - Create session stubs and path inventory

**Started**: 2026-05-11 11:51
**Completed**: 2026-05-11 11:52
**Duration**: 1 minute

**Notes**:
- Created implementation notes from the implement workflow template.
- Created security and validation report stubs for the final session deliverables.
- Added audited path inventory covering Luminari Web docs/code, Luminari-Source docs/source files, and `mud-r` behavioral reference files.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Added session bookkeeping and path inventory.
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/security-compliance.md` - Created security review stub.
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/validation.md` - Created validation report stub.

**BQC Fixes**:
- N/A - documentation setup only.

---

### Task T004 - Audit `mud-r` dual transport behavior

**Started**: 2026-05-11 11:52
**Completed**: 2026-05-11 11:58
**Duration**: 6 minutes

**Notes**:
- Reviewed `EXAMPLES/mud-r/Cargo.toml`, `EXAMPLES/mud-r/src/main.rs`, and `EXAMPLES/mud-r/web_client.html` as behavior-only reference material.
- `mud-r` adds a WebSocket dependency and models descriptors with either a Telnet stream or a WebSocket stream.
- The reference starts a second listener on the MUD port plus one, accepts both Telnet and WebSocket descriptors in the same game loop, and buffers WebSocket frame payloads into the existing input path.
- Output is sent as text WebSocket messages for WebSocket descriptors and as socket writes for Telnet descriptors.
- The browser reference client connects directly to the source WebSocket listener and treats messages as terminal text, not as Luminari Web typed JSON app messages.
- The reference does not provide the current Luminari Web proxy controls: typed browser message validation, destination allowlist, origin policy equivalent, proxy-side command throttling, MSDP-to-panel state mapping, or sanitized app status semantics.
- No source, sample client, command text, service file, or configuration text was copied.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded behavior-only `mud-r` audit observations.

**BQC Fixes**:
- Trust boundary enforcement: Preserved the distinction between raw terminal WebSocket behavior and Luminari Web typed `/ws` app messages.
- Error information boundaries: Avoided copying reference client strings or private/live data into product docs.

---

### Task T005 - Audit current Luminari Web `/ws` boundary

**Started**: 2026-05-11 11:58
**Completed**: 2026-05-11 12:03
**Duration**: 5 minutes

**Notes**:
- Reviewed `docs/api/http-and-websocket.md`, `docs/bridge-deployment-options.md`, `docs/deployment.md`, `docs/ARCHITECTURE.md`, `docs/development.md`, `server/index.ts`, `server/mud-session.ts`, and `shared/mud.ts`.
- The browser `/ws` route is an application protocol with typed JSON browser messages and typed server messages, not raw Telnet bytes.
- `server/index.ts` validates JSON shape, connect host/port, resize dimensions, origin policy, active WebSocket count, duplicate connect validation, and destination policy before opening a MUD TCP socket.
- `server/mud-session.ts` owns Telnet socket lifecycle, parser state, MSDP initialization, state reset, connect and idle timers, command throttling, sanitized status messages, and cleanup on browser close.
- The current docs consistently state that blind WebSocket-to-TCP bridges cannot replace `/ws` because they do not validate app messages, negotiate MSDP for the app, emit state messages, or preserve status semantics.
- Deployment docs place HTTPS/WSS termination, reverse proxy handling, health checks, alerting, and redaction policy with operators while keeping the integrated proxy as the supported app path.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded current web proxy and deployment boundary audit.

**BQC Fixes**:
- Contract alignment: Reconfirmed that any native source WebSocket path must not be described as equivalent to `/ws` unless it implements the typed browser/server contract.
- Failure path completeness: Preserved current sanitized connection-status behavior as a required parity gate.

---

### Task T006 - Audit Luminari-Source transport implications

**Started**: 2026-05-11 12:03
**Completed**: 2026-05-11 12:09
**Duration**: 6 minutes

**Notes**:
- Reviewed `/home/aiwithapex/projects/Luminari-Source/docs/systems/CORE_SERVER_ARCHITECTURE.md`, `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md`, `/home/aiwithapex/projects/Luminari-Source/src/comm.c`, `/home/aiwithapex/projects/Luminari-Source/src/protocol.c`, and `/home/aiwithapex/projects/Luminari-Source/src/protocol.h`.
- Luminari-Source is documented as a single-threaded event-driven server using a mother Telnet socket, descriptor list, `select()` loop, and pulse-based game logic.
- Descriptor creation initializes protocol state through `ProtocolCreate()` and runs Telnet/protocol negotiation before normal play.
- Input processing reads raw socket data, passes it through `ProtocolInput()`, and queues line commands; output processing passes generated text through the descriptor output path.
- Cleanup closes the socket, unlinks the descriptor, frees protocol state through `ProtocolDestroy()`, cancels descriptor events, handles character/save state, and releases account/editor state.
- Copyover is part of the startup and protocol state model, so a native WebSocket listener would need explicit copyover representation and recovery semantics rather than only a socket accept path.
- Luminari-Source docs already describe the current Luminari Web path as browser JSON to integrated proxy, then Telnet to source. There is no audited native source WebSocket listener today.
- Pre-existing dirty Luminari-Source files were preserved; source edits later in this session are limited to docs requested by the spec.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded source transport, descriptor, parser, and cleanup audit observations.

**BQC Fixes**:
- Resource cleanup: Identified descriptor, protocol, event, and copyover cleanup as required gates for any future source listener.
- State freshness on re-entry: Identified copyover and reconnect state as explicit native transport design requirements.
- Contract alignment: Kept source Telnet/protocol mechanics separate from the Luminari Web `/ws` app contract.

---

## Transport Comparison Matrix

| Option | Browser contract | Security owner | Protocol/state owner | Operations shape | Rollback expectation | Recommendation |
|--------|------------------|----------------|----------------------|------------------|----------------------|----------------|
| Integrated proxy | Existing `/ws` JSON app protocol | Luminari Web proxy | Proxy Telnet/MSDP parser and shared state mapping | Node app behind HTTPS/WSS terminator | Redeploy prior web revision or restore proxy config | Keep as supported production path |
| Isolated integrated proxy | Existing `/ws` JSON app protocol | Same proxy controls, isolated by process/host/container/network | Same parser and state mapping | Separate runtime or network boundary | Route traffic back to known-good integrated proxy | Preferred hardening path |
| Terminal-only bridge | Raw terminal bytes or text frames | Operator-supplied bridge policy | None for Luminari Web panels | Separate raw client route | Remove bridge route and send users back to integrated proxy | Separate fallback only |
| Mapped bridge | Raw terminal transport behind fixed targets | Operator-supplied mapping and auth | None for Luminari Web panels | Separate mapped route or service | Remove mapped route and keep `/ws` unchanged | Separate fallback only |
| Native source WebSocket | Must be defined: raw terminal, source app protocol, or `/ws` compatibility | Luminari-Source plus edge/operator controls | Source descriptor/parser plus optional app-state contract | New source listener, WSS/TLS termination, health, observability, quotas | Disable listener or route clients back to integrated proxy without data migration | Defer behind explicit gates |

### Task T007 - Compare transport options

**Started**: 2026-05-11 12:09
**Completed**: 2026-05-11 12:12
**Duration**: 3 minutes

**Notes**:
- Compared integrated proxy, isolated integrated proxy, terminal-only bridge, mapped bridge, and native source WebSocket options.
- The current integrated proxy is the only option that currently preserves typed `/ws` messages, Telnet/MSDP negotiation, MSDP panel state, duplicate connect handling, command throttling, status messages, and destination policy.
- Isolating the integrated proxy improves deployment boundaries without changing client behavior.
- Terminal-only and mapped bridges can be useful fallback transports only when users expect raw terminal behavior and no Luminari Web HUD/panel state.
- Native source WebSocket remains a candidate only if a future source transport and web contract prove equivalent security, protocol, operations, and rollback behavior.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Added transport comparison matrix and rollback expectations.

**BQC Fixes**:
- Contract alignment: Compared each option against the actual browser contract instead of the transport label.
- External dependency resilience: Required native transport operations and rollback gates before public support claims.

---

### Task T008 - Define threat model and decision criteria

**Started**: 2026-05-11 12:12
**Completed**: 2026-05-11 12:15
**Duration**: 3 minutes

**Notes**:
- Defined assets, entry points, and required gates for any future source-native WebSocket support.
- Required gates cover browser contract, origin/auth, message validation, rate limits, quotas, destination policy, parser isolation, copyover lifecycle, logging/privacy, WSS/TLS, observability, and rollback.
- Decision criteria: defer native source WebSocket behind dedicated source, browser contract, security, operations, test, and rollback work; reject raw bridge or raw source endpoint replacement for `/ws`.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/security-compliance.md` - Added threat model and decision criteria.
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded completion notes.

**BQC Fixes**:
- Trust boundary enforcement: Required explicit validation and auth/origin gates at the future browser-facing listener.
- Duplicate action prevention: Required per-descriptor and per-principal throttles and quotas.
- Error information boundaries: Required privacy-safe logging and sanitized observability.

---

### Task T009 - Create native WebSocket ADR

**Started**: 2026-05-11 12:15
**Completed**: 2026-05-11 12:20
**Duration**: 5 minutes

**Notes**:
- Created ADR 0003 with an accepted decision to defer native Luminari-Source WebSocket support behind future source, client, security, operations, test, and rollback specs.
- ADR preserves the integrated `/ws` proxy as the supported production path.
- ADR rejects treating raw terminal bridges or raw source WebSocket endpoints as replacements for the current typed `/ws` application protocol.
- ADR records `mud-r` as behavior-only reference material and avoids copied source or sample client content.

**Files Changed**:
- `docs/adr/0003-native-websocket-transport-direction.md` - Added native WebSocket transport direction ADR.
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded completion notes.

**BQC Fixes**:
- Contract alignment: ADR distinguishes raw terminal, source app protocol, and `/ws` compatibility.
- Trust boundary enforcement: ADR requires browser-facing validation, origin/auth, quota, and privacy gates before support.

---

### Task T010 - Update source protocol backlog

**Started**: 2026-05-11 12:20
**Completed**: 2026-05-11 12:25
**Duration**: 5 minutes

**Notes**:
- Added ADR 0003 to the evidence baseline.
- Replaced the Session 05 placeholder with a final decision update: native source WebSocket is deferred by ADR 0003 and the integrated proxy remains supported.
- Updated O3 ranking, rejected candidates, webclient-only alternatives, follow-up session map, candidate summary, and claim boundaries.
- Added future phase/session breakdown for source native transport design, browser contract decision, security controls, operations runbook, web compatibility validation, and rollback gates.

**Files Changed**:
- `docs/source-protocol-backlog.md` - Synchronized O3 decision, future work split, and claim boundaries.
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded completion notes.

**BQC Fixes**:
- Contract alignment: Backlog now states that native source WebSocket remains deferred until contract parity is explicitly proven.
- Trust boundary enforcement: Follow-up map includes security and abuse-control gates before any exposure.

---

### Task T011 - Update architecture, API, bridge, deployment, and development docs

**Started**: 2026-05-11 12:25
**Completed**: 2026-05-11 12:31
**Duration**: 6 minutes

**Notes**:
- Updated architecture docs to cite ADR 0003 and keep native source WebSocket deferred behind source, contract, security, operations, compatibility, and rollback gates.
- Updated API docs to clarify that the current `/ws` browser app contract remains typed JSON and is not replaced by source-native transport.
- Updated bridge deployment options to distinguish native source WebSocket from blind bridge fallbacks.
- Updated deployment docs with future native experiment rollback expectations.
- Updated development guidance so maintainers do not claim native source WebSocket support.

**Files Changed**:
- `docs/ARCHITECTURE.md` - Added ADR 0003 native transport boundary.
- `docs/api/http-and-websocket.md` - Clarified current `/ws` contract and source-native non-replacement.
- `docs/bridge-deployment-options.md` - Added deferred native source WebSocket row and distinction from bridges.
- `docs/deployment.md` - Added native transport deferral and rollback guidance.
- `docs/development.md` - Updated conservative protocol claim guidance.
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded completion notes.

**BQC Fixes**:
- Contract alignment: Synchronized docs around typed JSON `/ws` as the supported app contract.
- Failure path completeness: Deployment docs now keep rollback to integrated proxy explicit for future experiments.

---

### Task T012 - Update protocol checklist, status catalog, and tests

**Started**: 2026-05-11 12:31
**Completed**: 2026-05-11 12:36
**Duration**: 5 minutes

**Notes**:
- Updated native source WebSocket in the shared protocol status catalog while keeping status `deferred`.
- Added ADR 0003 and source backlog evidence to the native WebSocket record.
- Added focused conservative assertions that native WebSocket is not supported, remains deferred, links ADR 0003 evidence, and points to future dedicated specs.
- Updated the maintainer checklist native WebSocket row, Phase 04 input notes, and claim boundaries.

**Files Changed**:
- `shared/protocol-feature-status.ts` - Updated native WebSocket deferred status record and evidence.
- `tests/protocol-feature-status.test.ts` - Added conservative native WebSocket assertions.
- `docs/protocol-feature-checklist.md` - Synchronized native WebSocket status and claim boundaries.
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded completion notes.

**BQC Fixes**:
- Contract alignment: Tests now guard against accidental native WebSocket support claims.
- Error information boundaries: Status details stay evidence-based and do not expose private or live-session data.

---

### Task T013 - Update Luminari-Source maintainer docs

**Started**: 2026-05-11 12:36
**Completed**: 2026-05-11 12:41
**Duration**: 5 minutes

**Notes**:
- Updated source protocol docs to state that native source WebSocket support is not implemented or claimed today.
- Added future gates for descriptor lifecycle, frame/app contract, parser isolation, copyover, origin/auth, validation, quotas, throttles, privacy-safe logging, WSS/TLS, health checks, observability, and rollback.
- Updated core server architecture docs to show that a native listener would affect networking, descriptors, frame handling, copyover, operations, and rollback.
- Preserved pre-existing dirty Luminari-Source source and docs changes; this session only appended maintainer documentation.

**Files Changed**:
- `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md` - Added no-current-native-WebSocket claim and future gates.
- `/home/aiwithapex/projects/Luminari-Source/docs/systems/CORE_SERVER_ARCHITECTURE.md` - Added future native WebSocket networking considerations.
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded completion notes.

**BQC Fixes**:
- Resource cleanup: Source docs now require descriptor close and cleanup design for native WebSocket descriptors.
- State freshness on re-entry: Source docs now require copyover and rollback behavior before support.
- Trust boundary enforcement: Source docs now require origin/auth, validation, quotas, and privacy-safe logging gates.

---

## Final Decision Summary

Native Luminari-Source WebSocket support is deferred. The integrated Luminari
Web proxy remains the supported production path for the first-party React app.
ADR 0003 rejects replacing `/ws` with a raw bridge or raw source WebSocket
endpoint and requires future source, browser contract, security, operations,
compatibility-test, and rollback gates before any support claim.

### Evidence Reviewed

- `mud-r` dual Telnet/WebSocket behavior was reviewed as reference-only input.
- Luminari Web `/ws` docs and code confirm typed JSON browser messages,
  destination policy, origin checks, quotas, command throttling, Telnet/MSDP
  negotiation, state mapping, timeouts, sanitized status messages, and cleanup.
- Luminari-Source docs and source confirm the current Telnet descriptor,
  protocol parser, copyover, cleanup, and MSDP update model with no current
  audited native WebSocket listener.

### Follow-Up Scope

- Future source native transport design.
- Future browser contract decision.
- Future security and abuse-control spec.
- Future operations runbook and rollback drill.
- Future web compatibility and protocol status validation.

### Privacy-Safe Reference Notes

- No live private data was used.
- No credentials, private hosts, player command text, character names from live
  sessions, tokens, terminal transcripts, or raw frame payloads were recorded.
- No reference source, sample client code, service files, command text, or
  configuration snippets were copied.

---

### Task T014 - Finalize notes and security review

**Started**: 2026-05-11 12:41
**Completed**: 2026-05-11 12:46
**Duration**: 5 minutes

**Notes**:
- Updated implementation notes with final decision, evidence reviewed, follow-up scope, and privacy-safe reference observations.
- Completed security review with outcome, security result, privacy review, and behavioral quality review.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Added final decision summary and T014 log.
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/security-compliance.md` - Completed decision, privacy, and behavioral quality review.

**BQC Fixes**:
- Contract alignment: Final notes and security review consistently preserve current `/ws` contract.
- Error information boundaries: Privacy review confirms no sensitive data or copied reference implementation text was added.

---

### Task T015 - Run focused protocol status tests

**Started**: 2026-05-11 12:46
**Completed**: 2026-05-11 12:47
**Duration**: 1 minute

**Notes**:
- Ran `node --import tsx --test tests/protocol-feature-status.test.ts`.
- Result: pass, 6 tests passed.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded focused test result.

**BQC Fixes**:
- N/A - verification only.

---

### Task T016 - Run full tests, lint, and build

**Started**: 2026-05-11 12:47
**Completed**: 2026-05-11 12:49
**Duration**: 2 minutes

**Notes**:
- Ran `npm test`.
- Result: pass, 163 tests passed.
- Ran `npm run lint`.
- Result: pass.
- Ran `npm run build`.
- Result: pass.
- Existing build warning: Vite reports one client chunk larger than 500 kB after minification.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded verification results.

**BQC Fixes**:
- N/A - verification only.

---

### Task T017 - Validate ASCII/LF and complete validation report

**Started**: 2026-05-11 12:49
**Completed**: 2026-05-11 12:55
**Duration**: 6 minutes

**Notes**:
- Checked session spec-system files for non-ASCII bytes and CRLF line endings.
- Checked modified web docs/code/test files for non-ASCII bytes and CRLF line endings.
- Checked modified Luminari-Source docs for non-ASCII bytes and CRLF line endings.
- Ran `git diff --check`; result: pass.
- Completed validation report with command results, checklist, outcome, and follow-up scope.

**Files Changed**:
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/validation.md` - Completed final validation report.
- `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` - Recorded final validation task.

**BQC Fixes**:
- N/A - validation only.

---
