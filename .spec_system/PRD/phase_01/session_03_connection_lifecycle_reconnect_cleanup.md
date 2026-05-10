# Session 03: Connection Lifecycle and Reconnect Cleanup

**Session ID**: `phase01-session03-connection-lifecycle-reconnect-cleanup`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Make repeated browser and MUD connect/disconnect cycles reliable.

---

## Scope

### In Scope (MVP)

- Test browser WebSocket close behavior.
- Test MUD socket close and error behavior.
- Verify parser, MSDP initialization, socket references, and client-visible state reset cleanly.
- Prevent duplicate status events where practical.
- Add a repeated connect/disconnect script or automated test path.

### Out of Scope

- Public host allowlist implementation.
- UI redesign beyond cleanup messages needed for lifecycle clarity.
- Production deployment tuning unrelated to reconnect behavior.

---

## Prerequisites

- [ ] Parser tests from Sessions 01 and 02 are passing or known failures are documented.
- [ ] Local test harness can create controlled WebSocket and TCP socket conditions.

---

## Deliverables

1. Lifecycle tests for browser socket and MUD socket close/error paths.
2. Reconnect cleanup fixes for stale parser, socket, and state references.
3. Evidence from 25 repeated connect/disconnect cycles.

---

## Success Criteria

- [ ] 25 connect/disconnect cycles pass in automated or scripted testing.
- [ ] No stale `MudState` persists after disconnect.
- [ ] No duplicate active MUD socket remains after reconnect.
- [ ] Status events remain understandable and non-spammy.
