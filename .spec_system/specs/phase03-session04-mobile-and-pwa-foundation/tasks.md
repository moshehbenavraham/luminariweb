# Task Checklist

**Session ID**: `phase03-session04-mobile-and-pwa-foundation`
**Total Tasks**: 20
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
| Foundation | 5 | 5 | 0 |
| Implementation | 8 | 8 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0304] Review existing mobile status, command, terminal, HUD, inspector, and reconnect wiring with explicit loading, empty, error, and offline states (`src/App.tsx`)
- [x] T002 [S0304] [P] Create implementation notes with `EXAMPLES/lociterm` behavior-only mobile/PWA reference boundaries and current responsive findings (`.spec_system/specs/phase03-session04-mobile-and-pwa-foundation/implementation-notes.md`)
- [x] T003 [S0304] [P] Create security and compliance notes for static-only service-worker caching, no command or settings caching, no secret persistence, and no copied LGPL/GPL reference code (`.spec_system/specs/phase03-session04-mobile-and-pwa-foundation/security-compliance.md`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0304] [P] Create shared PWA and network-status helpers with service-worker eligibility, cache allowlist decisions, explicit error mapping, and exhaustive status handling (`shared/pwa-support.ts`)
- [x] T005 [S0304] [P] Add PWA helper tests for online/offline labels, reconnect decisions, static asset cache eligibility, dynamic route exclusions, and unsupported-browser fallbacks (`tests/pwa-support.test.ts`)
- [x] T006 [S0304] [P] Create app manifest metadata with same-origin start URL, explicit scope, display mode, theme colors, categories, and static icon references (`public/manifest.webmanifest`)
- [x] T007 [S0304] [P] Create conservative service worker with same-origin static GET caching, `/api/` and `/ws` bypasses, network fallback, versioned cache cleanup, and no player-data persistence (`public/service-worker.js`)
- [x] T008 [S0304] Wire guarded service-worker registration into app startup with capability checks, timeout-safe failure handling, and no startup crash on unsupported browsers (`src/main.tsx`)

---

## Implementation (8 tasks)

Main feature implementation.

- [x] T009 [S0304] Add manifest, description, mobile theme, and viewport-fit metadata while preserving the current Vite entry point (`index.html`)
- [x] T010 [S0304] Add browser online/offline state wiring with cleanup on scope exit for all acquired event listeners (`src/App.tsx`)
- [x] T011 [S0304] Add mobile-visible network, proxy, MUD, and reconnect status messaging with explicit loading, offline, error, and in-flight states (`src/App.tsx`)
- [x] T012 [S0304] Add touch-friendly command history and reconnect affordances with duplicate-trigger prevention while send or connect actions are in-flight (`src/App.tsx`)
- [x] T013 [S0304] Tune terminal, HUD, command dock, inspector tabs, and panel content for 390px and 360px widths with stable dimensions and no horizontal page scroll (`src/App.css`)
- [x] T014 [S0304] Add safe-area, keyboard-height, long-text wrapping, and touch-target styling for mobile status, command controls, automation menus, and inspector content (`src/App.css`)
- [x] T015 [S0304] Document mobile/PWA behavior, installability limits, service-worker cache policy, browser support notes, and manual validation procedure (`docs/mobile-pwa.md`)
- [x] T016 [S0304] Update test documentation with PWA helper commands and desktop, 390px, 360px, offline/online, reconnect, installability, and service-worker smoke checks (`tests/README.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0304] [P] Run focused PWA helper tests, then fix or document any failures (`tests/pwa-support.test.ts`)
- [x] T018 [S0304] Run the full Node test suite, lint, and production build, then fix or document any failures (`package.json`)
- [x] T019 [S0304] Perform manual desktop, 390px, and 360px responsive smoke checks with online/offline toggles, reconnect flow, command input, HUD, inspector, and automation menus (`.spec_system/specs/phase03-session04-mobile-and-pwa-foundation/implementation-notes.md`)
- [x] T020 [S0304] Validate ASCII encoding, service-worker cache exclusions, reference boundaries, residual risks, and final handoff notes (`.spec_system/specs/phase03-session04-mobile-and-pwa-foundation/implementation-notes.md`)

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

Run the implement workflow step to begin AI-led implementation.
