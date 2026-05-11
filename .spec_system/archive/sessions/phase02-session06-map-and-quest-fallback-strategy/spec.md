# Session Specification

**Session ID**: `phase02-session06-map-and-quest-fallback-strategy`
**Phase**: 02 - Build Luminari Game Panels
**Status**: Complete
**Created**: 2026-05-11
**Completed**: 2026-05-11

---

## 1. Session Overview

This session completes Phase 02 by turning the room context foundation into a first usable map panel. The map must be useful with only source-confirmed `ROOM`, `ROOM_NAME`, `AREA_NAME`, `ROOM_VNUM`, `ROOM_EXITS`, and `WORLD_TIME` data, because audited Luminari-Source facts do not prove live `MINIMAP` population yet.

The session also makes the quest workflow explicit and honest. The client may preserve a structured quest override path for servers that emit `QUEST_INFO`, but first-release Luminari behavior must clearly state that structured quest data is unavailable until the server adds a real MSDP variable. Free-form quest command output parsing stays out of scope.

The implementation should continue the Phase 02 pattern of pure display helpers plus focused tests, keeping broad UI churn out of `src/App.tsx`. The result should be a tested map fallback, a clear quest unavailable state, and a Phase 04 follow-up note that records the smallest future source-level quest work.

---

## 2. Objectives

1. Build a tested map display model from reliable room identity and exit data.
2. Render a compact map panel that degrades through loading, empty, offline, error, and override-only `MINIMAP` states.
3. Keep quest UI unavailable by default while preserving structured `QUEST_INFO` override handling.
4. Record Phase 04 source-level quest MSDP follow-up requirements without adding server-side protocol work.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session05-room-context-panel` - provides normalized room identity, exit handling, and room panel display coverage.
- [x] `phase02-session04-affects-and-inventory-panels` - provides the Phase 02 collection-panel fallback pattern.
- [x] `phase01-session06-proxy-limits-deployment-safety` - provides current public proxy safety constraints and validation coverage.
- [x] `phase00-session05-state-mapping-tests` - provides MSDP fixture and mapping-test foundations.

### Required Tools/Knowledge
- React 19 function components and hooks.
- Shared TypeScript display helpers under `shared/`.
- Node test runner via `node --import tsx --test`.
- Source facts from `.spec_system/PRD/PRD.md` for `MINIMAP` and `QUEST_INFO`.

### Environment Requirements
- `npm test`, `npm run lint`, and `npm run build` available from the project root.
- No live MUD access required; fixture-backed and pure-helper tests are sufficient for the core behavior.
- Manual responsive smoke checks at desktop, 390px, and 360px widths for map and quest panels.

---

## 4. Scope

### In Scope (MVP)
- Player can see a first usable map panel from confirmed room and exit variables - use room identity, vnum, world time, and deterministic exit ordering.
- Player can distinguish live `MINIMAP` override output from the reliable room/exits fallback - show `MINIMAP` only when a configured override provides payload.
- Player sees explicit map loading, empty, disabled, offline, and error states - no generic "no data" copy.
- Player sees quest data as unavailable by default - explain that current Luminari-Source does not emit `QUEST_INFO`.
- Maintainer has a Phase 04 follow-up note for structured quest MSDP work - include payload shape questions and fixture needs.
- Maintainer can run focused map and quest display tests without live server access.

### Out of Scope (Deferred)
- Full mapper UX from reference clients - Reason: Phase 03 handles reference-client mapper evolution after this minimal fallback exists.
- Source-level quest variable implementation - Reason: Phase 04 owns Luminari-Source protocol changes.
- Free-form quest command output scraping - Reason: master PRD rejects brittle prose parsing for first release.
- GMCP or native WebSocket protocol changes - Reason: current session is frontend display and fallback strategy only.
- Persisted map layout preferences - Reason: cookie-based settings remain an open security finding.

---

## 5. Technical Approach

### Architecture

Create small shared display helpers for map and quest fallback decisions, following the existing Phase 02 helper pattern. `shared/msdp-map-display.ts` should consume `MudState`, `ConnectionStatus`, and `MsdpVariableMap`, then return a render-ready model for reliable room fallback, override-provided live minimap text, and unavailable states. It can reuse room normalization from `shared/msdp-room-display.ts` rather than inventing a second exit parser.

Create `shared/msdp-quest-display.ts` for quest availability and structured override behavior. `src/App.tsx` should import these helpers and render the models through focused local components, while keeping terminal focus behavior and existing `QuestInfoPanel` structured renderer intact.

### Design Patterns
- Pure display model helpers: Keep state interpretation outside React where it can be tested.
- Protocol-aware empty states: Distinguish unsupported, disabled, waiting, empty, offline, and error cases.
- Override-only optional data: Treat `MINIMAP` and `QUEST_INFO` as explicit server overrides, not default Luminari requirements.
- Fixture-backed tests: Use synthetic room/exits data and existing fixtures rather than live MUD access.

### Technology Stack
- TypeScript 6.0
- React 19
- Vite 8
- Node built-in test runner with `tsx`
- CSS responsive layout

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `shared/msdp-map-display.ts` | Pure map display model from room/exits fallback and override-only minimap data | ~220 |
| `shared/msdp-quest-display.ts` | Pure quest fallback model for unavailable and structured override states | ~150 |
| `tests/msdp-map-display.test.ts` | Focused coverage for map states, exit ordering, raw fallback, and override-only minimap | ~170 |
| `tests/msdp-quest-display.test.ts` | Focused coverage for quest unavailable, disabled, loading, empty, and structured override states | ~130 |
| `.spec_system/specs/phase02-session06-map-and-quest-fallback-strategy/phase04-quest-msdp-follow-up.md` | Phase 04 source-level quest MSDP follow-up note | ~80 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `src/App.tsx` | Replace inline map output logic with shared model, add map panel renderer, and wire quest fallback model | ~140 |
| `src/App.css` | Add stable map and quest fallback layout styles with mobile-safe wrapping | ~150 |
| `shared/README_shared.md` | Document new map and quest display helpers | ~15 |
| `tests/README.md` | Add map and quest fallback test and manual smoke notes | ~25 |
| `.spec_system/specs/phase02-session06-map-and-quest-fallback-strategy/implementation-notes.md` | Record implementation decisions, validation output, and live `MINIMAP` evidence status | ~80 |

---

## 7. Success Criteria

### Functional Requirements
- [x] Map panel renders a useful room/exits fallback when room data is present and live `MINIMAP` is absent.
- [x] Live `MINIMAP` text appears only when `MINIMAP` is configured and a payload arrives.
- [x] Map states distinguish loading, empty, disabled, offline, error, fallback, and live override cases.
- [x] Quest panel clearly states structured quest data is unavailable by default.
- [x] Structured quest override payloads still render without free-form quest command parsing.
- [x] Phase 04 quest follow-up note records the preferred source-level `QUEST_INFO` path and fixture needs.

### Testing Requirements
- [x] Unit tests written and passing for map display helper states.
- [x] Unit tests written and passing for quest fallback helper states.
- [x] `npm test` passes.
- [x] `npm run lint` passes.
- [x] `npm run build` passes.
- [x] Manual desktop, 390px, and 360px smoke checks are documented.

### Non-Functional Requirements
- [x] UI remains terminal-first and does not steal command input focus when switching map or quest views.
- [x] Map and quest panels fit at 390px and smoke-check at 360px without horizontal page scrolling.
- [x] Protocol copy names missing variables and explains support status.
- [x] No sensitive or large new map/quest preferences are added to cookie persistence.

### Quality Gates
- [x] All files ASCII-encoded.
- [x] Unix LF line endings.
- [x] Code follows project conventions.
- [x] No GPL reference code copied.

---

## 8. Implementation Notes

### Key Considerations
- `MINIMAP` is declared in Luminari-Source but live population is unconfirmed, so room/exits fallback is the supported default.
- `QUEST_INFO` is not in the audited source variable table, so quest UI must be unavailable unless explicitly overridden.
- `src/App.tsx` already has inline map and quest display logic; extract behavior conservatively without a broad sidebar rewrite.
- Reuse `normalizeRoomExits` and room display availability patterns where practical.

### Potential Challenges
- Existing map output is embedded in `src/App.tsx`: mitigate by extracting a pure helper first, then swapping the UI call site.
- Exit payloads can be strings, arrays, tables, object-like rows, or raw malformed scalars: mitigate by relying on the Session 05 room normalization.
- Quest override rendering can accidentally imply first-party support: mitigate with copy that labels default Luminari behavior separately from override payloads.
- Mobile map output can force horizontal scrolling: mitigate with stable panel dimensions, wrapping around summaries, and bounded preformatted text.

### Relevant Considerations
- [P01] **`src/App.tsx` concentration**: Keep the extraction narrow and avoid unrelated command-shell, renderer, or settings refactors.
- [P01] **Fixture-backed tests worked**: Use deterministic helper tests and existing synthetic room fixtures rather than live MUD access.
- [P01] **Renderer fallback remains in service**: Preserve escaped `renderMudHtml` paths for any map or structured quest text.
- [P00-SEC-002] **Browser settings are stored in cookies**: Do not add larger or sensitive persisted map/quest preferences in this session.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Map panel shows a misleading blank or live-minimap state when only reliable room/exits fallback exists.
- Quest panel implies broken client behavior instead of missing server support.
- Interactive sidebar changes steal command focus or create mobile horizontal overflow.

---

## 9. Testing Strategy

### Unit Tests
- Test `buildMapDisplayModel` for fallback, live override, loading, empty, disabled, offline, and error states.
- Test deterministic exit ordering and raw fallback handling through map display output.
- Test `buildQuestDisplayModel` for unsupported default, configured waiting, empty, structured present, offline, and error states.

### Integration Tests
- Run the full Node test suite with `npm test`.
- Run `npm run lint` and `npm run build` after UI wiring.

### Manual Testing
- Open the app at desktop width, 390px, and 360px.
- Verify the map panel displays fallback room/exits copy without horizontal page scrolling.
- Verify the quest tab explains `QUEST_INFO` unavailability by default.
- Verify switching Room, Quests, and other tabs returns focus to the command input.

### Edge Cases
- Empty `ROOM` and empty `ROOM_EXITS` payloads.
- `ROOM_EXITS` as string, array, table, object-like rows, or malformed scalar text.
- `MINIMAP` configured but no payload arrived.
- `QUEST_INFO` configured but missing, empty, structured, or scalar override payload.
- Offline, disconnected, connecting, and connection error statuses.

---

## 10. Dependencies

### External Libraries
- None added.

### Other Sessions
- **Depends on**: `phase02-session05-room-context-panel`
- **Depended by**: Phase 03 mapper reference work and Phase 04 structured quest protocol work.

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
