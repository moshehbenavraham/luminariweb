# Task Checklist

**Session ID**: `phase01-session05-xterm-js-migration-spike`
**Total Tasks**: 22
**Estimated Duration**: 3-4 hours
**Created**: 2026-05-11

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[SNNMM]` = Session reference (NN=phase number, MM=session number)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 6 | 6 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **22** | **22** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0105] Verify Phase 1 Session 04 tests and renderer baseline commands, then record prerequisite evidence (`.spec_system/specs/phase01-session05-xterm-js-migration-spike/implementation-notes.md`)
- [x] T002 [S0105] Inspect current terminal renderer behavior and start the comparison checklist with ANSI, scrollback, copy/paste, keyboard, mobile, accessibility, and performance criteria (`.spec_system/specs/phase01-session05-xterm-js-migration-spike/renderer-comparison.md`)
- [x] T003 [S0105] [P] Create security, privacy, and license notes for xterm dependency use, terminal text handling, no command logging, and GPL reference boundaries (`.spec_system/specs/phase01-session05-xterm-js-migration-spike/security-compliance.md`)

---

## Foundation (6 tasks)

Core structures and base implementations.

- [x] T004 [S0105] Add xterm.js spike dependencies with intentional lockfile updates and no script churn (`package.json`)
- [x] T005 [S0105] Extract current ANSI and Luminari terminal rendering helpers with preserved XML escaping invariants (`src/terminal/render-mud-html.ts`)
- [x] T006 [S0105] Update the default App renderer to import extracted helpers without changing current terminal output behavior (`src/App.tsx`)
- [x] T007 [S0105] [P] Create xterm spike option and dimension helpers with bounded columns, rows, scrollback, theme, and accessibility defaults (`src/terminal/xterm-spike-options.ts`)
- [x] T008 [S0105] [P] Add current renderer tests for escaping, Luminari color conversion, literal angle brackets, and reset handling (`tests/terminal-renderer.test.ts`)
- [x] T009 [S0105] Add bounded raw terminal text history beside current HTML chunks with state reset on connection changes (`src/App.tsx`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T010 [S0105] Create the xterm spike component with terminal instance, addon setup, and cleanup on scope exit for all acquired resources (`src/terminal/XtermTerminalSpike.tsx`)
- [x] T011 [S0105] Wire xterm fit behavior and resize callbacks into existing terminal dimension handling with duplicate-trigger prevention while in-flight (`src/terminal/XtermTerminalSpike.tsx`)
- [x] T012 [S0105] Implement terminal text writes into xterm from the raw terminal stream with scoped reset on reconnect and renderer mode changes (`src/terminal/XtermTerminalSpike.tsx`)
- [x] T013 [S0105] Add a non-default renderer mode parser such as `terminalRenderer=xterm-spike` with validated input and fallback behavior (`src/App.tsx`)
- [x] T014 [S0105] Render the xterm spike branch behind the opt-in mode while keeping the current renderer as default (`src/App.tsx`)
- [x] T015 [S0105] Preserve command input focus, history, aliases, triggers, movement shortcuts, and paste behavior while the xterm spike is mounted (`src/App.tsx`)
- [x] T016 [S0105] Add xterm spike CSS with stable dimensions, mobile-safe overflow behavior, and no regression to current terminal styles (`src/terminal/xterm-spike.css`)
- [x] T017 [S0105] Complete renderer comparison notes with default renderer findings, xterm spike findings, risks, and migration cost estimates (`.spec_system/specs/phase01-session05-xterm-js-migration-spike/renderer-comparison.md`)
- [x] T018 [S0105] Write the terminal renderer decision record approving staged migration or deferring with evidence-backed blockers (`docs/adr/0001-terminal-renderer.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T019 [S0105] [P] Add xterm spike contract tests for option defaults, bounded fit dimensions, and invalid mode fallback helpers (`tests/xterm-spike-contract.test.ts`)
- [x] T020 [S0105] Update test documentation with terminal renderer coverage, xterm spike limits, and manual browser check instructions (`tests/README.md`)
- [x] T021 [S0105] Update architecture documentation with the terminal renderer decision and dependency rationale (`docs/ARCHITECTURE.md`)
- [x] T022 [S0105] Run `npm test`, `npm run lint`, `npm run build`, manual desktop and 390px checks where practical, and ASCII validation, then record evidence (`.spec_system/specs/phase01-session05-xterm-js-migration-spike/implementation-notes.md`)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for the validate workflow step

---

## Next Steps

Run the validate workflow step to verify session completeness.
