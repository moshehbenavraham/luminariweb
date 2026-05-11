# Session Specification

**Session ID**: `phase00-session02-msdp-variable-map-alignment`
**Phase**: 00 - Align With Real Luminari Data
**Status**: Not Started
**Created**: 2026-05-10

---

## 1. Session Overview

This session aligns the client-side MSDP request map and server-side state mapping with the Luminari-Source variables captured in the master PRD. The current default map still requests unsupported values such as `TITLE`, `FORTITUDE`, `REFLEX`, `WILLPOWER`, `MINIMAP`, and `QUEST_INFO`, while it does not request several confirmed room, action, and inventory values that later panels need.

The session keeps the existing React and Node architecture intact. The shared contract in `shared/mud.ts` remains the source for browser settings, WebSocket messages, and client-visible `MudState`; `server/index.ts` remains responsible for translating parsed MSDP variables into partial state updates; and `src/App.tsx` remains responsible for settings normalization, import/export compatibility, and the MSDP variable settings UI.

This work enables Session 03 to render deliberate unavailable-data states, Session 04 to build fixtures around the source-aligned contract, and Session 05 to add focused state-mapping tests. It should not rewrite the Telnet parser, add source-level protocol changes, or build full panels for inventory, actions, room, or map behavior.

---

## 2. Objectives

1. Update the shared MSDP variable map so default requests prioritize confirmed Luminari-Source variables.
2. Add or correct client-visible state fields for confirmed room, action, and inventory data.
3. Demote unsupported or uncertain variables from default requests while preserving user-configurable override slots.
4. Map incoming confirmed MSDP variables into `MudState` with safe, tolerant type handling.
5. Keep saved settings, imported settings, lint, and build behavior compatible after the contract changes.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-baseline-verification-and-project-hygiene` - Provides passing lint/build baseline, documented local commands, and current environment facts.

### Required Tools/Knowledge
- Luminari-Source MSDP variable list from `.spec_system/PRD/PRD.md`.
- Existing shared contract in `shared/mud.ts`.
- Existing proxy mapping path in `server/index.ts`.
- Existing settings and MSDP variable UI in `src/App.tsx`.

### Environment Requirements
- Node.js and npm are available.
- Dependencies are installed from `package-lock.json`.
- `npm run lint` and `npm run build` are the quality gates for this session.
- No committed test runner exists yet; state-mapping tests are deferred to Session 05.

---

## 4. Scope

### In Scope (MVP)
- Player can connect with source-aligned default MSDP requests - Default configured variables include confirmed room, action, inventory, and core state variables needed by the current client.
- Maintainer can preserve custom overrides - Existing saved or imported mappings still normalize into `MsdpVariableMap` without dropping user-entered values.
- Client can receive confirmed room and world values - `ROOM`, `AREA_NAME`, `ROOM_NAME`, `ROOM_VNUM`, `ROOM_EXITS`, and `WORLD_TIME` map into `MudState`.
- Client can receive action and inventory values - `ACTIONS` and `INVENTORY` map into `MudState` without assuming a single payload shape.
- Unsupported assumptions are demoted - `TITLE`, `QUEST_INFO`, `FORTITUDE`, `REFLEX`, `WILLPOWER`, uncertain `MINIMAP`, and uncertain `DAMAGE_BONUS` are not requested by default unless a user override explicitly configures them.
- Settings remain compatible - The MSDP settings UI, config import, config export, and runtime `msdp-config` message path continue to work with the revised map.

### Out of Scope (Deferred)
- Source-level Luminari-Source protocol changes - *Reason: Phase 04 owns source-level protocol work.*
- Quest command-output parsing - *Reason: PRD decision rejects brittle free-form quest parsing for first release.*
- Full room, map, inventory, action, affects, or group panel implementation - *Reason: Phase 02 owns richer game panels.*
- Broad Telnet parser rewrites - *Reason: parser hardening and fixture coverage belong to later sessions.*
- New automated state-mapping test framework - *Reason: Session 05 owns mapping tests after fixtures and aligned behavior are available.*

---

## 5. Technical Approach

### Architecture
Update the shared MSDP contract first, then update the server mapper and frontend settings surfaces that consume it. `shared/mud.ts` should expose a complete `MsdpVariableMap` key set for current and planned client-visible fields, with confirmed defaults for values the client should request and empty defaults for unsupported or uncertain override-only slots.

`server/index.ts` should continue to send only configured variables returned by `getConfiguredMsdpVariables()`. Empty optional mappings must be filtered out so unsupported values are not requested by default. Incoming MSDP variables should be resolved through the configured map and converted to the narrowest safe `MudState` shape when possible; structured or uncertain payloads should remain `MudValue` rather than being coerced destructively.

`src/App.tsx` should update the MSDP variable settings groups so source-aligned fields are visible and override-only fields are not presented as guaranteed server data. Settings import/export should continue using `normalizeMsdpVariableMap()` so old saved settings retain user overrides while new defaults stop asking for unsupported variables.

### Design Patterns
- Shared contract first: Keep browser, server, and settings normalization aligned through `shared/mud.ts`.
- Override-only demotion: Preserve configurable keys, but use empty defaults for values the server does not reliably emit.
- Tolerant parsing boundary: Keep unknown or structured MSDP payloads as `MudValue` unless a field has a clear scalar contract.
- Minimal UI adjustment: Update settings and fallback text only enough to stop guaranteed-data assumptions; defer broader unavailable-state UX to Session 03.
- No parser rewrite: Keep Telnet/MSDP parser mechanics unchanged unless a small mapper helper is needed.

### Technology Stack
- TypeScript 6.0.x
- React 19
- Vite 8
- Express 5
- `ws` 8
- Node `net`

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `.spec_system/specs/phase00-session02-msdp-variable-map-alignment/implementation-notes.md` | Implementation log, command results, mapping decisions, and follow-up notes | ~150 |
| `.spec_system/specs/phase00-session02-msdp-variable-map-alignment/security-compliance.md` | Session security/GDPR impact notes for mapping and settings behavior | ~60 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `shared/mud.ts` | Align `MudState`, default MSDP mappings, and normalization behavior | ~100 |
| `server/index.ts` | Map confirmed variables and filter demoted defaults from request/report flows | ~90 |
| `src/App.tsx` | Update MSDP settings groups, settings compatibility, and minimal map fallback behavior | ~90 |
| `docs/api/http-and-websocket.md` | Document the source-aligned state contract examples if message examples need updating | ~25 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Default configured MSDP requests include confirmed room/action/inventory variables needed by this phase.
- [ ] Default configured MSDP requests do not include unsupported or uncertain variables unless a user override supplies them.
- [ ] Incoming `ROOM`, `AREA_NAME`, `ROOM_NAME`, `ROOM_VNUM`, `ROOM_EXITS`, `WORLD_TIME`, `ACTIONS`, and `INVENTORY` values map into `MudState`.
- [ ] Saved settings and imported config files continue to normalize without dropping user-entered MSDP overrides.
- [ ] The MSDP variable settings UI exposes source-aligned fields and does not present unsupported fields as guaranteed data.

### Testing Requirements
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Focused static inspection confirms default configured variables exclude unsupported defaults and include new confirmed fields.
- [ ] Manual review confirms no broad parser, panel, or source-level protocol work was added.

### Non-Functional Requirements
- [ ] The mapping path remains tolerant of unknown MSDP variables and malformed custom settings.
- [ ] Structured MSDP payloads are not coerced into lossy scalar types.
- [ ] Settings persistence continues to avoid passwords or secrets.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.

---

## 8. Implementation Notes

### Key Considerations
- The PRD is the planning source of truth for which variables are confirmed, unsupported, or uncertain for this phase.
- The local Luminari-Source docs show `INVENTORY` as an array, `ACTIONS` as a table, and room values as a mix of table, string, and number payloads.
- `getConfiguredMsdpVariables()` already deduplicates and filters blank values; preserve that behavior when changing defaults.
- Session 03 owns player-facing unavailable-data polish, so this session should avoid broad copy and layout changes.
- Session 05 owns automated state-mapping tests after fixtures are available.

### Potential Challenges
- Old settings may contain now-demoted variable names: Preserve explicit user overrides while new defaults stop requesting those names.
- `ROOM_EXITS` shape differs across docs and source comments: Store a tolerant structured value or normalize only when shape is clear.
- `src/App.tsx` is large: Keep changes local to constants, settings normalization, and minimal fallback helpers.
- Parser changes can introduce protocol regressions: Do not change Telnet byte-state logic in this session.

### Relevant Considerations
- P00-TD1 **Default MSDP mapping mismatch**: This is the primary target; align defaults and add missing confirmed fields.
- P00-TD2 **Large `src/App.tsx` component**: Avoid extraction while touching settings UI.
- P00-TD3 **Combined `server/index.ts` responsibilities**: Add mapper cases without broad parser or server refactors.
- P00-TD4 **No committed test runner or fixtures**: Use lint/build and focused inspection now; leave mapping tests for Session 05.
- P00-EXT1 **`ansi-to-html` escape invariant**: Do not alter terminal HTML rendering paths.
- P00-SEC2 **Cookie-based local settings**: Do not migrate persistence here; keep settings secret-free and document any impact.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Saved/imported MSDP settings could accidentally re-enable unsupported default requests instead of preserving only explicit overrides.
- Structured payloads such as `ROOM`, `ROOM_EXITS`, `ACTIONS`, and `INVENTORY` could be coerced into lossy or misleading UI state.
- Runtime `msdp-config` updates could send duplicate or empty report requests while the player is connected.

---

## 9. Testing Strategy

### Unit Tests
- No new unit tests are expected because a test runner is not configured yet. Record candidate test cases for Session 05 in `implementation-notes.md`.

### Integration Tests
- Run `npm run lint`.
- Run `npm run build`.
- Inspect the configured default MSDP variables after normalization to confirm request behavior.

### Manual Testing
- Review the MSDP settings UI source paths for all new keys.
- Review config import/export normalization for backward compatibility.
- Review server mapping cases for structured payload preservation.

### Edge Cases
- Empty optional mapping values are filtered out and not sent to the MUD.
- Old saved settings containing `TITLE`, `QUEST_INFO`, saves, `MINIMAP`, or `DAMAGE_BONUS` are preserved as explicit overrides.
- Unknown MSDP variables resolve to no state update.
- Structured `ROOM_EXITS`, `ACTIONS`, and `INVENTORY` values remain usable when represented as arrays, tables, or strings.

---

## 10. Dependencies

### External Libraries
- None added in this session.

### Other Sessions
- **Depends on**: `phase00-session01-baseline-verification-and-project-hygiene`.
- **Depended by**: `phase00-session03-unavailable-data-ux`, `phase00-session04-msdp-fixture-corpus`, and `phase00-session05-state-mapping-tests`.

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
