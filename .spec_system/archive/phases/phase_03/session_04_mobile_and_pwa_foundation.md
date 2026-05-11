# Session 04: Mobile and PWA Foundation

**Session ID**: `phase03-session04-mobile-and-pwa-foundation`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Bring the best mobile lessons from `lociterm` into the browser client while keeping normal web play reliable.

---

## Scope

### In Scope (MVP)

- Study `EXAMPLES/lociterm` mobile and PWA behavior as reference input.
- Improve responsive command input, terminal reading, HUD, and panel ergonomics.
- Improve reconnect and offline or online messaging for narrow screens.
- Add manifest, icons, and service-worker basics only where they improve installability.
- Document browser-specific PWA limits where install prompts are unavailable.
- Validate at 390px and 360px viewport widths.

### Out of Scope

- Offline gameplay.
- Push notifications.
- Native mobile app packaging.
- Replacing browser WebSocket behavior.

---

## Prerequisites

- [ ] Core connect, terminal, command input, and HUD workflows work on desktop.
- [ ] Session 02 layout changes are complete or compatible with mobile changes.
- [ ] Browser play remains the primary requirement even where installability is unavailable.

---

## Deliverables

1. Mobile command, terminal, HUD, and panel ergonomic improvements.
2. Reconnect and offline/online messaging improvements.
3. PWA metadata and service-worker foundation if justified by browser support.
4. Responsive smoke-test notes for 390px and 360px viewports.

---

## Success Criteria

- [ ] Connect, command input, terminal, and core HUD work at 390px width.
- [ ] 360px smoke checks show no horizontal page scrolling.
- [ ] Reconnect messaging is clear on mobile.
- [ ] Browser play works even where install prompts are unavailable.
- [ ] PWA support is present where practical or explicitly deferred with reasons.
