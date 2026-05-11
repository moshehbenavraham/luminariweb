# PRD Phase 04: Source-Level Protocol Path

**Status**: In Progress
**Sessions**: 5
**Estimated Duration**: 5-8 days

**Progress**: 4/5 sessions completed (80%)

---

## Overview

Phase 04 defines and implements only the source-level protocol work justified after the web client, proxy, and protocol inventory have reached a stable baseline. The phase starts with source audit and test-harness work, then considers the smallest safe MSDP additions, MCCP/GMCP direction, and native WebSocket feasibility.

---

## Progress Tracker

| Session | Name | Status | Est. Tasks | Validated |
|---------|------|--------|------------|-----------|
| 01 | Luminari-Source Protocol TODO Audit | Completed | ~12-18 | 2026-05-11 |
| 02 | Protocol Parser Test Harness | Completed | ~15-22 | 2026-05-11 |
| 03 | Missing MSDP Variables | Completed | ~18-24 | 2026-05-11 |
| 04 | MCCP and GMCP Decision | Completed | ~12-18 | 2026-05-11 |
| 05 | Native WebSocket Feasibility | Not Started | ~12-18 | - |

---

## Completed Sessions

- `phase04-session01-luminari-source-protocol-todo-audit` - Completed on 2026-05-11.
- `phase04-session02-protocol-parser-test-harness` - Completed on 2026-05-11.
- `phase04-session03-missing-msdp-variables` - Completed on 2026-05-11.
- `phase04-session04-mccp-and-gmcp-decision` - Completed on 2026-05-11.

---

## Upcoming Sessions

- Session 05: Native WebSocket Feasibility


---

## Objectives

1. Rank source-level protocol work against concrete Luminari Web value, risk, and testability.
2. Add or document source protocol validation before behavior changes are made.
3. Keep unsupported protocol features and missing MSDP variables explicitly deferred until source facts, payload contracts, and tests exist.

---

## Prerequisites

- Phase 03 completed.
- Luminari Web lint, tests, and build are passing or any failures are documented before source protocol changes begin.
- Local Luminari-Source checkout is available at `/home/aiwithapex/projects/Luminari-Source`.
- Live capture or fixture work must redact commands, credentials, private hosts, and terminal transcripts.

---

## Technical Considerations

### Architecture

The integrated React/Node proxy remains the supported production path while source-level protocol options are evaluated. Source changes must preserve older-server client fallback behavior and avoid replacing the current `/ws` application contract before a tested migration path exists.

### Technologies

- Luminari-Source C protocol code
- React and TypeScript client mappings
- Node WebSocket-to-Telnet proxy
- MSDP, GMCP, MCCP, MXP, NAWS, CHARSET, and related Telnet negotiation paths
- Source and client fixtures or targeted test harnesses

### Risks

- Source-level blast radius: start with audit and harness work before modifying behavior.
- Protocol overclaiming: keep MCCP, GMCP, live `MINIMAP`, `QUEST_INFO`, `TITLE`, saves, and `DAMAGE_BONUS` marked unsupported until source emission and tests exist.
- Privacy drift in validation data: redact live captures and avoid storing commands, credentials, private hosts, or transcripts.
- Proxy boundary erosion: do not move public routing to a blind bridge or native source path without an explicit security and operations plan.

### Relevant Considerations

- [P03] **Shared helper surface**: Client protocol additions should stay behind tested shared helpers so `src/App.tsx` remains orchestration only.
- [P03] **Source vs override boundaries**: Keep source-confirmed protocol data, local UI preferences, and override-only fields explicitly separated.
- [P03] **Evidence-backed protocol inventory**: Treat the checklist as a maintainer aid, not proof of live support.
- [P03] **Overclaiming protocol support**: Unsupported or deferred features stay marked as such until source-level support exists.
- [P03] **Browser-local config boundary**: Do not store commands, hosts, transcripts, tokens, or other sensitive data in browser-local configuration.

---

## Success Criteria

Phase complete when:

- [ ] All 5 sessions completed.
- [ ] Source protocol TODOs are ranked with rationale, risk, and web client value.
- [ ] Highest-risk accepted protocol paths have automated, scripted, or documented validation before behavior changes.
- [ ] Any selected MSDP additions include source payload contracts, client fixture updates, and older-server fallback behavior.
- [ ] MCCP and GMCP have explicit pursue, defer, or reject decisions.
- [ ] Native WebSocket support has an explicit pursue, defer, or reject recommendation and does not displace the current proxy without a tested migration plan.

---

## Dependencies

### Depends On

- Phase 03: Borrow the Best Ideas

### Enables

- Future source-backed protocol, quest, mapper, transport, or compression phases if Phase 04 decisions approve them.
