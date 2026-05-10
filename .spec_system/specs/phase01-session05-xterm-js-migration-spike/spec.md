# Session Specification

**Session ID**: `phase01-session05-xterm-js-migration-spike`
**Phase**: 01 - Harden Terminal and Proxy
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session validates the preferred long-term terminal renderer path without replacing the production renderer by default. Phase 1 has already added parser edge-case coverage, malformed MSDP coverage, reconnect cleanup, and dynamic NAWS resize behavior, so the renderer decision can now be evaluated against a stable protocol and lifecycle foundation.

The current browser terminal stores HTML chunks produced by `ansi-to-html` and renders them through `dangerouslySetInnerHTML`. That path is acceptable only while XML escaping remains intact and while the renderer can satisfy ANSI fidelity, scrollback, copy/paste, keyboard, mobile, accessibility, and performance needs. This session extracts and tests the current renderer invariants, then adds an opt-in xterm.js spike that consumes the same terminal stream and preserves the existing external command input.

The outcome is evidence, not a broad migration. The default renderer remains in service unless the spike proves xterm.js is ready for a right-sized follow-up migration. The session ends with comparison notes and a terminal renderer decision record that either approves a staged migration or defers it with blocking evidence.

---

## 2. Objectives

1. Document current renderer behavior and gaps across ANSI, Luminari color codes, scrollback, copy/paste, keyboard, mobile, accessibility, and performance.
2. Add a bounded, opt-in xterm.js prototype using fit behavior, scrollback, and the existing command input workflow.
3. Preserve and test the current renderer escaping invariant while the spike is isolated from the default production path.
4. Record a migration decision with follow-up session boundaries or defer migration with concrete blockers.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase01-session01-telnet-parser-edge-case-tests` - Provides parser edge-case coverage before renderer experimentation.
- [x] `phase01-session02-msdp-tables-arrays-malformed-payloads` - Provides MSDP fixture confidence before display-path evaluation.
- [x] `phase01-session03-connection-lifecycle-reconnect-cleanup` - Provides reconnect cleanup and stale-socket safeguards.
- [x] `phase01-session04-dynamic-naws-resize` - Provides measured terminal dimensions and resize routing needed for xterm fit evaluation.

### Required Tools/Knowledge
- React refs, effects, cleanup behavior, and stable callbacks.
- Existing `src/App.tsx` terminal stream, command input, alias, trigger, and resize flows.
- xterm.js browser terminal concepts: terminal instance lifecycle, fit addon, scrollback, themes, and write API.
- Node built-in `node:test` runner with `tsx`.

### Environment Requirements
- `npm install` has already been run.
- `npm test`, `npm run lint`, and `npm run build` are available.
- Browser manual checks can run against the local Vite or full app dev server.
- No live MUD is required for automated tests; manual renderer checks can use synthetic output or an available configured MUD route.

---

## 4. Scope

### In Scope (MVP)
- Maintainer can compare the current renderer against xterm.js - create checklist-driven comparison notes with ANSI, Luminari color, scrollback, copy/paste, keyboard, mobile, accessibility, and performance findings.
- Player default terminal behavior remains stable - keep `ansi-to-html` as the default renderer and protect XML escaping with focused tests.
- Maintainer can opt into the xterm.js spike - add a non-default development switch such as a query parameter, with validated mode parsing and fallback to the current renderer.
- Player command workflow remains intact during the spike - preserve external command input, history, aliases, triggers, movement shortcuts, and auto-scroll behavior.
- Browser terminal dimensions can be evaluated through xterm fit behavior - wire fit output to the existing resize path without weakening NAWS lifecycle guards.
- Maintainer can decide the renderer path - write an ADR or decision record with staged migration sessions or deferral blockers.

### Out of Scope (Deferred)
- Full production renderer replacement - *Reason: This session validates and scopes migration; a follow-up session owns default-path replacement.*
- Telnet parser rewrites - *Reason: Parser hardening is already covered by Phase 1 sessions 1-2 and must stay separate from renderer work.*
- Game panel redesign - *Reason: Phase 2 owns Luminari game panels.*
- Public proxy hardening - *Reason: Session 06 owns deployment safety guardrails.*
- GPL reference implementation import - *Reason: Reference repositories can inform behavior only; code copying remains out of scope.*
- PWA or mobile installable work - *Reason: Later phases own installable-browser ergonomics.*

---

## 5. Technical Approach

### Architecture

Keep the production rendering path stable while introducing a narrow xterm spike path. First, extract the current terminal text normalization and HTML conversion into `src/terminal/render-mud-html.ts` so tests can lock down Luminari color conversion and XML escaping. `src/App.tsx` should continue to use the extracted helper for the default renderer.

Add xterm.js dependencies intentionally, then create an isolated `XtermTerminalSpike` component under `src/terminal/`. The component should own the xterm terminal instance, fit addon, lifecycle cleanup, theme, scrollback setting, and text writes. It should expose a small callback for fit-derived dimensions so `src/App.tsx` can reuse the existing resize message path introduced in Session 04.

Enable the spike through a non-default development switch, for example `?terminalRenderer=xterm-spike`. When the switch is absent or invalid, the current HTML renderer remains active. The app should retain a raw bounded terminal text history alongside the existing HTML chunks only as needed for the spike, with history reset on connection changes just like current terminal chunks.

Use the spike to complete comparison notes and a terminal renderer decision record. If xterm.js passes the checklist, the ADR should split the production migration into follow-up sessions, such as renderer replacement, visual/mobile polish, and browser-level regression coverage. If it fails, the ADR should list blockers and the current renderer gaps that remain.

### Design Patterns
- Explicit opt-in spike: Keep experimental renderer behavior behind a clear non-default flag.
- Shared text normalization: Feed both renderers from the same Luminari color conversion source.
- Lifecycle-owned resources: Instantiate and dispose xterm objects, observers, listeners, and timers inside component scope.
- Evidence-first decision: Approve or defer migration from checklist results rather than preference alone.
- License boundary: Study reference clients for behavior only, with no imported GPL code.

### Technology Stack
- TypeScript 6
- React 19
- Vite 8
- `ansi-to-html` 0.7 for the current default renderer
- `@xterm/xterm` resolved by npm during implementation
- `@xterm/addon-fit` resolved by npm during implementation
- Node built-in `node:test`
- `tsx` test loader

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `src/terminal/render-mud-html.ts` | Shared current-renderer text normalization and escaped HTML conversion | ~120 |
| `src/terminal/xterm-spike-options.ts` | xterm spike option, theme, and dimension helper functions | ~90 |
| `src/terminal/XtermTerminalSpike.tsx` | Opt-in xterm.js prototype component with fit behavior and cleanup | ~180 |
| `src/terminal/xterm-spike.css` | Stable xterm spike container and mobile-safe sizing styles | ~70 |
| `tests/terminal-renderer.test.ts` | Current renderer tests for XML escaping and Luminari color conversion | ~130 |
| `tests/xterm-spike-contract.test.ts` | Helper-level tests for xterm options and fit dimension normalization | ~100 |
| `.spec_system/specs/phase01-session05-xterm-js-migration-spike/renderer-comparison.md` | Current renderer versus xterm.js evaluation notes | ~160 |
| `.spec_system/specs/phase01-session05-xterm-js-migration-spike/implementation-notes.md` | Implementation progress and command evidence | ~100 |
| `.spec_system/specs/phase01-session05-xterm-js-migration-spike/security-compliance.md` | Session security, privacy, and license notes | ~80 |
| `docs/adr/0001-terminal-renderer.md` | Decision record approving or deferring xterm.js migration | ~140 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `package.json` | Add xterm.js dependencies and keep scripts stable | ~4 |
| `package-lock.json` | Record resolved xterm.js dependency tree | ~120 |
| `src/App.tsx` | Use extracted renderer helper, retain raw terminal text for spike, add opt-in renderer mode, and wire xterm dimensions to existing resize path | ~180 |
| `src/App.css` | Preserve current terminal styles and add any app-level layout support needed for the spike | ~30 |
| `tests/README.md` | Document terminal renderer and xterm spike test coverage | ~35 |
| `docs/ARCHITECTURE.md` | Update terminal renderer rationale after the decision record is written | ~35 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] The current `ansi-to-html` renderer remains the default when no spike flag is present.
- [ ] Current renderer tests verify XML escaping, Luminari color conversion, and safe handling of literal angle brackets.
- [ ] The xterm.js spike can be enabled through a non-default development switch and falls back safely for invalid mode values.
- [ ] The spike renders the same incoming terminal text stream, including ANSI and Luminari color output.
- [ ] xterm fit behavior reports bounded columns and rows through the existing resize pathway.
- [ ] Existing command input, command history, aliases, triggers, movement shortcuts, and reconnect terminal reset behavior still work.
- [ ] Renderer comparison notes cover ANSI, scrollback, copy/paste, keyboard, mobile, accessibility, and performance findings.
- [ ] The terminal renderer decision record approves a staged migration or defers it with evidence-backed blockers.

### Testing Requirements
- [ ] Unit tests cover current renderer escaping and Luminari color conversion.
- [ ] Unit tests cover xterm spike option helpers and fit dimension normalization.
- [ ] Existing parser, MSDP, lifecycle, and NAWS tests still pass.
- [ ] Manual desktop renderer checks are recorded for default and xterm spike modes.
- [ ] Manual 390px mobile-width renderer checks are recorded for default and xterm spike modes if practical.

### Non-Functional Requirements
- [ ] Terminal append and HUD updates remain within the PRD target of under 100 ms perceived latency for normal output bursts.
- [ ] The spike does not introduce new raw HTML output paths or weaken XML escaping.
- [ ] xterm resources, event listeners, observers, and timers are disposed on unmount or mode changes.
- [ ] No player command text is logged by renderer diagnostics.
- [ ] New dependency and license notes are documented.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.

---

## 8. Implementation Notes

### Key Considerations
- Keep this session limited to a spike and decision. Do not replace the default renderer unless a later session explicitly owns that migration.
- Preserve `renderMudHtml()` escaping behavior before changing where current-renderer HTML is produced.
- Keep xterm input disabled or scoped so the existing command input remains authoritative.
- Keep NAWS and resize lifecycle behavior from Session 04 intact.
- Do not log terminal text or player commands while measuring performance or writing diagnostics.

### Potential Challenges
- xterm.js writes are imperative while the current renderer is React state driven: Use a small component boundary and append terminal text through effects.
- The spike may steal focus from the command input: Disable xterm stdin or redirect focus behavior deliberately.
- Fit addon dimensions can race with layout changes: Debounce or compare dimensions before sending through the existing resize path.
- Browser tests are not configured: Keep automated tests helper-level and record manual checks for actual renderer behavior.
- Dependency CSS can affect layout: Scope xterm styles to the spike container and verify mobile width.

### Relevant Considerations
- [P01] **`src/App.tsx` remains a large integration point**: Keep App edits narrow and isolate new renderer code in `src/terminal/`.
- [P01] **`ansi-to-html` remains the terminal renderer**: Preserve XML escaping unless the renderer is fully replaced in a later session.
- [P01] **xterm.js is the preferred long-term terminal path**: Validate input, scrollback, resize, and copy/paste behavior before migration.
- [P01] **Do not change HTML terminal rendering without preserving XML escaping**: Add focused tests before and after extraction.
- [P01] **Do not log raw player commands**: Renderer diagnostics must not include command text or live transcripts.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- The current renderer escaping invariant can regress while helpers are extracted.
- xterm instance, addon, observer, or event listener cleanup can leak across renderer mode changes.
- The xterm canvas can steal command focus, break copy/paste expectations, or bypass existing command history and trigger flows.
- Fit-derived resize updates can duplicate or conflict with the existing measured resize path.

---

## 9. Testing Strategy

### Unit Tests
- Test `renderMudHtml()` escapes literal HTML while preserving ANSI color conversion.
- Test Luminari color-code conversion for known foreground, background, reset, and literal escape cases.
- Test xterm option helpers for scrollback, theme, accessibility labels, and dimension normalization.

### Integration Tests
- Keep existing parser, MSDP, lifecycle, reconnect, and NAWS resize tests passing.
- Exercise the App build path with both renderer imports present through `npm run build`.
- Use the local app to compare default and spike renderer behavior with synthetic ANSI/Luminari output or an available configured MUD route.

### Manual Testing
- Start the local app, load the default renderer, connect or feed representative terminal output, and verify command input focus, auto-scroll, selection/copy, aliases, triggers, and movement shortcuts.
- Reload with the xterm spike flag, repeat the same workflow, resize the browser window, and verify fit-derived dimensions do not disrupt input.
- Check a 390px viewport for no horizontal page scrolling, usable command dock, readable terminal output, and no overlapping controls.

### Edge Cases
- Invalid or absent renderer mode flag.
- WebSocket reconnect while xterm spike is mounted.
- Rapid terminal output bursts during xterm writes.
- Terminal pane hidden, zero-sized, or resized immediately after connect.
- Browser does not support a ResizeObserver behavior expected by the spike.
- Literal `<`, `>`, `&`, quotes, and color-like text in MUD output.
- Copy/paste from terminal output while command input remains the active input path.

---

## 10. Dependencies

### External Libraries
- `@xterm/xterm`: npm-resolved version for browser terminal prototype.
- `@xterm/addon-fit`: npm-resolved version for fit and terminal dimension evaluation.

### Other Sessions
- **Depends on**: `phase01-session01-telnet-parser-edge-case-tests`, `phase01-session02-msdp-tables-arrays-malformed-payloads`, `phase01-session03-connection-lifecycle-reconnect-cleanup`, `phase01-session04-dynamic-naws-resize`
- **Depended by**: Follow-up terminal renderer migration sessions if approved, Phase 02 room/map and mobile terminal workflows

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
