# Session Specification

**Session ID**: `phase03-session01-mapper-ux-reference-implementation`
**Phase**: 03 - Borrow the Best Ideas
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session evolves the current room/exits map fallback into a more useful original mapper experience. The implementation should continue to use only source-confirmed Luminari room data: `ROOM`, `ROOM_NAME`, `ROOM_VNUM`, `AREA_NAME`, and `ROOM_EXITS`. `MINIMAP` remains an override-only path and must not be treated as source-confirmed live mapper support.

The current app already has room normalization and a map fallback, but the map is still mostly a textual summary. This session should introduce a compact current-room model, directional exit expansion, and an accessible visual rendering that helps players orient themselves without obscuring the terminal or command input.

The `EXAMPLES/mud-web-client` mapper code is GPL-3.0 and may be studied only as behavioral inspiration. Useful behaviors include current-room highlighting, directional neighbor placement, exit line semantics, and bounded rendering around the current room. The implementation in this repository must be original TypeScript and React code.

---

## 2. Objectives

1. Define a Luminari-safe mapper display model from confirmed room identity and exit variables.
2. Render current-room highlighting and known directional exits without assuming persistent world-map storage.
3. Preserve explicit loading, empty, disabled, offline, error, malformed, and override-only `MINIMAP` states.
4. Add focused tests and notes that prove mapper behavior is bounded, deterministic, and license-safe.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session05-room-context-panel` - Provides room identity and exit normalization.
- [x] `phase02-session06-map-and-quest-fallback-strategy` - Provides the current map fallback and `MINIMAP` override-only boundary.

### Required Tools/Knowledge
- React 19 component and hook conventions.
- Shared TypeScript display-helper patterns under `shared/`.
- Node test runner via `node --import tsx --test`.
- License posture for GPL reference repositories.

### Environment Requirements
- Dependencies installed with the current `package-lock.json`.
- `EXAMPLES/mud-web-client` available for behavior-only reference review.
- Local quality commands available: `npm run test`, `npm run lint`, and `npm run build`.

---

## 4. Scope

### In Scope (MVP)
- Player can see a current-room mapper node derived from source-confirmed room identity - Implement in the existing map display helper and map panel.
- Player can see directional exit branches when `ROOM_EXITS` provides known exits - Use deterministic direction ordering and bounded labels.
- Player can still read useful fallback text when room metadata is partial, malformed, or raw - Preserve existing availability and raw fallback behavior.
- Maintainer can verify mapper normalization through focused tests - Extend map display tests and fixture notes where needed.
- Maintainer can inspect GPL reference boundaries - Document behavior-only reference use in implementation notes.

### Out of Scope (Deferred)
- Persistent world-map storage across browser sessions - *Reason: first pass must stay bounded to current room and exits.*
- Server-side mapper, GMCP mapper, or source-level protocol changes - *Reason: Phase 04 owns source-level protocol work.*
- Copying or adapting GPL reference code - *Reason: project license posture remains permissive.*
- Assuming live `MINIMAP` support - *Reason: source audit has not confirmed population of live `MINIMAP`.*
- Full draggable or zoomable mapper canvas - *Reason: Session 02 owns broader window and layout ergonomics.*

---

## 5. Technical Approach

### Architecture

Keep mapper interpretation in `shared/msdp-map-display.ts` so the display contract remains testable outside React. Extend `MapDisplayModel` and `MapFallbackModel` with a compact mapper model that contains the current room, normalized directional exits, unknown or raw exits, and accessible summary text.

Keep React rendering in `src/App.tsx` close to the existing `MapPanel` and `MapFallbackView` wiring. Add small presentational components only where they clarify the current room and exit branch rendering. Keep styling in `src/App.css` using stable dimensions and responsive constraints so the map cannot resize unpredictably or create horizontal scrolling.

### Design Patterns
- Pure display model: Keep room and exit interpretation deterministic and testable in `shared/`.
- Explicit availability states: Preserve offline, loading, empty, error, disabled, fallback, and live override differences.
- Original reference adaptation: Use reference repositories for behavior notes only, then implement original TypeScript/React code.
- Bounded rendering: Limit raw and unknown-field summaries so malformed payloads cannot dominate the sidebar.

### Technology Stack
- React 19.2.5 for map panel rendering.
- TypeScript 6.0.2 for shared contracts and strict build checks.
- Vite 8.0.10 for frontend build.
- Node test runner with `tsx` for mapper display tests.
- CSS for responsive mapper layout and accessibility-visible states.

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `.spec_system/specs/phase03-session01-mapper-ux-reference-implementation/implementation-notes.md` | Implementation notes, reference boundaries, and responsive validation notes | ~80 |
| `.spec_system/specs/phase03-session01-mapper-ux-reference-implementation/security-compliance.md` | Security, privacy, and license notes for mapper work | ~50 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `shared/msdp-map-display.ts` | Add mapper display model, current-room node, deterministic exit branch normalization, and bounded fallback text | ~140 |
| `src/App.tsx` | Render the mapper model with accessible current-room and exit branch components | ~110 |
| `src/App.css` | Add stable, responsive mapper board and exit branch styling | ~140 |
| `tests/msdp-map-display.test.ts` | Cover current room, directional exits, partial payloads, raw fallbacks, and state preservation | ~120 |
| `tests/fixtures/msdp/README.md` | Clarify room/exits fixture limits for mapper behavior if needed | ~20 |
| `tests/README.md` | Add targeted mapper test and responsive check notes if needed | ~20 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Mapper shows a highlighted current room when room identity is available.
- [ ] Mapper shows known directional exits in deterministic order.
- [ ] Mapper preserves raw and malformed exit fallback text without inventing destinations.
- [ ] `MINIMAP` still appears only as a configured live override and not as source-confirmed support.

### Testing Requirements
- [ ] Unit tests cover mapper model generation and existing availability states.
- [ ] Unit tests cover partial, unknown, raw, and malformed exit payloads.
- [ ] Manual desktop and narrow-sidebar checks are documented.

### Non-Functional Requirements
- [ ] Map rendering stays bounded and readable in the sidebar.
- [ ] Core UI has no horizontal page scroll at 390px and 360px smoke widths.
- [ ] Terminal and command input remain the primary workflow surface.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] `npm run test`, `npm run lint`, and `npm run build` pass or any failures are documented with cause.

---

## 8. Implementation Notes

### Key Considerations
- The source audit confirms room identity and exit variables, not a complete world-map schema.
- Existing helper tests already protect disabled, loading, empty, offline, and error states; do not collapse those states while adding mapper structure.
- Use the reference mapper only to understand behavior patterns such as current-room highlighting and neighbor placement.

### Potential Challenges
- Directional exits can arrive as strings, arrays, tables, and object-like rows: Preserve the existing room display normalization instead of adding a second parser.
- Long raw exit text can overwhelm the sidebar: Keep bounded summaries and overflow wrapping.
- Visual map rendering can become layout-sensitive: Use stable dimensions, grid constraints, and narrow-viewport checks.

### Relevant Considerations
- [P02] **`src/App.tsx` panel wiring**: Keep extraction behind tests so UI wiring does not become a second parser.
- [P02] **Shared display helpers**: Split helpers only at clear contract boundaries.
- [P01] **Terminal renderer path**: Preserve escaped MUD text rendering before renderer or formatting changes.
- [P02] **Bounded fallback text**: Keep malformed and oversized protocol summaries from overwhelming narrow sidebars.
- [P02] **Source-confirmed versus override-only data**: Keep `MINIMAP` explicit as override-only and separate from confirmed room/exits state.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Collapsing map availability states into a generic missing-data state.
- Treating synthetic fixture shapes as proof of live server schema.
- Creating a mapper layout that hides command input or overflows narrow screens.

---

## 9. Testing Strategy

### Unit Tests
- Extend `tests/msdp-map-display.test.ts` for current-room model generation.
- Assert deterministic exit ordering and labels for cardinal, diagonal, vertical, and raw exits.
- Assert state preservation for live override, disabled, loading, empty, offline, and error cases.

### Integration Tests
- Run the full existing Node test suite with `npm run test`.
- Run `npm run lint` and `npm run build` after implementation.

### Manual Testing
- Start the app and inspect the map panel with representative room/exits data if practical.
- Check desktop, 390px, and 360px layouts for no horizontal scrolling and no command input obstruction.
- Confirm `MINIMAP` override text still renders through the escaped MUD text path.

### Edge Cases
- `ROOM_EXITS` as a scalar raw string.
- `ROOM_EXITS` as an array of direction labels.
- `ROOM_EXITS` with unknown object fields.
- Missing room name but present area, vnum, or exits.
- Empty room and exits payloads while connected.

---

## 10. Dependencies

### External Libraries
- No new runtime libraries expected.
- Existing `ansi-to-html` path remains for escaped text rendering.

### Other Sessions
- **Depends on**: `phase02-session05-room-context-panel`, `phase02-session06-map-and-quest-fallback-strategy`
- **Depended by**: `phase03-session02-windows-and-layout-ergonomics`, `phase03-session04-mobile-and-pwa-foundation`

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
