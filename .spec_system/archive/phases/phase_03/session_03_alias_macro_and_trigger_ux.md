# Session 03: Alias, Macro, and Trigger UX

**Session ID**: `phase03-session03-alias-macro-and-trigger-ux`
**Status**: Not Started
**Estimated Tasks**: ~12-25
**Estimated Duration**: 2-4 hours

---

## Objective

Make aliases, macros, and triggers easier and safer to manage with explicit validation, feedback, and persistence behavior.

---

## Scope

### In Scope (MVP)

- Review the existing alias, trigger, command-history, import, and export implementation.
- Add validation and actionable error feedback for malformed automation entries.
- Add preview or test affordances where they fit the current UI.
- Add enable and disable controls for aliases, macros, or triggers as appropriate.
- Enforce visible recursion and trigger-loop limits.
- Improve persistence behavior and avoid expanding cookie storage.
- Add tests for validation, import normalization, and recursion limits where practical.

### Out of Scope

- Cloud profiles or account-linked automation.
- Parsing free-form MUD output for quest or mapper automation.
- A full scripting language.
- Storing passwords, secrets, or server credentials.

---

## Prerequisites

- [ ] Existing alias and trigger behavior has been reviewed.
- [ ] Open finding `P00-SEC-002` is considered during persistence changes.
- [ ] Import/export formats preserve user data on partial failures.

---

## Deliverables

1. Safer automation management UI and validation behavior.
2. Recursion and trigger-loop protection with user-visible feedback.
3. Persistence improvements that do not increase cookie-storage risk.
4. Focused tests or validation notes for core automation flows.

---

## Success Criteria

- [ ] Users can safely create, test or preview, disable, import, and export automation.
- [ ] Recursive expansion limits are enforced and visible.
- [ ] Malformed imports do not overwrite valid existing user data.
- [ ] Automation failures do not break the connection.
- [ ] Persistence changes keep browser-local data secret-free and avoid sending larger settings on requests.
