# Task Checklist

**Session ID**: `phase02-session04-affects-and-inventory-panels`
**Total Tasks**: 23
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
| Foundation | 7 | 7 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **23** | **23** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0204] Verify Phase 02 Session 04 prerequisites, `AFFECTS` and `INVENTORY` fixture coverage, parser table/array coverage, and confirmed source MSDP fields, then record evidence (`.spec_system/specs/phase02-session04-affects-and-inventory-panels/implementation-notes.md`)
- [x] T002 [S0204] Audit existing generic affects rendering, missing inventory sidebar tab, optional availability notices, and command-input focus paths before editing (`.spec_system/specs/phase02-session04-affects-and-inventory-panels/implementation-notes.md`)
- [x] T003 [S0204] [P] Record security, privacy, persistence, protocol-schema, raw-fallback, and accessibility constraints for affects and inventory display work (`.spec_system/specs/phase02-session04-affects-and-inventory-panels/security-compliance.md`)

---

## Foundation (7 tasks)

Core structures and base implementations.

- [x] T004 [S0204] [P] Extend or confirm collection fixture coverage for full affects, partial affects, empty collections, unknown fields, raw values, grouped inventory, counted inventory, and object-like payloads (`tests/fixtures/msdp/collections.json`)
- [x] T005 [S0204] [P] Update collection fixture manifest counts, coverage summary, and fixture documentation when collection fixture coverage changes (`tests/fixtures/msdp/manifest.json`, `tests/fixtures/msdp/README.md`)
- [x] T006 [S0204] Add affects and inventory display helper types and availability models for disabled, loading, empty, offline, error, raw, and present states with types matching declared contract; exhaustive enum handling (`shared/msdp-affects-inventory-display.ts`)
- [x] T007 [S0204] Normalize representative `AFFECTS` arrays, tables, object-like entries, strings, and raw fallback values into affect models with explicit loading, empty, error, and offline states (`shared/msdp-affects-inventory-display.ts`)
- [x] T008 [S0204] Normalize representative `INVENTORY` arrays, grouped tables, counted tables, object-like entries, strings, and raw fallback values into inventory models with bounded summaries, deterministic ordering, and explicit loading, empty, error, and offline states (`shared/msdp-affects-inventory-display.ts`)
- [x] T009 [S0204] Add focused affects and inventory display helper tests for full rows, partial rows, zero values, empty payloads, disabled mappings, unknown fields, alias keys, raw fallbacks, and connection states (`tests/msdp-affects-inventory-display.test.ts`)
- [x] T010 [S0204] Extend state mapping expectations for `AFFECTS` and `INVENTORY` full, partial, empty, object-like, raw, and disabled mapping behavior without lossy coercion (`tests/msdp-state-mapping.test.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T011 [S0204] Wire the affects and inventory display models into the app without changing socket, renderer, reconnect, alias, trigger, combat, group, room, or command-input paths (`src/App.tsx`)
- [x] T012 [S0204] Add an inventory sidebar tab with platform-appropriate accessibility labels, focus management, and input support while preserving existing tab order (`src/App.tsx`)
- [x] T013 [S0204] Replace generic affects value rendering with typed affects rows for names, durations, modifiers, raw fallbacks, and unknown-field summaries (`src/App.tsx`)
- [x] T014 [S0204] Render inventory groups and item rows for names, counts, locations, raw fallbacks, and unknown-field summaries (`src/App.tsx`)
- [x] T015 [S0204] Render disabled, waiting, empty, offline, error, raw, and unknown-field affects and inventory states with explicit loading, empty, error, and offline states (`src/App.tsx`)
- [x] T016 [S0204] Keep affects and inventory panel updates isolated from character, combat, group, room, terminal, reconnect, alias, trigger, settings, and command-input state (`src/App.tsx`)
- [x] T017 [S0204] Add compact affects row, inventory group, item, count, modifier, duration, raw fallback, and unknown-field styles for desktop and 390px mobile layouts (`src/App.css`)
- [x] T018 [S0204] Add 360px smoke-width CSS safeguards for collection row wrapping, long names, tab wrapping, command input, and no horizontal scrolling (`src/App.css`)
- [x] T019 [S0204] [P] Document affects and inventory display tests, fixture cautions, schema unknowns, and manual responsive check expectations (`tests/README.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T020 [S0204] Run `npm test` and record the result with focused affects, inventory, fixture, parser, and state-mapping evidence (`.spec_system/specs/phase02-session04-affects-and-inventory-panels/implementation-notes.md`)
- [x] T021 [S0204] Run `npm run lint` and `npm run build`, then record the results and any residual failures (`.spec_system/specs/phase02-session04-affects-and-inventory-panels/implementation-notes.md`)
- [x] T022 [S0204] Manually verify desktop, 390px mobile, and 360px smoke layouts for waiting, empty, full, partial, grouped, counted, long-name, raw fallback, and horizontal scroll behavior (`.spec_system/specs/phase02-session04-affects-and-inventory-panels/implementation-notes.md`)
- [x] T023 [S0204] Validate ASCII encoding, Unix LF line endings, accessibility notes, security notes, no new persistence, no GPL code copying, and completion checklist readiness (`.spec_system/specs/phase02-session04-affects-and-inventory-panels/security-compliance.md`)

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
