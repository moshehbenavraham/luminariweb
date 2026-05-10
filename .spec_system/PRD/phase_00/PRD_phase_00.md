# PRD Phase 00: Align With Real Luminari Data

**Status**: In Progress
**Sessions**: 5 (initial estimate)
**Estimated Duration**: 2-5 days

**Progress**: 2/5 sessions (40%)

---

## Overview

Phase 00 makes the current client honest about what Luminari-Source emits today, establishes repeatable local verification, and creates the fixture and test foundation needed for later protocol work.

---

## Progress Tracker

| Session | Name | Status | Est. Tasks | Validated |
|---------|------|--------|------------|-----------|
| 01 | Baseline Verification and Project Hygiene | Complete | ~12-25 | PASS |
| 02 | MSDP Variable Map Alignment | Complete | ~12-25 | PASS |
| 03 | Unavailable Data UX | Not Started | ~12-25 | - |
| 04 | MSDP Fixture Corpus | Not Started | ~12-25 | - |
| 05 | State Mapping Tests | Not Started | ~12-25 | - |

---

## Completed Sessions

- Session 01: Baseline Verification and Project Hygiene
- Session 02: MSDP Variable Map Alignment

---

## Upcoming Sessions

- Session 03: Unavailable Data UX
- Session 04: MSDP Fixture Corpus
- Session 05: State Mapping Tests

---

## Objectives

1. Align default client behavior with confirmed Luminari-Source MSDP variables.
2. Establish trusted lint, build, and development verification commands.
3. Create fixture and mapping-test foundations for later parser, proxy, and panel work.

---

## Prerequisites

- Master PRD exists at `.spec_system/PRD/PRD.md`.
- Luminari-Source protocol audit is captured in the master PRD.
- Current React, TypeScript, Vite, Express, and `ws` app sources are available.

---

## Technical Considerations

### Architecture

The codebase is a single React and Node TypeScript project. The frontend maps MSDP data into client-visible HUD and panel state, while the Node server bridges browser WebSocket traffic to Telnet and negotiates MSDP with the MUD.

### Technologies

- TypeScript
- React 19
- Vite
- Express
- `ws`
- Native Node `net` sockets
- ESLint and TypeScript build checks

### Risks

- Unsupported variables in the current default map may make the UI imply missing server features are broken client behavior: align defaults with audited source variables and add explicit fallback states.
- Test coverage is not yet committed: keep early tests focused on MSDP mapping and fixtures before broader parser changes.
- Real live payload shapes may differ from constructed examples: label fixtures as real captures or synthetic examples.

### Relevant Considerations

No active concerns, lessons learned, or tool notes are recorded yet.

---

## Success Criteria

Phase complete when:
- [ ] All 5 sessions completed
- [ ] Default MSDP requests match confirmed Luminari-Source variables
- [ ] Unsupported or uncertain data renders as deliberate unavailable states
- [ ] Representative MSDP fixtures exist for confirmed data shapes
- [ ] State mapping tests cover confirmed, unsupported, unknown, and override variables
- [ ] Local lint and build commands are repeatable or failures are documented as actionable follow-up work

---

## Dependencies

### Depends On

- Spec system initialization
- Master PRD and source protocol audit

### Enables

- Phase 01: Harden Terminal and Proxy
