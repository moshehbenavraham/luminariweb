# Session 02: Windows and Layout Ergonomics

**Session ID**: `phase03-session02-windows-and-layout-ergonomics`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Improve multi-panel organization while preserving terminal-first play and command input access.

---

## Scope

### In Scope (MVP)

- Review current terminal, HUD, sidebar, panel, and map navigation behavior.
- Study window and sidebar ideas from `EXAMPLES/mud-web-client` as behavior-only reference input.
- Improve panel switching, density, and persistence where it helps repeated play.
- Keep layouts compact, scan-friendly, keyboard reachable, and mobile-aware.
- Avoid nested card-heavy layouts and prevent panels from obscuring command input.
- Add responsive smoke checks for desktop, 390px, and 360px viewports.

### Out of Scope

- A full draggable desktop window manager.
- Cloud-synced layout profiles.
- Replacing the terminal renderer.
- Copying GPL reference UI code.

---

## Prerequisites

- [ ] Phase 02 panel surfaces are complete.
- [ ] Session 01 mapper behavior is available or explicitly compatible with planned layout changes.
- [ ] Existing focus and command-input behavior is understood before UI changes.

---

## Deliverables

1. Layout and panel navigation improvements.
2. Persistence behavior for safe local layout preferences if needed.
3. Responsive validation notes or screenshots.
4. Updated tests where state or display helpers change.

---

## Success Criteria

- [ ] Players can move between terminal, HUD, panels, and map efficiently.
- [ ] Command input stays visible and usable during normal play.
- [ ] Keyboard navigation and focus states remain usable.
- [ ] Mobile and desktop screenshots pass visual sanity checks.
