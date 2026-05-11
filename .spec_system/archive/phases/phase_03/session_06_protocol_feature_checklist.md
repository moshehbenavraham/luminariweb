# Session 06: Protocol Feature Checklist

**Session ID**: `phase03-session06-protocol-feature-checklist`
**Status**: Complete
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Create a living protocol feature checklist that clarifies supported, rejected, partial, and deferred behavior before source-level work begins.

---

## Scope

### In Scope (MVP)

- Inventory ANSI, 256-color, UTF-8, TTYPE, NAWS, MSDP, GMCP, MXP, MSP, MCCP, MSSP, and CHARSET behavior.
- Mark each feature as supported, rejected, partial, or deferred.
- Link each status to tests, source facts, documentation, or explicit validation gaps.
- Document prerequisites for deferred protocol work.
- Expose user-relevant protocol status in the UI only if it is useful and low risk.

### Out of Scope

- Implementing GMCP, MCCP, MXP, MSP, or CHARSET support.
- Changing Luminari-Source protocol code.
- Rewriting the Telnet parser.
- Claiming live server support without source facts or captures.

---

## Prerequisites

- [ ] Parser, proxy, and state-mapping tests from earlier phases are available.
- [ ] Luminari-Source protocol facts in the PRD are reviewed for drift.
- [ ] Deferred Phase 04 work from map and quest fallback sessions is considered.

---

## Deliverables

1. Protocol feature checklist document or maintained section.
2. Links from feature status to tests, source files, or validation notes.
3. Follow-up candidates for Phase 04 source-level protocol work.
4. Optional user-facing protocol status surface if justified.

---

## Success Criteria

- [ ] Maintainers can see what protocol features are safe to build on.
- [ ] Deferred protocol work has reasons and prerequisites.
- [ ] MCCP and GMCP are not accidentally presented as complete support.
- [ ] Phase 04 source-level work has clear inputs.

## Completion Notes

Completed: 2026-05-11.
