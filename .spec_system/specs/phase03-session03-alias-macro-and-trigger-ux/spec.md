# Session Specification

**Session ID**: `phase03-session03-alias-macro-and-trigger-ux`
**Phase**: 03 - Borrow the Best Ideas
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session makes the existing aliases, trigger actions, and command-sequence macros safer to manage during normal play. The current app already supports aliases, triggers, command history, import/export, and enable/disable toggles, but most validation and loop feedback is implicit, and automation data still persists through chunked cookies.

The goal is to keep the terminal-first workflow intact while adding clear validation, local preview/test affordances, visible recursion and trigger-loop limits, and secret-free browser-local persistence. "Macros" in this session means command sequences entered through alias expansions or trigger actions, not a new scripting language.

This session also addresses the open cookie-storage concern for settings, aliases, and triggers by moving current local configuration persistence to `localStorage` with safe legacy cookie migration. Import and export must remain tolerant, preserve current user data on partial failures, and never store or export passwords, commands logs, host secrets, or live transcripts.

---

## 2. Objectives

1. Extract and test alias, trigger, macro-sequence, and import normalization rules outside React.
2. Add inline validation, preview/test behavior, and visible loop-limit feedback for automation entries.
3. Move settings, aliases, and triggers from chunked cookies to secret-free `localStorage` with legacy cookie migration and fallback behavior.
4. Preserve command input focus, terminal readability, responsive layout, and import/export safety while automation menus are open.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session01-core-hud-and-character-panel` - Provides the terminal/HUD wiring that automation must not disrupt.
- [x] `phase02-session05-room-context-panel` - Provides focus-sensitive panel behavior and responsive sidebar expectations.
- [x] `phase02-session06-map-and-quest-fallback-strategy` - Provides bounded fallback text patterns to preserve in automation feedback.
- [x] `phase03-session01-mapper-ux-reference-implementation` - Establishes Phase 03 behavior-only reference discipline.
- [x] `phase03-session02-windows-and-layout-ergonomics` - Provides the current inspector and layout preference persistence model.

### Required Tools/Knowledge
- Current alias, trigger, command-history, import/export, and cookie persistence logic in `src/App.tsx`.
- Existing `localStorage` layout preference pattern in `shared/client-layout-preferences.ts`.
- Open security finding `P00-SEC-002` in `.spec_system/SECURITY-COMPLIANCE.md`.
- React 19, TypeScript, CSS, and Node test runner conventions.

### Environment Requirements
- Dependencies installed from the current lockfile.
- Local quality commands available: `npm run test`, `npm run lint`, and `npm run build`.
- Browser capable of `localStorage`; denied or unavailable storage must fall back without breaking startup.

---

## 4. Scope

### In Scope (MVP)
- Player can create and edit aliases, trigger actions, and command-sequence macros with inline validation - Add per-entry validation state and actionable errors for missing fields, invalid wildcard/capture usage, and unsafe empty command sequences.
- Player can preview alias and trigger behavior without sending commands to the MUD - Add local test inputs that show expanded commands or trigger actions without touching the WebSocket.
- Player can see when recursion or trigger-loop limits prevent automation execution - Return structured reports from the automation engine and surface notices without breaking the connection.
- Player can enable, disable, delete, import, and export automation safely - Preserve existing controls, add confirmation where destructive, and keep current data unchanged on malformed imports.
- Browser can persist settings, aliases, and triggers without sending them on HTTP or WebSocket requests - Use versioned `localStorage` payloads, migrate legacy chunked cookies once, and clear migrated cookie groups.
- Maintainer can verify automation behavior with focused tests - Cover validation, import normalization, alias recursion, trigger command limits, and local persistence parsing.

### Out of Scope (Deferred)
- Cloud profiles, account-linked automation, or shared settings - *Reason: first release remains browser-local only.*
- A full scripting language, timers, conditional scripts, or JavaScript execution - *Reason: this session treats macros as command sequences only.*
- Free-form MUD output parsing for quest or mapper automation - *Reason: structured protocol support remains the source of truth.*
- Storing passwords, secrets, raw command logs, or terminal transcripts - *Reason: privacy and security constraints forbid it.*
- Copying trigger or macro code from GPL reference clients - *Reason: reference projects remain behavior-only inputs.*
- Mobile bottom-sheet or PWA install work - *Reason: Session 04 owns mobile and PWA foundation.*

---

## 5. Technical Approach

### Architecture

Create shared, side-effect-free automation helpers that own alias and trigger normalization, validation, wildcard/capture matching, command-sequence splitting, alias expansion reports, and trigger consumption reports. `src/App.tsx` should import these helpers instead of keeping another set of automation parser rules inside React.

Create a small shared local-config persistence helper for versioned settings, aliases, and triggers. The app should load from `localStorage` first, migrate valid legacy cookie values once when present, clear migrated cookie groups, and fall back to defaults if storage is unavailable, denied, corrupt, or from an unsupported future version.

UI changes stay inside the existing automation menu surface. Add inline errors, preview/test controls, bounded result summaries, loop-limit notices, and delete confirmation without blocking terminal output or command input recovery. Import/export should parse and validate the full payload before replacing any current state.

### Design Patterns
- Pure automation engine: Keep matching, validation, expansion, and trigger loop limits testable outside React.
- Versioned local persistence: Normalize every stored payload and treat corrupt or unavailable storage as non-fatal.
- Full-parse-before-commit import: Never partially overwrite current aliases, triggers, or settings.
- Bounded feedback: Limit preview, error, and loop summaries so narrow menus cannot be overwhelmed.
- Behavior-only reference use: Study reference clients for affordance ideas without copying source or styles.

### Technology Stack
- React 19.2.5 for automation menu UI and focus recovery.
- TypeScript 6.0.2 for shared automation and persistence contracts.
- Node test runner with `tsx` for pure helper tests.
- CSS for inline validation, preview results, confirmation rows, and responsive automation menus.
- No new runtime dependencies expected.

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `shared/client-automation.ts` | Alias, trigger, macro-sequence types, validation, preview, expansion, and trigger consumption helpers | ~280 |
| `shared/client-config-persistence.ts` | Versioned local settings/automation payload parsing, serialization, and legacy cookie migration helpers | ~180 |
| `tests/client-automation.test.ts` | Unit tests for validation, wildcard captures, command splitting, previews, recursion reports, and trigger caps | ~240 |
| `tests/client-config-persistence.test.ts` | Unit tests for local config parsing, malformed payloads, future versions, import normalization, and migration inputs | ~180 |
| `.spec_system/specs/phase03-session03-alias-macro-and-trigger-ux/implementation-notes.md` | Reference notes, implementation evidence, manual checks, and handoff notes | ~90 |
| `.spec_system/specs/phase03-session03-alias-macro-and-trigger-ux/security-compliance.md` | P00-SEC-002 remediation notes, privacy posture, storage behavior, and license notes | ~65 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `src/App.tsx` | Replace inline automation/parser/persistence logic with shared helpers, localStorage migration, validation state, previews, loop notices, and safe import/export | ~260 |
| `src/App.css` | Add validation, preview, confirmation, loop notice, and narrow-width automation menu styling | ~120 |
| `tests/README.md` | Document focused automation tests and manual automation smoke checks | ~35 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Aliases and triggers validate missing fields, malformed wildcard/capture use, and empty command sequences before use.
- [ ] Alias preview and trigger preview show resulting commands without sending anything to the MUD.
- [ ] Alias recursion and trigger command limits are enforced and surfaced to the user.
- [ ] Import failures preserve the current settings, aliases, and triggers.
- [ ] Settings, aliases, and triggers persist in `localStorage`, not chunked cookies, after migration.
- [ ] Automation failures do not close the WebSocket, interrupt terminal rendering, or break command input.

### Testing Requirements
- [ ] Unit tests cover validation, wildcard captures, command splitting, recursion limits, trigger caps, and import normalization.
- [ ] Unit tests cover local config persistence defaults, corrupt payloads, future versions, and migration inputs.
- [ ] Manual testing covers create, edit, preview, disable, delete, import, export, and storage migration.

### Non-Functional Requirements
- [ ] No passwords, secrets, terminal transcripts, or raw command logs are persisted or exported.
- [ ] Automation preview and error text remains bounded and wraps at desktop, 390px, and 360px widths.
- [ ] No new runtime dependencies are introduced.
- [ ] No GPL reference code or styling is copied.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] `npm run test`, `npm run lint`, and `npm run build` pass or any failures are documented with cause.

---

## 8. Implementation Notes

### Key Considerations
- `src/App.tsx` currently contains alias and trigger types, matching helpers, import parsing, cookie persistence, and UI wiring. Extract pure logic first, then wire UI behavior against the shared contract.
- `P00-SEC-002` is open because chunked cookies send local settings, aliases, and triggers on requests. This session should avoid writing those cookies and should clear migrated cookie groups after localStorage has a valid copy.
- Trigger actions currently dispatch through the same command path as player input. Keep trigger-generated commands out of command history and cap generated command counts before dispatch.
- Command sequences are split by newline or semicolon today. Preserve that model unless validation exposes a safer, documented normalization.

### Potential Challenges
- Migration can accidentally erase current data: Parse and persist a full local payload before clearing any legacy cookie group.
- Recursion reports can be noisy: Surface one bounded notice per attempted command batch, not one notice per nested alias.
- Trigger previews can look like command sends: Keep preview controls visually distinct and ensure they do not touch the WebSocket.
- Shared helper extraction can drift from UI labels: Use the same validation result fields for inline errors, import errors, and tests.

### Relevant Considerations
- [P02] **`src/App.tsx` panel wiring**: Extract automation logic behind tests so UI wiring does not become a second parser.
- [P02] **Shared display helpers**: Split helpers only at clear contract boundaries; automation parsing is a clear contract boundary for this session.
- [P01] **Terminal renderer path**: Preserve escaped MUD text rendering and do not add raw HTML preview paths.
- [P02] **Browser settings cookies**: Move settings, aliases, and triggers to `localStorage` before storing anything larger or more sensitive.
- [P02] **Bounded fallback text**: Keep malformed import and preview summaries bounded in narrow menu surfaces.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Invalid automation silently sending unintended commands.
- Recursive aliases or chatty triggers generating unbounded command bursts.
- Storage migration or malformed imports overwriting valid user configuration.

---

## 9. Testing Strategy

### Unit Tests
- Add `tests/client-automation.test.ts` for alias validation, trigger validation, literal matches, wildcard matches, capture substitution, command splitting, disabled entries, recursion limit reports, and trigger command caps.
- Add `tests/client-config-persistence.test.ts` for default local config payloads, valid saved payloads, malformed JSON, unsupported versions, legacy alias/trigger/settings migration inputs, and import full-parse-before-commit behavior.

### Integration Tests
- Run targeted tests for automation and config persistence.
- Run the full Node test suite with `npm run test`.
- Run `npm run lint` and `npm run build` after implementation.

### Manual Testing
- Create valid and invalid aliases, preview them, send a valid alias, and verify command history behavior remains correct.
- Create valid and invalid triggers, preview them against sample terminal lines, and verify real trigger actions do not pollute command history.
- Verify recursion and trigger-loop notices appear without disconnecting or freezing the UI.
- Import malformed alias, trigger, and full config files and verify existing settings remain unchanged.
- Export config and confirm no password, command log, transcript, or host secret data is included.
- Simulate legacy cookies, load the app, verify localStorage persistence, and verify migrated cookies are cleared only after a valid local payload exists.
- Check desktop, 390px, and 360px widths for wrapped errors, preview output, reachable controls, and command input focus recovery.

### Edge Cases
- Empty alias pattern or expansion.
- Empty trigger pattern or action.
- Wildcard pattern with more capture placeholders than captures.
- Alias expansion that recursively matches itself.
- Trigger line that matches many enabled triggers.
- Trigger action that expands through aliases into many commands.
- `localStorage` throws on read or write.
- Legacy cookie payload is corrupt or only partially chunked.
- Import file contains valid aliases but malformed triggers.

---

## 10. Dependencies

### External Libraries
- No new runtime libraries expected.
- Existing React, TypeScript, Vite, and Node test runner tooling are sufficient.

### Other Sessions
- **Depends on**: `phase03-session02-windows-and-layout-ergonomics`, `phase03-session01-mapper-ux-reference-implementation`, Phase 02 panel sessions.
- **Depended by**: `phase03-session04-mobile-and-pwa-foundation`, `phase03-session06-protocol-feature-checklist`.

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
