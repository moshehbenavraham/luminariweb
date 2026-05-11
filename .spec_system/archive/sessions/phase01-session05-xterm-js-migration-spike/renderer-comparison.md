# Terminal Renderer Comparison

**Session ID**: `phase01-session05-xterm-js-migration-spike`
**Started**: 2026-05-11
**Status**: Complete for implementation; final command evidence is recorded in `implementation-notes.md`.

---

## Scope

This document compares the current `ansi-to-html` renderer with an opt-in xterm.js spike. The default renderer remains the production path during this session. The xterm.js path is evaluated only through the non-default spike flag.

## Checklist

| Criterion | Current Renderer Baseline | xterm.js Spike Finding | Status |
|-----------|---------------------------|------------------------|--------|
| ANSI fidelity | Uses streaming `ansi-to-html` with XML escaping and newline conversion for terminal output. ANSI support is adequate for simple foreground/background color spans but limited to generated HTML chunks. | xterm receives the raw stream after Luminari-to-ANSI normalization and lets xterm process ANSI directly. Browser-level ANSI parity still needs visual checking before default migration. | Spike viable |
| Luminari color codes | Shared helper converts caret color codes and `^[F000]` or `^[B000]` RGB-style codes to ANSI before rendering. | Spike writes the same normalized text through xterm, avoiding a separate color conversion implementation. | Covered by helper tests |
| XML escaping | Current terminal stream uses `escapeXML: true`; HUD and panel rich text call `renderMudHtml()` with a fresh escaped converter. | Spike does not use `dangerouslySetInnerHTML` or a new raw HTML path; it writes text through xterm APIs. | Covered |
| Scrollback | Browser scroll area keeps the last 500 rendered chunks in React state. This is bounded, but chunk count is not equivalent to terminal lines. | Spike uses xterm-managed scrollback with `scrollback: 2000` and also receives bounded raw chunks from App state. | Improved path |
| Copy and paste | Browser text selection works through normal DOM selection in `.terminal-output`; clicking terminal refocuses command input unless an expanded selection exists. | xterm selection/copy should work through xterm's selection model, but this remains a manual browser risk because automated browser tests are not configured. | Manual check required |
| Keyboard workflow | External command input owns command entry, history, alias expansion, triggers, numpad movement, and send button behavior. | xterm stdin is disabled, the command form remains authoritative, and no second command-send path was added. | Covered |
| Mobile layout | Current renderer uses responsive CSS, wraps by default, and should be checked at 390px width for no horizontal page scrolling. | Spike is constrained by the existing terminal panel plus scoped CSS for hidden overflow and minimum mobile height. Real 390px viewport validation is still required. | Manual check required |
| Accessibility | Current output is selectable text but has no terminal role or accessible terminal label. Command input remains a real input. | Spike enables xterm screen-reader support, adds an application role label, and keeps the real command input as the entry control. | Improved path |
| Resize and NAWS | Current renderer measures DOM cell dimensions from `.terminal-output`, debounces resize messages, and deduplicates sent dimensions. | Spike uses `@xterm/addon-fit`, normalizes fit dimensions to shared bounds, suppresses duplicate dimensions, and reuses App's resize callback. | Covered |
| Performance | React appends bounded HTML chunks. Normal bursts should remain under the PRD target of 100 ms perceived latency, but very high chunk churn may still pressure React state. | Spike avoids HTML chunk rendering for terminal output after mount and delegates rendering to xterm. Large burst testing remains a follow-up browser check. | Promising |

## Baseline Evidence

- `src/App.tsx` owns terminal output state as HTML chunks and renders them with `dangerouslySetInnerHTML`.
- The current terminal converter is created with `escapeXML: true`, `newline: true`, and `stream: true`.
- Luminari color conversion currently lives in `src/App.tsx` through `convertLuminariColorCodes()` and `luminariRgbToAnsi()`.
- Terminal dimensions are measured from the current output element and sent through the existing resize message path.
- `npm test` passed before the renderer extraction work began.

## Open Items

- Record final `npm test`, `npm run lint`, `npm run build`, and ASCII evidence in `implementation-notes.md`.
- Record manual desktop and 390px checks if practical in this environment.
- Add browser automation in a later session if xterm becomes the default renderer.

## Migration Cost Estimate

| Follow-up Area | Estimated Session Size | Notes |
|----------------|------------------------|-------|
| Default renderer replacement | 2-3 hours | Replace the HTML branch, remove duplicated HTML terminal state, and keep command workflow regression checks focused. |
| Visual and mobile polish | 2-3 hours | Tune xterm theme, font metrics, selection, scrollback, and 390px layout after real browser inspection. |
| Browser regression coverage | 2-4 hours | Add Playwright or equivalent checks for default terminal render, query-param spike mode, focus, copy/selection, and resize behavior. |
| Performance evidence | 1-2 hours | Add synthetic terminal burst checks and compare React HTML chunk rendering against xterm writes. |

## Recommendation Input

The spike is technically viable and should move forward only as a staged migration. The current HTML renderer should remain the production default until browser-level selection, copy/paste, mobile layout, and burst-output evidence are captured in a follow-up session.
