# PRD Phase 01: Harden Terminal and Proxy

**Status**: Complete
**Sessions**: 6
**Estimated Duration**: 3-6 days

**Progress**: 6/6 sessions (100%)

---

## Overview

Make the proxy and terminal safe under real Telnet traffic, reconnects, malformed data, resize events, and deployment pressure. This phase builds on the Phase 00 MSDP alignment and fixture foundation before expanding player-facing game panels.

---

## Progress Tracker

| Session | Name | Status | Est. Tasks | Validated |
|---------|------|--------|------------|-----------|
| 01 | Telnet Parser Edge-Case Tests | Completed | ~12-25 | PASS |
| 02 | MSDP Tables, Arrays, and Malformed Payloads | Completed | ~12-25 | PASS |
| 03 | Connection Lifecycle and Reconnect Cleanup | Completed | ~12-25 | PASS |
| 04 | Dynamic NAWS Resize | Completed | ~12-25 | PASS |
| 05 | xterm.js Migration Spike | Completed | ~12-25 | PASS |
| 06 | Proxy Limits and Deployment Safety | Complete | ~12-25 | PASS |

---

## Completed Sessions

- `phase01-session01-telnet-parser-edge-case-tests` - completed and validated on 2026-05-11.
- `phase01-session02-msdp-tables-arrays-malformed-payloads` - completed and validated on 2026-05-11.
- `phase01-session03-connection-lifecycle-reconnect-cleanup` - completed and validated on 2026-05-11.
- `phase01-session04-dynamic-naws-resize` - completed and validated on 2026-05-11.
- `phase01-session05-xterm-js-migration-spike` - completed and validated on 2026-05-11.
- `phase01-session06-proxy-limits-deployment-safety` - completed and validated on 2026-05-11.

---

## Upcoming Sessions

- None. Phase 01 is complete and ready for phase transition.
---

## Objectives

1. Expand parser and protocol coverage for Telnet control bytes, MSDP structures, and malformed payloads.
2. Verify reconnect and socket lifecycle behavior before broader UI work depends on live connection state.
3. Add terminal resize and deployment safety guardrails needed for real browser play.
4. Validate the long-term terminal renderer direction without mixing it into protocol rewrites.

---

## Prerequisites

- Phase 00 completed and archived.
- Baseline `npm run lint`, `npm run build`, and `npm test` commands documented and passing at Phase 00 close.
- Fixture-backed MSDP parser and state-mapping coverage available for extension.

---

## Technical Considerations

### Architecture

`server/index.ts` still owns proxy routes, Telnet session handling, parser setup, and lifecycle glue. Keep coverage ahead of extraction, and separate parser, lifecycle, resize, renderer, and deployment-safety changes into distinct sessions.

### Technologies

- TypeScript
- Node.js `net` sockets
- Express
- `ws`
- React
- Vite
- `ansi-to-html`
- xterm.js spike dependencies, if approved during Session 05

### Risks

- Parser regressions: Add fixture and edge-case tests before changing protocol behavior.
- Reconnect leakage: Use automated repeated connect/disconnect coverage and assert cleanup of sockets, parser state, and client-visible state.
- Public proxy exposure: Prioritize allowlists, private-network blocking, origin checks, quotas, and timeouts before deployment.
- Renderer injection risk: Preserve `ansi-to-html` XML escaping until a replacement renderer is proven and tested.
- Scope creep: Keep game panels, account sync, and source-level protocol work out of this phase unless they are required to validate hardening.

### Relevant Considerations

- [P01] **Parser and reconnect coverage first**: Keep coverage ahead of changes to `server/index.ts`.
- [P01] **`ansi-to-html` remains interim**: Preserve XML escaping or replace the renderer only after a validated spike.
- [P01] **Public proxy exposure needs guardrails**: Address destination allowlists, private-network blocking, origin checks, quotas, and timeouts before production use.
- [P01] **Cookie persistence is not ideal**: Avoid growing browser-cookie payloads while terminal and proxy hardening are underway.
- [P01] **Fixture-backed tests worked**: Extend the existing fixture and Node test approach for parser and state coverage.

---

## Success Criteria

Phase complete when:

- [x] All 6 sessions completed and validated.
- [x] Telnet parser edge cases are covered by automated tests.
- [x] MSDP table, array, nested, empty, and malformed payload behavior is covered by tests.
- [x] Reconnect cleanup is verified across repeated connect/disconnect cycles.
- [x] Dynamic NAWS resize behavior is implemented or explicitly deferred with evidence.
- [x] xterm.js migration is approved with a follow-up breakdown or deferred with blocking evidence.
- [x] Public deployment guardrails are implemented or documented as blocking public release.
- [x] `npm run lint`, `npm run build`, and `npm test` pass before phase close.

---

## Dependencies

### Depends On

- Phase 00: Align With Real Luminari Data

### Enables

- Phase 02: Build Luminari Game Panels
