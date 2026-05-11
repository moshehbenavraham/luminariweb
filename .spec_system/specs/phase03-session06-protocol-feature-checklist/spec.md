# Session Specification

**Session ID**: `phase03-session06-protocol-feature-checklist`
**Phase**: 03 - Borrow the Best Ideas
**Status**: Complete
**Created**: 2026-05-11

---

## 1. Session Overview

This session creates the living protocol feature checklist that closes Phase 03 and prepares Phase 04 source-level protocol work. The current client already has parser, proxy, state-mapping, panel, deployment, mobile, and fallback coverage. What is still missing is a maintained protocol-status contract that tells maintainers which features are supported, rejected, partial, deferred, or still blocked by validation gaps.

The session should inventory ANSI, 256-color, UTF-8, TTYPE, NAWS, MSDP, GMCP, MXP, MSP, MCCP, MSSP, and CHARSET without implementing new protocol behavior. The checklist should link each status to source facts, tests, existing docs, or explicit gaps so future work does not accidentally claim GMCP, MCCP, MXP, MSP, CHARSET, or native-source support before the source and proxy can prove it.

The recommended implementation is a small typed shared protocol-status catalog, a maintainer-facing checklist document, focused tests, and a low-risk user-facing protocol status view if the UI can expose it without becoming a second parser. The UI should summarize stable support boundaries and validation gaps, not infer live negotiation state beyond what the client actually knows.

---

## 2. Objectives

1. Create a durable protocol feature checklist covering required Telnet, terminal, MSDP, and deferred protocol capabilities.
2. Tie each protocol status to current source facts, proxy behavior, tests, documentation, or explicit validation gaps.
3. Prevent MCCP, GMCP, MXP, MSP, CHARSET, minimap, quest, and native WebSocket work from being presented as complete support.
4. Produce Phase 04 follow-up inputs for source-level TODO audit, parser harness work, missing MSDP variables, MCCP/GMCP decisions, and native WebSocket feasibility.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase01-session01-telnet-parser-edge-case-tests` - Provides split IAC, doubled IAC, negotiation, TTYPE, NAWS, unsupported-option, and parser-side test coverage.
- [x] `phase01-session02-msdp-tables-arrays-malformed-payloads` - Provides MSDP scalar, table, array, nested, and malformed payload coverage.
- [x] `phase01-session03-connection-lifecycle-reconnect-cleanup` - Provides reconnect cleanup and stale callback protection.
- [x] `phase01-session04-dynamic-naws-resize` - Provides terminal resize and NAWS lifecycle coverage.
- [x] `phase02-session06-map-and-quest-fallback-strategy` - Provides explicit `MINIMAP` and `QUEST_INFO` override-only fallback behavior.
- [x] `phase03-session05-bridge-deployment-options` - Provides deployment-path boundaries and Phase 04 handoff context.

### Required Tools/Knowledge
- Current parser behavior in `server/telnet-parser.ts`.
- Current outbound MSDP variable map and override-only keys in `shared/mud.ts`.
- Current client layout and inspector behavior in `src/App.tsx`, `src/App.css`, and `shared/client-layout-preferences.ts`.
- Current tests under `tests/`, especially Telnet parser, proxy lifecycle, MSDP fixtures, display helpers, and layout preference tests.
- Source facts and Phase 04 objectives from `.spec_system/PRD/PRD.md`.
- Project conventions from `.spec_system/CONVENTIONS.md`.

### Environment Requirements
- Dependencies installed from the current lockfile.
- Local commands available: `npm test`, `npm run lint`, and `npm run build`.
- No live MUD, production deployment, or Luminari-Source checkout mutation is required.
- Any source references to Luminari-Source are documentation inputs only in this session.

---

## 4. Scope

### In Scope (MVP)
- Maintainer can inspect protocol readiness - Inventory ANSI, 256-color, UTF-8, TTYPE, NAWS, MSDP, GMCP, MXP, MSP, MCCP, MSSP, and CHARSET with supported, rejected, partial, deferred, or validation-gap status.
- Maintainer can trace every status - Link each feature to tests, source facts, docs, or explicit missing evidence.
- Maintainer can distinguish client support from source support - Keep source-confirmed MSDP variables separate from override-only or future server variables such as `MINIMAP`, `QUEST_INFO`, `TITLE`, saves, and live `DAMAGE_BONUS`.
- Player can see useful protocol boundaries if exposed in UI - Add a compact Protocol inspector tab or equivalent low-risk UI surface with explicit status labels, accessible controls, deterministic ordering, and responsive wrapping.
- Phase 04 has clear inputs - Capture follow-up candidates for Luminari-Source TODO audit, source parser harness work, missing MSDP variables, MCCP/GMCP decisions, and native WebSocket feasibility.
- Existing protocol behavior remains stable - Add status/catalog tests and documentation without changing negotiation, parsing, destination policy, or WebSocket message contracts.

### Out of Scope (Deferred)
- Implementing GMCP, MCCP, MXP, MSP, CHARSET, MSSP, or native WebSocket support - *Reason: Phase 04 owns source-level and protocol-expansion decisions.*
- Changing Luminari-Source protocol code - *Reason: this repository is planning the client/proxy checklist first.*
- Rewriting the Telnet parser - *Reason: current parser behavior is covered and should not be broadened without a dedicated parser session.*
- Claiming live server support from synthetic fixtures alone - *Reason: fixtures are contract checks, not proof of live schema.*
- Adding server-side persistence, accounts, analytics, or protocol telemetry - *Reason: first release remains local-only and command privacy must stay intact.*

---

## 5. Technical Approach

### Architecture

Create one typed protocol-status catalog in `shared/protocol-feature-status.ts`. The catalog should define a narrow status union, protocol feature records, evidence links, validation-gap notes, and Phase 04 follow-up tags. It should be pure data plus small helper functions for deterministic grouping or filtering, so both tests and UI can consume the same source without duplicating claims.

Create `docs/protocol-feature-checklist.md` as the maintainer-facing checklist. The document should be readable without running the app and should state which support is client-side, proxy-side, source-side, rejected, deferred, partial, or unvalidated. It should link to current tests and docs such as `tests/README.md`, `docs/api/http-and-websocket.md`, `docs/ARCHITECTURE.md`, and the Phase 04 source-level plan in the PRD.

If the UI surface is added, prefer a Protocol inspector tab rather than another settings menu. The tab should render the shared catalog in compact groups and include visible status labels, short user-facing notes, and stable ordering. It must not report live negotiation state unless that state is already available and reliable. It should preserve command input focus, keyboard tab behavior, mobile wrapping at 390px and 360px, and the existing terminal-first workflow.

### Design Patterns
- Single source of protocol truth: Keep status records in one shared module and derive docs/tests/UI from that contract where practical.
- Exhaustive status handling: Use TypeScript unions and tests so every protocol status is rendered and counted deliberately.
- Evidence-linked decisions: Each status needs a source, test, doc, or validation-gap reference.
- Explicit unsupported states: Rejected and deferred features must have visible reasons and prerequisites.
- No behavioral drift: Tests should prove the checklist covers current support without changing parser or proxy behavior.

### Technology Stack
- TypeScript shared module under `shared/`.
- React 19 functional UI in `src/App.tsx` if the Protocol inspector tab is implemented.
- CSS in `src/App.css` for compact status badges and responsive protocol rows.
- Node test runner with `node --import tsx --test tests/*.test.ts`.
- Existing docs under `docs/` and spec artifacts under `.spec_system/specs/`.
- No new runtime dependencies expected.

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `shared/protocol-feature-status.ts` | Typed protocol feature catalog, status union, evidence records, and grouping helpers | ~180 |
| `docs/protocol-feature-checklist.md` | Maintainer checklist with feature statuses, evidence, validation gaps, and Phase 04 prerequisites | ~220 |
| `tests/protocol-feature-status.test.ts` | Coverage for required features, status exhaustiveness, evidence links, and deferred/rejected protocol claims | ~160 |
| `.spec_system/specs/phase03-session06-protocol-feature-checklist/phase04-protocol-follow-up.md` | Ranked Phase 04 protocol follow-up candidates and prerequisites | ~100 |
| `.spec_system/specs/phase03-session06-protocol-feature-checklist/implementation-notes.md` | Implementation evidence, audit notes, validation results, and handoff notes | ~100 |
| `.spec_system/specs/phase03-session06-protocol-feature-checklist/security-compliance.md` | Security, privacy, and protocol-claim risk notes | ~80 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `shared/client-layout-preferences.ts` | Add Protocol inspector tab support if the UI surface is implemented | ~10 |
| `src/App.tsx` | Render compact protocol status rows from the shared catalog with accessible tab behavior | ~180 |
| `src/App.css` | Add responsive styles for protocol status rows and badges | ~120 |
| `tests/client-layout-preferences.test.ts` | Cover the new Protocol inspector tab and corrupt/future layout fallbacks | ~30 |
| `docs/ARCHITECTURE.md` | Link protocol checklist and clarify current support boundary | ~40 |
| `docs/api/http-and-websocket.md` | Link protocol feature statuses to the `/ws` application protocol contract | ~35 |
| `docs/development.md` | Add protocol checklist and focused test guidance for maintainers | ~30 |
| `tests/README.md` | Add protocol-feature-status test coverage and manual Protocol tab checks | ~45 |
| `README.md` | Link the protocol checklist without changing product positioning | ~20 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Protocol checklist covers ANSI, 256-color, UTF-8, TTYPE, NAWS, MSDP, GMCP, MXP, MSP, MCCP, MSSP, and CHARSET.
- [ ] Each feature has an explicit status, reason, evidence link, and next action or prerequisite.
- [ ] MCCP and GMCP are not represented as complete support.
- [ ] `MINIMAP`, `QUEST_INFO`, `TITLE`, saves, and live `DAMAGE_BONUS` remain documented as override-only, unconfirmed, or future-source work.
- [ ] Phase 04 source-level sessions have clear follow-up inputs.
- [ ] Any user-facing protocol view is compact, keyboard reachable, screen-reader labeled, and responsive at 390px and 360px without blocking command input.

### Testing Requirements
- [ ] Protocol status unit tests are written and passing.
- [ ] Layout preference tests are updated if a Protocol inspector tab is added.
- [ ] Existing Telnet parser, MSDP, proxy, display, automation, persistence, and PWA tests still pass.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Manual UI smoke checks are documented for desktop, 390px, and 360px if UI changes are made.

### Non-Functional Requirements
- [ ] Protocol claims are conservative and evidence-backed.
- [ ] No raw player command text, credentials, host secrets, or terminal transcript data is persisted or logged.
- [ ] The UI does not create a second protocol parser or infer unsupported live server behavior.
- [ ] Long status notes wrap or scroll inside the inspector without horizontal page scrolling.
- [ ] No new runtime dependency is introduced unless explicitly justified.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] `npm test`, `npm run lint`, and `npm run build` pass or any failures are documented with cause.

---

## 8. Implementation Notes

### Key Considerations
- `server/telnet-parser.ts` currently supports MSDP readiness, TTYPE response, NAWS sizing, ECHO/SGA acceptance, MCCP rejection, CHARSET/MXP rejection, and generic unsupported-option rejection.
- `shared/mud.ts` already separates source-confirmed MSDP keys from override-only fields. Reuse that boundary rather than creating a competing map.
- `tests/README.md` documents synthetic fixture limits. Preserve the distinction between fixture-backed contracts and live server proof.
- `docs/api/http-and-websocket.md` already states that `/ws` is a structured application protocol, not a raw Telnet bridge. The checklist should reinforce that boundary.
- The UX PRD names a Protocol inspector surface, but the current app has no Protocol tab. Adding one is useful only if it stays compact and low risk.

### Potential Challenges
- Status wording can overclaim support: Use precise terms such as supported, partial, rejected, deferred, and validation gap.
- Protocol UI can become noisy: Show concise rows and route long evidence to docs.
- Existing layout preferences may contain unknown tab ids: Keep parser fallback behavior intact when adding a new tab.
- Synthetic fixtures may be mistaken for source proof: Mark fixture-backed coverage as test evidence, not live schema evidence.
- Phase 04 scope can grow too large: Split follow-ups by source TODO audit, parser harness, missing MSDP variables, MCCP/GMCP decision, and native WebSocket feasibility.

### Relevant Considerations
- [P02] **Source-confirmed MSDP fields and override-only fields**: Keep future additions explicit about which states come from the server and which depend on overrides.
- [P02] **Synthetic fixtures are contract checks, not proof of live schema**: Tie fixture-backed claims to validation gaps where live captures or source emission are still missing.
- [P02] **Bounded fallback text**: Keep status notes concise so malformed or oversized protocol summaries do not dominate narrow panels.
- [P01] **Terminal renderer path**: Preserve escaped MUD text rendering and avoid raw HTML paths while adding protocol-status UI.
- [P01] **Public proxy destination policy**: Keep source/proxy support boundaries distinct from deployment routing support.
- [P00-SEC-002] **Browser settings are stored in cookies**: Do not add larger or sensitive protocol persistence while this finding remains open.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Protocol status rows overclaim live support or hide unsupported behavior.
- Adding a Protocol inspector tab breaks stored layout preferences, keyboard tab order, or command-input focus.
- Long evidence, reason, or prerequisite text overflows mobile inspector layouts.
- Static protocol records drift from parser behavior, default MSDP mappings, or Phase 04 follow-up docs.

---

## 9. Testing Strategy

### Unit Tests
- Add `tests/protocol-feature-status.test.ts` to assert that all required protocol features exist, every record has a valid status and evidence, status counts are deterministic, MCCP and GMCP are not `supported`, and Phase 04 follow-up tags exist for deferred source work.
- Update `tests/client-layout-preferences.test.ts` if adding the Protocol inspector tab so stored `activeInspectorTab: "protocol"` survives parsing and unknown future ids still fall back safely.

### Integration Tests
- Run `node --import tsx --test tests/protocol-feature-status.test.ts`.
- Run `node --import tsx --test tests/client-layout-preferences.test.ts` if the tab changes.
- Run the full suite with `npm test`.
- Run `npm run lint`.
- Run `npm run build`.

### Manual Testing
- Review `docs/protocol-feature-checklist.md`, `docs/ARCHITECTURE.md`, `docs/api/http-and-websocket.md`, `tests/README.md`, and the Phase 04 follow-up together for conflicting protocol claims.
- If a Protocol inspector tab is implemented, check desktop, 390px, and 360px widths for reachable tabs, visible focus, readable status badges, no horizontal page scrolling, and command input availability.
- Confirm the UI states MCCP, GMCP, MXP, MSP, CHARSET, and unsupported server variables conservatively.

### Edge Cases
- Stored layout preferences point to an unknown future tab.
- Stored layout preferences point to the new Protocol tab.
- Protocol record has no evidence or an invalid status.
- Required feature is accidentally removed from the catalog.
- A deferred feature has no Phase 04 follow-up tag.
- User reads a status row while disconnected and mistakes it for live negotiation state.
- Long feature notes or evidence labels wrap on 360px mobile width.

---

## 10. Dependencies

### External Libraries
- None expected.

### Other Sessions
- **Depends on**: `phase01-session01-telnet-parser-edge-case-tests`, `phase01-session02-msdp-tables-arrays-malformed-payloads`, `phase01-session04-dynamic-naws-resize`, `phase02-session06-map-and-quest-fallback-strategy`, `phase03-session05-bridge-deployment-options`
- **Depended by**: Phase 4 source-level protocol sessions, especially TODO audit, protocol parser test harness, missing MSDP variables, MCCP/GMCP decision, and native WebSocket feasibility

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
