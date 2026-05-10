# Session 04: Dynamic NAWS Resize

**Session ID**: `phase01-session04-dynamic-naws-resize`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Send accurate terminal dimensions to the MUD as the browser layout changes.

---

## Scope

### In Scope (MVP)

- Add browser-side dimension measurement for the terminal area.
- Send debounced resize messages from the client to the proxy.
- Update proxy NAWS subnegotiation after server support is negotiated.
- Test or manually verify initial dimensions and resize updates.
- Preserve normal command input and terminal rendering behavior.

### Out of Scope

- Full xterm.js migration.
- Complex layout redesign.
- Server-side source changes.
- Mapper or game-panel work.

---

## Prerequisites

- [ ] Connection lifecycle behavior is stable enough for resize testing.
- [ ] Current terminal container sizing behavior is understood at desktop and mobile widths.

---

## Deliverables

1. Client terminal dimension measurement and resize message flow.
2. Proxy NAWS update handling tied to negotiated support.
3. Tests or manual validation notes for initial and changed terminal dimensions.

---

## Success Criteria

- [ ] Initial NAWS uses current terminal dimensions rather than fixed defaults.
- [ ] Resizing the terminal pane sends updated dimensions.
- [ ] Resize traffic is debounced.
- [ ] Resize behavior is verified without breaking command input.
