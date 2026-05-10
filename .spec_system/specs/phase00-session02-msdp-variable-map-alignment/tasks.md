# Task Checklist

**Session ID**: `phase00-session02-msdp-variable-map-alignment`
**Total Tasks**: 21
**Estimated Duration**: 3-4 hours
**Created**: 2026-05-10

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
| Implementation | 8 | 8 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **21** | **21** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0002] Verify Session 01 baseline, PRD source variable contract, and current mapping surfaces before edits (`.spec_system/specs/phase00-session02-msdp-variable-map-alignment/implementation-notes.md`)
- [x] T002 [S0002] [P] Create implementation notes scaffold with mapping-decision, command-result, and follow-up sections (`.spec_system/specs/phase00-session02-msdp-variable-map-alignment/implementation-notes.md`)
- [x] T003 [S0002] [P] Create security compliance notes scaffold covering settings persistence and protocol-mapping impact (`.spec_system/specs/phase00-session02-msdp-variable-map-alignment/security-compliance.md`)

---

## Foundation (6 tasks)

Core shared structures and mapping groundwork.

- [x] T004 [S0002] Define confirmed, optional, and override-only MSDP mapping groups from the PRD (`shared/mud.ts`)
- [x] T005 [S0002] Add or correct `MudState` fields for server metadata, room, room exits, actions, inventory, and demoted optional values with types matching declared contract and exhaustive enum handling (`shared/mud.ts`)
- [x] T006 [S0002] Update `defaultMsdpVariables` so confirmed fields are requested by default and unsupported or uncertain fields use empty override-only defaults (`shared/mud.ts`)
- [x] T007 [S0002] Update `normalizeMsdpVariableMap` to preserve saved overrides, normalize empty defaults, and tolerate malformed imported settings with schema-validated input and explicit error mapping (`shared/mud.ts`)
- [x] T008 [S0002] Ensure `MsdpVariableKey` and `MsdpVariableMap` remain backward-compatible for browser, server, and config import callers (`shared/mud.ts`)
- [x] T009 [S0002] Add mapper helper functions for scalar, structured, and list-like MSDP payloads without changing Telnet parser byte-state logic (`server/index.ts`)

---

## Implementation (8 tasks)

Main feature implementation.

- [x] T010 [S0002] Map confirmed server metadata variables such as `SERVER_ID`, `SERVER_TIME`, and `SNIPPET_VERSION` into `MudState` (`server/index.ts`)
- [x] T011 [S0002] Map confirmed room and world variables including `ROOM`, `AREA_NAME`, `ROOM_NAME`, `ROOM_VNUM`, `ROOM_EXITS`, and `WORLD_TIME` with types matching declared contract and exhaustive enum handling (`server/index.ts`)
- [x] T012 [S0002] Map `ACTIONS` and `INVENTORY` updates as structured client state without lossy scalar coercion (`server/index.ts`)
- [x] T013 [S0002] Verify default report/request flow filters empty override-only mappings and deduplicates configured variables before sending external MSDP requests (`server/index.ts`)
- [x] T014 [S0002] Update MSDP settings groups to expose source-aligned room/action/inventory fields and label override-only variables with platform-appropriate accessibility labels, focus management, and input support (`src/App.tsx`)
- [x] T015 [S0002] Update settings default, import, export, and runtime `msdp-config` paths for the revised map with schema-validated input and explicit error mapping (`src/App.tsx`)
- [x] T016 [S0002] Adjust minimal map fallback behavior to prefer room/exits data over guaranteed `MINIMAP` assumptions with explicit loading, empty, error, and offline states (`src/App.tsx`)
- [x] T017 [S0002] Update WebSocket state contract documentation examples for the source-aligned MSDP fields (`docs/api/http-and-websocket.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T018 [S0002] Run `npm run lint` and record pass/fail output with affected files (`.spec_system/specs/phase00-session02-msdp-variable-map-alignment/implementation-notes.md`)
- [x] T019 [S0002] Run `npm run build` and record pass/fail output with affected files (`.spec_system/specs/phase00-session02-msdp-variable-map-alignment/implementation-notes.md`)
- [x] T020 [S0002] Inspect normalized default MSDP variables to confirm unsupported defaults are not requested and confirmed room/action/inventory fields are present (`.spec_system/specs/phase00-session02-msdp-variable-map-alignment/implementation-notes.md`)
- [x] T021 [S0002] Validate ASCII, LF line endings, and scoped git diff for session artifacts and code changes (`.spec_system/specs/phase00-session02-msdp-variable-map-alignment/tasks.md`)

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
