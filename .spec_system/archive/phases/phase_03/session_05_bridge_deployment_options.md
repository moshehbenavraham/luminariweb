# Session 05: Bridge Deployment Options

**Session ID**: `phase03-session05-bridge-deployment-options`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Define production proxy and bridge deployment options while preserving the allowlisted integrated proxy as the default path.

---

## Scope

### In Scope (MVP)

- Study `EXAMPLES/websockify` and `EXAMPLES/wsgate-server` deployment models.
- Compare integrated proxy operation with standalone bridge isolation.
- Document topology options, tradeoffs, and operational requirements.
- Confirm host and port allowlists, allowed origins, banned ports, rate limits, connection limits, timeouts, and command-log redaction remain intact.
- Implement only low-risk configuration or documentation changes that fit the session.

### Out of Scope

- Replacing the game-aware proxy with a blind bridge.
- Moving MSDP parsing or game state into bridge-only infrastructure.
- Broad production hosting automation.
- Native WebSocket support in Luminari-Source.

---

## Prerequisites

- [ ] Phase 01 proxy hardening remains in place.
- [ ] Deployment documentation reflects current server settings.
- [ ] Public mode must reject arbitrary host and port targets by default.

---

## Deliverables

1. Deployment topology comparison and recommendation.
2. Updated deployment docs and operational notes.
3. Low-risk proxy or configuration changes if needed.
4. Validation notes confirming existing public proxy protections.

---

## Success Criteria

- [ ] Deployment options are documented with tradeoffs.
- [ ] Public production mode rejects arbitrary host and port targets by default.
- [ ] Any bridge fallback has a clear operational path.
- [ ] No game-aware behavior is moved into a blind bridge.
- [ ] Command text remains unlogged by default.
