# Session 03: Unavailable Data UX

**Session ID**: `phase00-session03-unavailable-data-ux`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Make missing server data clear to players without making the UI feel broken.

---

## Scope

### In Scope (MVP)

- Add empty or unavailable states for title, quests, saves, minimap, damage bonus, and other uncertain values.
- Label values that require future server support.
- Avoid visual noise when optional data is absent.
- Keep the terminal-first experience usable without full panel data.

### Out of Scope

- Free-form quest text parsing.
- Source-level variables for missing data.
- Rich mapper behavior.
- Broad redesign of the app layout.

---

## Prerequisites

- [ ] Session 02 variable alignment behavior is available or planned.
- [ ] Current UI panels that display optional data have been identified.
- [ ] Existing small-screen behavior has been checked for obvious layout risk.

---

## Deliverables

1. Deliberate unavailable states for unsupported or uncertain data.
2. Updated labels or copy for future server-supported values.
3. Quiet empty-state behavior for optional panels.
4. Basic desktop and mobile visual checks for changed UI.

---

## Success Criteria

- [ ] Missing optional MSDP data renders as a deliberate empty state.
- [ ] The UI distinguishes unavailable data from zero, blank, or loading states.
- [ ] No panel depends on unconfirmed data to render successfully.
- [ ] Terminal-first play remains usable when optional panel data is absent.
