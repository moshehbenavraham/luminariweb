# Phase 04 Protocol Follow-Up

## Purpose

This handoff ranks protocol work that should be considered after the Phase 03
checklist. It does not authorize implementation in this repository or in
Luminari-Source by itself. Each item needs source facts, tests, and scoped PRD
approval before support can be claimed.

## Ranked Candidates

### 1. Source TODO Audit

**Phase 04 tag**: `p4-source-todo-audit`

Re-read Luminari-Source protocol files and docs before changing behavior:

- `protocol.c`
- `protocol.h`
- `comm.c`
- `docs/systems/PROTOCOL_SYSTEMS.md`
- `docs/systems/MSDP_VARIABLES.md`
- `docs/project-management-zusuk/PROTOCOL_TODO.md`

**Outputs**:

- Ranked backlog of source protocol TODOs.
- Explicit list of work that should remain deferred or rejected.
- Mapping from source TODOs to web client value, risk, and required tests.

### 2. Source Parser Harness

**Phase 04 tag**: `p4-parser-harness`

Add a focused source-level protocol harness before expanding parser behavior.
Highest-value fixtures are MSDP, GMCP, MCCP, MXP, NAWS, CHARSET, malformed
input, doubled IAC, split IAC, and incomplete subnegotiation boundaries.

**Outputs**:

- Documented local command for running source protocol tests.
- Fixtures that cover accepted, rejected, malformed, and partial negotiation.
- Regression coverage before any source parser rewrite.

### 3. Missing MSDP Variables

**Phase 04 tag**: `p4-missing-msdp-variables`

Evaluate only variables that improve current panels and can be source-owned:

- `TITLE`
- `FORTITUDE`
- `REFLEX`
- `WILLPOWER`
- live `DAMAGE_BONUS`
- live `MINIMAP`
- structured `QUEST_INFO`

**Outputs**:

- Selected variable list with payload contracts and fallback behavior.
- Source emission changes and docs for selected variables.
- Client fixture updates and older-server fallback checks.
- Explicit rejection or deferral notes for unselected variables.

### 4. MCCP and GMCP Decision

**Phase 04 tag**: `p4-mccp-gmcp-decision`

MCCP and GMCP must stay non-supported until server and proxy behavior are
designed together.

**MCCP questions**:

- Should source compression be implemented or stubbed paths removed?
- Which compression version is supported?
- Where does proxy decompression live?
- How are compression failures reported without leaking internals?

**GMCP questions**:

- Is a modern JSON module API needed?
- Which modules are valuable for Luminari Web?
- How are module schemas versioned and tested?
- Does GMCP overlap or compete with current MSDP panels?

**Outputs**:

- Decision record for MCCP and GMCP.
- Test plan for any accepted path.
- Follow-up specs if either feature exceeds one session.

### 5. Native Source WebSocket Feasibility

**Phase 04 tag**: `p4-native-websocket-feasibility`

The current integrated proxy remains the supported app transport. Native
source WebSocket work should be evaluated only after parser and proxy behavior
are stable.

**Questions**:

- Would native WebSocket replace or coexist with the current proxy?
- How would source validate browser messages, origins, destinations, and rate
  limits?
- Can source emit the same typed `/ws` application messages, or would the
  client need a new transport contract?
- What operational controls would replace the current proxy boundaries?

**Outputs**:

- Pursue, defer, or reject recommendation.
- Security and operations risk notes.
- Compatibility plan if a future transport is pursued.

## Non-Negotiable Boundaries

- Do not claim MCCP support while source compression functions are stubs and
  proxy decompression is absent.
- Do not claim GMCP support without a source module API, proxy parser, client
  contract, and tests.
- Do not claim live `MINIMAP`, `QUEST_INFO`, `TITLE`, saves, or
  `DAMAGE_BONUS` support from synthetic fixtures alone.
- Do not replace `/ws` with a blind byte bridge for the first-party React app.
- Do not parse free-form quest command output as structured quest data.

## Suggested Phase 04 Entry Criteria

- Protocol feature checklist is merged and linked from maintainer docs.
- `npm test`, `npm run lint`, and `npm run build` pass in Luminari Web.
- Phase 04 source checkout is available for read-only audit.
- Any live capture plan includes redaction for commands, credentials, private
  hosts, and terminal transcripts.

