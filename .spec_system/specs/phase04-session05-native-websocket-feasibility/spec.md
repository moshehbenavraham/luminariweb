# Session Specification

**Session ID**: `phase04-session05-native-websocket-feasibility`
**Phase**: 04 - Source-Level Protocol Path
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session closes Phase 04 by deciding whether Luminari-Source should ever expose a native WebSocket transport for browser clients. The current product path is intentionally conservative: the React app speaks typed JSON messages to the integrated Node `/ws` proxy, and the proxy owns browser message validation, destination policy, Telnet negotiation, MSDP parsing, command throttling, connection limits, and sanitized status messages.

The native WebSocket question must be evaluated as a source-level transport and operations decision, not as a shortcut around the current proxy. `mud-r` is useful behavioral reference material because it has both Telnet and WebSocket connectivity in one server, but it is not a drop-in source or client model for Luminari Web. The session must compare architecture, security, deployment, protocol parser, and client contract implications without copying reference code.

The expected output is a pursue, defer, or reject recommendation. If native transport remains a candidate, the work must be decomposed into future phases or sessions with explicit gates. Until those gates exist and pass, the integrated proxy remains the supported production path for Luminari Web.

---

## 2. Objectives

1. Audit `mud-r`, Luminari-Source, and Luminari Web transport boundaries as behavioral inputs only.
2. Compare native source WebSocket support with the current integrated proxy model across security, operations, protocol, and client-contract concerns.
3. Record a pursue, defer, or reject recommendation with evidence, consequences, and rollback expectations.
4. Split any accepted native transport path into future source, proxy/client, test, and operations sessions.

---

## 3. Prerequisites

### Required Sessions

- [x] `phase04-session01-luminari-source-protocol-todo-audit` - Identifies native source WebSocket as a deferred transport candidate and ranks related protocol risk.
- [x] `phase04-session02-protocol-parser-test-harness` - Provides source parser coverage and known parser gaps relevant to new transport exposure.
- [x] `phase04-session03-missing-msdp-variables` - Confirms source-backed MSDP remains the current game-state path.
- [x] `phase04-session04-mccp-and-gmcp-decision` - Keeps MCCP rejected and GMCP deferred, preserving the current uncompressed MSDP proxy path.
- [x] `phase03-session05-bridge-deployment-options` - Documents why blind bridge replacements are not valid `/ws` implementations.
- [x] `phase03-session06-protocol-feature-checklist` - Provides the conservative protocol status catalog.

### Required Tools/Knowledge

- `rg` for source, reference, and documentation audits.
- `node --import tsx --test` for focused protocol status tests.
- Knowledge of browser WebSocket handshake behavior, same-origin and origin-header limits, reverse proxy operations, Telnet protocol negotiation, MSDP state mapping, and Luminari-Source descriptor lifecycle.

### Environment Requirements

- Luminari Web checkout at `/home/aiwithapex/projects/luminariweb`.
- Luminari-Source checkout at `/home/aiwithapex/projects/Luminari-Source`.
- `mud-r` reference checkout at `EXAMPLES/mud-r`.
- Reference review must stay behavioral and license-sensitive; do not copy source code, sample client code, command text, service files, or configuration.
- Notes and fixtures must not include credentials, private hosts, player command text, character names from live sessions, tokens, or terminal transcripts.

---

## 4. Scope

### In Scope (MVP)

- Maintainer can see the native WebSocket decision - document pursue, defer, or reject with rationale and consequences.
- Maintainer can compare transport models - contrast integrated proxy, isolated integrated proxy, terminal-only bridge, mapped bridge, and native source WebSocket.
- Native transport risks are explicit - identify origin/authentication, message validation, rate limits, connection quotas, TLS/WSS, logging, rollback, protocol parser, copyover, and observability implications.
- Client contract remains stable - preserve the current `/ws` JSON application protocol unless a future migration spec defines an equivalent typed contract.
- Future work is decomposed - if native WebSocket remains a candidate, split it into source transport, protocol contract, client compatibility, security, operations, and validation sessions.
- Status claims are synchronized - update docs and the protocol status catalog without overstating support.

### Out of Scope (Deferred)

- Implementing native WebSocket support in Luminari-Source - *Reason: requires source networking, descriptor, protocol, TLS/proxy, and operations design beyond a decision session.*
- Replacing Luminari Web `/ws` with a source-native endpoint - *Reason: the current app protocol is typed JSON and depends on proxy-owned state mapping and policy controls.*
- Moving public routing to an unvalidated byte bridge - *Reason: this would bypass current validation, allowlist, throttling, and status semantics.*
- Adding browser auth, accounts, cloud settings, or source-side profile sync - *Reason: privacy and retention design is not part of the transport decision.*
- Claiming current native WebSocket support - *Reason: Luminari-Source has no native listener today.*

---

## 5. Technical Approach

### Architecture

Treat this as a transport ADR and backlog synchronization session. Start by auditing the current Luminari Web `/ws` contract, bridge deployment decision, protocol status catalog, Luminari-Source networking model, and the `mud-r` dual-listener approach. Then compare options against the current product requirements: typed browser messages, Telnet/MSDP negotiation, source-backed panel state, public destination policy, connection lifecycle cleanup, and operator deployment controls.

The decision must keep two contracts separate. The browser-to-proxy `/ws` contract is application JSON with state messages. A source-native WebSocket listener would be either a raw terminal transport, a source-owned application protocol, or a compatibility layer. Each option has different client, security, parser, and operations costs and must not be treated as equivalent to the existing proxy.

### Design Patterns

- Decision record first: capture the outcome and rationale before updating status claims.
- Current path preservation: keep integrated proxy production support unless a future migration proves parity.
- Threat-model driven transport design: require origin/auth, quota, logging, parser, and rollback gates before public exposure.
- Behavioral reference review: use `mud-r` to identify architecture questions, not to copy implementation.
- Follow-up decomposition: accepted work becomes future right-sized specs with explicit validation gates.

### Technology Stack

- Markdown documentation and ADRs.
- TypeScript shared protocol status catalog.
- Node test runner with `tsx`.
- Luminari-Source C networking, descriptor, and protocol documentation.
- `mud-r` Rust and `tungstenite` reference material as behavioral input only.

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `docs/adr/0003-native-websocket-transport-direction.md` | Decision record for native source WebSocket outcome, rationale, risks, and follow-up gates. | ~130 |
| `.spec_system/specs/phase04-session05-native-websocket-feasibility/implementation-notes.md` | Session evidence, audited paths, comparison matrix, decision inputs, commands, and validation results. | ~130 |
| `.spec_system/specs/phase04-session05-native-websocket-feasibility/security-compliance.md` | Security, privacy, operations, and behavioral quality review for the transport decision. | ~80 |
| `.spec_system/specs/phase04-session05-native-websocket-feasibility/validation.md` | Final validation report for updateprd. | ~80 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `docs/source-protocol-backlog.md` | Replace Session 05 placeholder with final native WebSocket decision and follow-up phase/session map. | ~60 |
| `docs/protocol-feature-checklist.md` | Update native source WebSocket status, evidence, next action, and claim boundary. | ~25 |
| `shared/protocol-feature-status.ts` | Update native WebSocket protocol status record and evidence links while preserving unsupported behavior. | ~25 |
| `tests/protocol-feature-status.test.ts` | Add conservative native WebSocket claim assertions and evidence checks. | ~20 |
| `docs/bridge-deployment-options.md` | Clarify how native source WebSocket differs from blind bridge fallbacks and the integrated proxy. | ~35 |
| `docs/api/http-and-websocket.md` | Clarify that current `/ws` remains the browser app contract and is not replaced by source-native transport. | ~25 |
| `docs/deployment.md` | Update operator guidance for any future native source WebSocket path and current rollback expectations. | ~25 |
| `docs/ARCHITECTURE.md` | Align high-level architecture summary with the native transport decision. | ~20 |
| `docs/development.md` | Update maintainer protocol guidance for native WebSocket claims. | ~15 |
| `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md` | Add source-maintainer wording for no current native WebSocket support and future gates if applicable. | ~35 |
| `/home/aiwithapex/projects/Luminari-Source/docs/systems/CORE_SERVER_ARCHITECTURE.md` | Document where a future native listener would affect descriptor lifecycle, copyover, and networking. | ~35 |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Native source WebSocket has an explicit pursue, defer, or reject recommendation.
- [ ] The recommendation compares current integrated proxy, isolated integrated proxy, bridge fallback, and source-native options.
- [ ] The current proxy remains the supported production path unless a tested future migration plan is approved.
- [ ] Any future native transport path identifies source descriptor, browser contract, protocol parser, security, operations, and rollback requirements.
- [ ] Reference-project usage remains documented as behavioral inspiration only.

### Testing Requirements

- [ ] Focused protocol status tests pass.
- [ ] `npm test` passes or blockers are documented.
- [ ] `npm run lint` and `npm run build` pass or blockers are documented.
- [ ] Documentation and status records are manually reviewed for contradictory native WebSocket claims.

### Non-Functional Requirements

- [ ] Protocol and transport claims remain evidence-backed and conservative.
- [ ] No commands, credentials, private hosts, transcripts, player names, or tokens are added to docs, notes, or fixtures.
- [ ] Public proxy allowlist, origin, DNS/IP, quota, timeout, command-log redaction, and static-shell cache boundaries remain intact.
- [ ] Future work includes validation gates before public support claims.

### Quality Gates

- [ ] All spec-system files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.

---

## 8. Implementation Notes

### Key Considerations

- Luminari Web `/ws` is a typed application protocol, not a raw Telnet bridge. Browser messages and server messages are defined in `shared/mud.ts`.
- The integrated proxy currently owns security and operations controls that a native source listener would need to replicate or replace deliberately.
- Luminari-Source has Telnet socket and descriptor lifecycle paths, but no audited native WebSocket listener.
- `mud-r` demonstrates a dual Telnet/WebSocket architecture with a `tungstenite` dependency and a browser HTML client, but it has different language, runtime, license, protocol, security, and product assumptions.
- MCCP remains rejected and GMCP remains deferred; native transport must not imply either feature is supported.

### Potential Challenges

- A source-native WebSocket can sound simpler than the proxy, but it moves browser-facing validation, logging policy, quotas, and deployment exposure into the source server: mitigate by requiring a threat model and operations checklist.
- A raw source WebSocket would not produce Luminari Web panel state unless the app protocol or an equivalent state contract is implemented: mitigate by separating raw terminal, proxy-compatible, and new application-contract options.
- Source networking changes can interact with copyover and descriptor lifecycle: mitigate by documenting descriptor and rollback requirements before implementation.
- Reference projects include code and sample clients that must remain inspiration only: mitigate by documenting observations rather than copying.

### Relevant Considerations

- [P03] **Bridge-by-default public routing**: Keep the integrated proxy as the default public path unless the policy is intentionally reworked.
- [P03] **Evidence-backed protocol inventory**: Keep claims conservative and backed by tests or source data.
- [P03] **Overclaiming protocol support**: Unsupported or deferred features stay marked as such until source-level support exists.
- [P01] **Proxy destination policy**: Preserve allowlists, origin checks, and fail-closed destination validation.
- [P03] **Browser-local config boundary**: Do not store commands, hosts, transcripts, tokens, or private examples in docs or fixtures.

### Behavioral Quality Focus

Checklist active: Yes

Top behavioral risks for this session:

- Maintainer docs could imply native WebSocket support exists before source, proxy/client, and operations parity are tested.
- Future transport work could bypass existing proxy security controls unless the decision records equivalent gates.
- A raw WebSocket transport could be confused with the current `/ws` app protocol, breaking HUD, panels, status messages, aliases, triggers, reconnect cleanup, and MSDP state mapping.

---

## 9. Testing Strategy

### Unit Tests

- `node --import tsx --test tests/protocol-feature-status.test.ts` for native WebSocket status, evidence, follow-up tags, and conservative claims.

### Integration Tests

- `npm test` to catch broader shared protocol status or documentation-adjacent regressions.
- `npm run lint` and `npm run build` to verify TypeScript and production build health if shared status code changes.

### Manual Testing

- Review ADR 0003, source protocol backlog, bridge deployment docs, `/ws` API contract, deployment docs, and protocol checklist together for contradictory support claims.
- Review any Protocol inspector wording if shared status labels or summaries change.

### Edge Cases

- A browser client tries to use a raw source WebSocket endpoint as if it were Luminari Web `/ws`.
- A native source listener omits origin/authentication, quotas, or command-log redaction.
- A future source listener accepts browser input without schema validation or parser isolation.
- Source copyover or reconnect leaves mixed Telnet/WebSocket descriptor state.
- Operators deploy source-native transport without WSS termination, health probes, rollback, or abuse controls.

---

## 10. Dependencies

### External Libraries

- None expected for this decision session.

### Other Sessions

- **Depends on**: `phase04-session01-luminari-source-protocol-todo-audit`, `phase04-session02-protocol-parser-test-harness`, `phase04-session03-missing-msdp-variables`, `phase04-session04-mccp-and-gmcp-decision`, `phase03-session05-bridge-deployment-options`, `phase03-session06-protocol-feature-checklist`
- **Depended by**: Future native transport phase, future source networking hardening, future browser transport migration, future operations hardening

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
