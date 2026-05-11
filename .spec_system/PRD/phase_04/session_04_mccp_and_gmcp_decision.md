# Session 04: MCCP and GMCP Decision

**Session ID**: `phase04-session04-mccp-and-gmcp-decision`
**Status**: Not Started
**Estimated Tasks**: ~12-18
**Estimated Duration**: 2-4 hours

---

## Objective

Decide whether MCCP and GMCP should become supported features, remain deferred, or be rejected for the current Luminari Web and Luminari-Source path.

---

## Scope

### In Scope (MVP)

- Evaluate real MCCP implementation versus removing or preserving stubbed source paths.
- Evaluate whether a modern GMCP module API is needed for Luminari Web.
- Define required source, proxy, client, schema, and test changes for any accepted path.
- Implement only low-risk documentation or configuration changes that fit the session.
- Produce follow-up specs if MCCP or GMCP implementation exceeds one right-sized session.

### Out of Scope

- Claiming MCCP support while source compression and proxy decompression are absent.
- Claiming GMCP support without module schemas, parser contracts, and tests.
- Replacing existing MSDP panels with GMCP without a migration plan.
- Adding compression or module APIs without validation coverage.

---

## Prerequisites

- [ ] Session 01 ranks MCCP and GMCP against client value and source risk.
- [ ] Session 02 documents validation requirements for accepted parser or negotiation paths.
- [ ] Current proxy rejection behavior for unsupported MCCP remains understood.

---

## Deliverables

1. MCCP decision record with pursue, defer, or reject outcome.
2. GMCP decision record with pursue, defer, or reject outcome.
3. Test plan and scoped follow-up specs for any accepted implementation path.

---

## Success Criteria

- [ ] MCCP status is no longer ambiguous in maintainer docs.
- [ ] GMCP direction is documented with module, schema, and migration implications.
- [ ] Any accepted implementation path includes source, proxy, client, and test responsibilities.
- [ ] Unsupported behavior remains rejected or unavailable in the client until implemented and validated.
