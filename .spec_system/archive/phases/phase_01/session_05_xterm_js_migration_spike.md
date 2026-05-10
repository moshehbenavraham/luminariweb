# Session 05: xterm.js Migration Spike

**Session ID**: `phase01-session05-xterm-js-migration-spike`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Validate and scope the preferred xterm.js migration while keeping the current renderer stable until replacement is ready.

---

## Scope

### In Scope (MVP)

- Compare current renderer behavior against ANSI, scrollback, copy/paste, keyboard, mobile, accessibility, and performance needs.
- Build a small xterm.js spike using `@xterm/xterm`, fit behavior, scrollback, and existing command input integration.
- Verify Luminari color handling and server ANSI output remain correct.
- Document migration costs, risks, and right-sized follow-up sessions.
- Keep the custom renderer as the interim fallback unless xterm.js passes acceptance checks.

### Out of Scope

- Shipping a full renderer replacement if the spike shows more work is needed.
- Parser rewrites.
- Game panel redesign.
- Copying GPL reference implementation code.

---

## Prerequisites

- [ ] Parser and lifecycle coverage is stable enough to isolate renderer findings.
- [ ] Current `ansi-to-html` escaping behavior is documented before changing output paths.

---

## Deliverables

1. Bounded xterm.js spike or prototype.
2. Comparison notes for current renderer versus xterm.js.
3. Decision record approving migration with follow-up sessions or deferring it with evidence.

---

## Success Criteria

- [ ] xterm.js migration is approved with a session breakdown or deferred with blocking evidence.
- [ ] Current renderer gaps are listed if it remains in service.
- [ ] The spike does not mix terminal rendering changes with Telnet parser rewrites.
- [ ] GPL reference repositories are used only for behavior and acceptance ideas, not copied code.
