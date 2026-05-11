# Task Checklist

**Session ID**: `phase02-session05-room-context-panel`
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

- [x] T001 [S0205] Verify Phase 02 Session 05 prerequisites, confirmed source room variables, existing default room mappings, and room fixture coverage, then record evidence (`.spec_system/specs/phase02-session05-room-context-panel/implementation-notes.md`)
- [x] T002 [S0205] Audit existing map fallback, room string formatting, sidebar tab behavior, command-input focus paths, and `MINIMAP` unavailable behavior before editing (`.spec_system/specs/phase02-session05-room-context-panel/implementation-notes.md`)
- [x] T003 [S0205] [P] Record security, privacy, persistence, protocol-schema, raw-fallback, accessibility, and GPL reference constraints for room context display work (`.spec_system/specs/phase02-session05-room-context-panel/security-compliance.md`)

---

## Foundation (7 tasks)

Core structures and base implementations.

- [x] T004 [S0205] [P] Extend or confirm room fixture coverage for full identity, partial identity, exit strings, exit arrays, exit tables, empty exits, unknown fields, malformed exits, and raw room payloads (`tests/fixtures/msdp/room-and-exits.json`)
- [x] T005 [S0205] [P] Update room fixture manifest counts, room coverage summary, and fixture documentation when room fixture coverage changes (`tests/fixtures/msdp/manifest.json`, `tests/fixtures/msdp/README.md`)
- [x] T006 [S0205] Add room display helper types and availability models for disabled, loading, empty, offline, error, raw, and present states with types matching declared contract; exhaustive enum handling (`shared/msdp-room-display.ts`)
- [x] T007 [S0205] Normalize room identity values from `ROOM_NAME`, `AREA_NAME`, `ROOM_VNUM`, `WORLD_TIME`, and structured `ROOM` fields with explicit loading, empty, error, and offline states (`shared/msdp-room-display.ts`)
- [x] T008 [S0205] Normalize representative `ROOM_EXITS` strings, arrays, tables, object-like entries, scalars, and raw fallback values into exit models with bounded summaries, deterministic ordering, and explicit loading, empty, error, and offline states (`shared/msdp-room-display.ts`)
- [x] T009 [S0205] Add focused room display helper tests for full identity, partial identity, zero values, blank values, disabled mappings, unknown fields, raw fallbacks, exit ordering, and connection states (`tests/msdp-room-display.test.ts`)
- [x] T010 [S0205] Extend state and fixture mapping expectations for `ROOM`, `ROOM_EXITS`, room identity fields, full variants, partial variants, malformed variants, and disabled mapping behavior without lossy coercion (`tests/msdp-state-mapping.test.ts`, `tests/msdp-fixture-mapping.test.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T011 [S0205] Wire the room display model into the app without changing socket, renderer, reconnect, alias, trigger, character, combat, group, inventory, affects, settings, map fallback, or command-input paths (`src/App.tsx`)
- [x] T012 [S0205] Add a Room sidebar tab with platform-appropriate accessibility labels, focus management, and input support while preserving existing tab order (`src/App.tsx`)
- [x] T013 [S0205] Render room identity fields for room name, area name, room vnum, world time, and structured room details with visible labels and accessible names (`src/App.tsx`)
- [x] T014 [S0205] Render exit rows for direction, destination, status, raw fallback, and unknown-field summaries with bounded text and deterministic ordering (`src/App.tsx`)
- [x] T015 [S0205] Render disabled, waiting, empty, offline, error, raw, and present room states with explicit loading, empty, error, and offline states (`src/App.tsx`)
- [x] T016 [S0205] Preserve terminal room text as the primary description and keep `MINIMAP` out of room context requirements while retaining map fallback behavior (`src/App.tsx`)
- [x] T017 [S0205] Add compact room context, room field, exit row, destination, status, raw fallback, and unknown-field styles for desktop and 390px mobile layouts (`src/App.css`)
- [x] T018 [S0205] Add 360px smoke-width CSS safeguards for room names, exit labels, tab wrapping, command input, and no horizontal scrolling (`src/App.css`)
- [x] T019 [S0205] [P] Document room display tests, fixture cautions, schema unknowns, `MINIMAP` separation, and manual responsive check expectations (`tests/README.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T020 [S0205] Run `npm test` and record the result with focused room display, room fixture, parser, and state-mapping evidence (`.spec_system/specs/phase02-session05-room-context-panel/implementation-notes.md`)
- [x] T021 [S0205] Run `npm run lint` and `npm run build`, then record the results and any residual failures (`.spec_system/specs/phase02-session05-room-context-panel/implementation-notes.md`)
- [x] T022 [S0205] Manually verify desktop, 390px mobile, and 360px smoke layouts for waiting, empty, full, partial, table, array, string, long-name, raw fallback, and horizontal scroll behavior (`.spec_system/specs/phase02-session05-room-context-panel/implementation-notes.md`)
- [x] T023 [S0205] Validate ASCII encoding, Unix LF line endings, accessibility notes, security notes, no new persistence, no GPL code copying, and completion checklist readiness (`.spec_system/specs/phase02-session05-room-context-panel/security-compliance.md`)

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
