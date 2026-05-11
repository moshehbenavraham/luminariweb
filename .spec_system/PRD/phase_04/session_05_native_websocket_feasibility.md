# Session 05: Native WebSocket Feasibility

**Session ID**: `phase04-session05-native-websocket-feasibility`
**Status**: Not Started
**Estimated Tasks**: ~12-18
**Estimated Duration**: 2-4 hours

---

## Objective

Decide whether Luminari-Source should eventually expose native WebSocket support and what would be required before it could replace or coexist with the current proxy.

---

## Scope

### In Scope (MVP)

- Study `mud-r` architecture as a reference without copying implementation code.
- Compare native source WebSocket support with the current integrated proxy model.
- Identify security, operations, protocol-parser, and client-contract implications.
- Decide whether native WebSocket support should be pursued, deferred, or rejected.
- Split any accepted path into future phases and sessions.

### Out of Scope

- Implementing native WebSocket support in Luminari-Source.
- Replacing the current `/ws` proxy contract.
- Moving public routing to an unvalidated blind byte bridge.
- Weakening allowlist, origin, DNS/IP, quota, timeout, or command-log boundaries.

---

## Prerequisites

- [ ] Sessions 01-04 have clarified source protocol priorities and transport feature direction.
- [ ] Current deployment and bridge documentation is available for comparison.
- [ ] License-sensitive reference review stays behavioral and does not copy incompatible code.

---

## Deliverables

1. Native WebSocket pursue, defer, or reject recommendation.
2. Security and operations risk notes for any accepted path.
3. Future phase or session breakdown if native source transport remains a candidate.

---

## Success Criteria

- [ ] Native WebSocket decision is documented.
- [ ] The current proxy remains the supported production path unless a tested migration plan is approved.
- [ ] Any future native transport path identifies client contract, source parser, security, and operations requirements.
- [ ] Reference-project usage stays documented as behavioral inspiration only.
