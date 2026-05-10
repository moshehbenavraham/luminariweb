# Session 06: Proxy Limits and Deployment Safety

**Session ID**: `phase01-session06-proxy-limits-deployment-safety`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Add public-deployment guardrails to the proxy.

---

## Scope

### In Scope (MVP)

- Add or tighten connection quota rules.
- Add or tighten command/input rate limiting.
- Add host/port allowlist or configuration strategy for curated MUD presets.
- Reject unsafe destinations, including private, loopback, link-local, multicast, and metadata-service ranges where applicable.
- Add origin checks and timeout behavior suitable for deployment.
- Review logging to avoid command or secret leakage.
- Document deployment safety settings.

### Out of Scope

- User accounts or cloud profile storage.
- Full WAF or infrastructure provisioning.
- Native WebSocket support in Luminari-Source.
- GPL proxy code import.

---

## Prerequisites

- [ ] Connection lifecycle behavior is stable.
- [ ] Current preset and runtime settings model is understood.
- [ ] Open security findings in `SECURITY-COMPLIANCE.md` are reviewed.

---

## Deliverables

1. Configurable proxy destination and origin policy.
2. Tests or validation for disallowed hosts, ports, and unsafe network ranges.
3. Timeout, quota, and logging behavior appropriate for public deployment.
4. Documentation updates for deployment safety settings.

---

## Success Criteria

- [ ] Proxy rejects invalid or disallowed connection attempts.
- [ ] Unsafe network destinations are blocked by default in public mode.
- [ ] Rate limits and quotas are enforced without breaking normal play.
- [ ] Sensitive user command text is not logged by default.
- [ ] Deployment safety settings are documented.
