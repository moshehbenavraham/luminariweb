# Task Checklist

**Session ID**: `phase04-session01-luminari-source-protocol-todo-audit`
**Total Tasks**: 18
**Estimated Duration**: 2-4 hours
**Created**: 2026-05-11

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0401]` = Session reference (04=phase number, 01=session number)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 6 | 6 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **18** | **18** | **0** |

---

## Setup (3 tasks)

Initial audit preparation and evidence inventory.

- [x] T001 [S0401] Verify Luminari-Source checkout readability and record inspected commit or working-tree status (`/home/aiwithapex/projects/Luminari-Source`)
- [x] T002 [S0401] [P] Inventory Luminari Web Phase 04 inputs and protocol handoff docs (`.spec_system/PRD/phase_04/PRD_phase_04.md`)
- [x] T003 [S0401] [P] Inventory maintainer protocol status and claim boundaries (`docs/protocol-feature-checklist.md`)

---

## Foundation (5 tasks)

Source and documentation audit passes.

- [x] T004 [S0401] [P] Audit source protocol TODO and security backlog items (`/home/aiwithapex/projects/Luminari-Source/docs/project-management-zusuk/PROTOCOL_TODO.md`)
- [x] T005 [S0401] [P] Audit source protocol tables, negotiation flags, and MSDP/GMCP/MCCP helpers (`/home/aiwithapex/projects/Luminari-Source/src/protocol.c`)
- [x] T006 [S0401] [P] Audit protocol enums, structs, and public helper declarations (`/home/aiwithapex/projects/Luminari-Source/src/protocol.h`)
- [x] T007 [S0401] [P] Audit MSDP emission paths for room, combat, character, group, affects, inventory, and minimap-relevant variables (`/home/aiwithapex/projects/Luminari-Source/src/comm.c`)
- [x] T008 [S0401] [P] Compare source protocol documentation with code-level findings (`/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md`)

---

## Implementation (6 tasks)

Ranked backlog and maintainer documentation.

- [x] T009 [S0401] Draft backlog structure with accepted, deferred, rejected, and webclient-only sections (`docs/source-protocol-backlog.md`)
- [x] T010 [S0401] Rank parser and security TODOs by player value, implementation risk, and validation approach (`docs/source-protocol-backlog.md`)
- [x] T011 [S0401] Rank missing MSDP candidates with payload contract needs and older-server fallback expectations (`docs/source-protocol-backlog.md`)
- [x] T012 [S0401] Rank MCCP, GMCP, MXP, MSP, MSSP, CHARSET, TTYPE, NAWS, and native WebSocket follow-ups without changing support claims (`docs/source-protocol-backlog.md`)
- [x] T013 [S0401] Map accepted candidates to Session 02, Session 03, Session 04, Session 05, or future-phase follow-up work (`docs/source-protocol-backlog.md`)
- [x] T014 [S0401] Link the source protocol backlog from the maintainer protocol checklist and preserve unsupported feature boundaries (`docs/protocol-feature-checklist.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T015 [S0401] Review Markdown links and source references for local readability (`docs/source-protocol-backlog.md`)
- [x] T016 [S0401] Run applicable quality gates or document why code gates are not required for documentation-only changes (`.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md`)
- [x] T017 [S0401] Validate ASCII encoding and LF line endings for new and modified session files (`.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/tasks.md`)
- [x] T018 [S0401] Record implementation notes, commands, decisions, and remaining follow-ups (`.spec_system/specs/phase04-session01-luminari-source-protocol-todo-audit/implementation-notes.md`)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests or documented quality checks complete
- [x] All files ASCII-encoded
- [x] `implementation-notes.md` updated
- [x] Ready for the validate workflow step

---

## Next Steps

Run the validate workflow step to verify session completeness.
