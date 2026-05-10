# Session Specification

**Session ID**: `phase00-session03-unavailable-data-ux`
**Phase**: 00 - Align With Real Luminari Data
**Status**: Not Started
**Created**: 2026-05-10

---

## 1. Session Overview

This session makes the existing interface honest about server data that Luminari-Source does not currently emit or does not reliably populate. Session 02 aligned the default MSDP variable map so unsupported values are blank override-only slots. This session carries that source alignment into the player-facing UI so title, quests, saving throws, minimap, damage bonus, and other optional panel data no longer look like broken client rendering when the server simply has no current data source.

The work stays inside the current React app structure. `src/App.tsx` remains the main rendering and state-formatting surface, while `src/App.css` receives compact styling for quiet unavailable states that fit the current terminal-first layout. The session should not add broad panel features, free-form quest parsing, source-level protocol variables, a rich mapper, or a layout redesign.

The outcome should preserve playability when the terminal is the only live data surface. Players should be able to see which values are loading, empty, offline, unavailable without server support, or actually reported as zero, without losing command-input focus or cluttering the sidebar.

---

## 2. Objectives

1. Render unsupported or uncertain MSDP-backed UI values as deliberate unavailable states instead of ambiguous blanks.
2. Distinguish unavailable server data from zero, empty, loading, offline, and parse-failure states.
3. Label override-only or future-server-supported fields in the settings and panels without adding visual noise.
4. Keep terminal-first desktop and mobile play usable when optional panel data is absent.
5. Preserve existing ANSI escaping, MSDP settings compatibility, lint, and build behavior.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-baseline-verification-and-project-hygiene` - Provides baseline lint/build commands, project documentation, and current environment facts.
- [x] `phase00-session02-msdp-variable-map-alignment` - Provides source-aligned default MSDP mappings, override-only unsupported fields, and room-based map fallback data.

### Required Tools/Knowledge
- Luminari-Source protocol facts from `.spec_system/PRD/PRD.md`.
- UX empty-state guidance from `.spec_system/PRD/PRD_UX.md`.
- Existing UI rendering and formatting paths in `src/App.tsx`.
- Existing styling constraints and responsive rules in `src/App.css`.

### Environment Requirements
- Node.js and npm are available.
- Dependencies are installed from `package-lock.json`.
- `npm run lint` and `npm run build` are the quality gates for this session.
- No committed test runner exists yet; automated UI mapping tests remain deferred to Session 05.

---

## 4. Scope

### In Scope (MVP)
- Player can identify unsupported title data - Character heading and related copy avoid implying `TITLE` is guaranteed.
- Player can identify unsupported quest data - Quest panel explains that structured quest data is not emitted unless a user configures a real override.
- Player can identify unsupported saving throw data - Fortitude, Reflex, and Willpower render as future-server or override-only states instead of numeric blanks.
- Player can identify uncertain minimap data - Map panel distinguishes live `MINIMAP`, source-confirmed room/exits fallback, loading, offline, and unavailable map states.
- Player is not distracted by absent optional data - Optional panels use quiet, compact empty states that do not block terminal reading or command entry.
- Maintainer can inspect override-only field handling - Settings labels and notes clearly identify fields that require future server support or explicit overrides.

### Out of Scope (Deferred)
- Free-form quest text parsing - *Reason: PRD explicitly rejects brittle command-output quest parsing for first release.*
- Source-level variables for missing data - *Reason: Phase 04 owns server protocol changes.*
- Rich mapper behavior or pathfinding - *Reason: later room/map phases own expanded map features.*
- Broad redesign of layout, tabs, settings, or command workflow - *Reason: this session is an availability-state polish pass.*
- New automated UI test framework - *Reason: fixture and mapping test foundations are planned for Sessions 04 and 05.*

---

## 5. Technical Approach

### Architecture
Add a small unavailable-data layer near the existing display helpers in `src/App.tsx`. The layer should classify values by source support and current state, then render compact notices through reusable in-file components. It should use the existing `overrideOnlyMsdpVariableKeys`, `defaultMsdpVariables`, `clientSettings.msdp`, `mudState`, and `status` data instead of adding new global state.

Quest, character, saving throw, and map render paths should consult those helpers so each panel can say whether a value is unavailable because the server does not emit it, waiting because the player is connected and no payload has arrived, empty because the server reported an empty collection, offline because there is no active session, or present because the value exists. Zero and negative numeric values must remain valid displayed values.

Styling should extend the current compact panel language in `src/App.css`: muted text, restrained borders, no modal overlays, no terminal-covering notifications, and mobile-safe wrapping at 390px width. HTML rendering paths must continue to use `renderMudHtml()` with `escapeXML: true`.

### Design Patterns
- Source-aware display state: UI copy follows confirmed, optional, and override-only MSDP categories.
- Zero-safe formatting: Treat `0` as present data, not as missing data.
- Reusable compact notice: One local component handles unavailable, waiting, offline, and empty messages consistently.
- Settings transparency: Keep override-only fields configurable while making their support status explicit.
- Scoped styling: Add only the CSS needed for the new notices and mobile wrapping.

### Technology Stack
- TypeScript 6.0.x
- React 19
- Vite 8
- CSS
- `ansi-to-html` through the existing `renderMudHtml()` helper

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `.spec_system/specs/phase00-session03-unavailable-data-ux/implementation-notes.md` | Implementation log, UI state decisions, command results, and follow-up notes | ~140 |
| `.spec_system/specs/phase00-session03-unavailable-data-ux/security-compliance.md` | Session security/GDPR impact notes for UI rendering and local settings behavior | ~50 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `src/App.tsx` | Add source-aware unavailable-state helpers and update character, quest, saves, map, settings, and optional panel render paths | ~220 |
| `src/App.css` | Add compact unavailable-state styling and mobile-safe wrapping for changed panels | ~80 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Unsupported title data no longer makes the character heading look broken or misleading.
- [ ] Quest panel explicitly communicates that structured quest data is not emitted by the current server unless an override supplies it.
- [ ] Fortitude, Reflex, and Willpower distinguish future-server support from numeric `0`, blanks, and loading.
- [ ] Map panel distinguishes live minimap data, room/exits fallback, loading, offline, error, and unavailable states.
- [ ] Settings UI labels override-only fields as requiring explicit override or future server support.
- [ ] Optional panel empty states remain quiet and do not cover terminal output or steal command focus.

### Testing Requirements
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Manual desktop review confirms changed unavailable states render without visual clutter.
- [ ] Manual 390px viewport review confirms changed labels and notices wrap without horizontal page scrolling.

### Non-Functional Requirements
- [ ] Zero numeric values display as valid data when present.
- [ ] ANSI and Luminari color rendering continue through escaped `renderMudHtml()` paths.
- [ ] Browser-local settings remain secret-free and compatible with existing import/export behavior.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.

---

## 8. Implementation Notes

### Key Considerations
- The PRD is authoritative for which MSDP values are confirmed, unsupported, or uncertain.
- Session 02 already made unsupported values blank by default but configurable as override-only fields.
- The current app has existing empty messages for quests, group, affects, and map, but several messages still read like missing payloads rather than unsupported server features.
- `src/App.tsx` is large; keep helpers local and avoid extraction unless it materially reduces risk.
- This session should keep terminal and command-input behavior unchanged.

### Potential Challenges
- Unavailable states can become noisy: Keep copy short, contextual, and visually muted.
- Numeric `0` can be mistaken for missing data: Use explicit presence checks instead of truthiness checks.
- Existing quest rendering accepts structured overrides: Preserve that path while improving the no-data state.
- Mobile panels are tight: Add wrapping and stable dimensions where labels can grow.
- ANSI rendering is security-sensitive: Do not introduce new raw HTML paths.

### Relevant Considerations
- P00-TD1 **Default MSDP mapping mismatch**: Use Session 02's aligned map and make override-only fields visible as unavailable unless explicitly configured.
- P00-TD2 **Large `src/App.tsx` component**: Keep edits scoped to render helpers and existing panel sections.
- P00-TD4 **No committed test runner or fixtures**: Use lint/build plus manual visual checks for this UI-only pass.
- P00-EXT1 **`ansi-to-html` escape invariant**: Preserve `renderMudHtml()` for any ANSI-bearing text and avoid new `dangerouslySetInnerHTML` sources.
- P00-SEC2 **Cookie-based local settings**: Do not expand persistence or store sensitive data.
- P00-PERF1 **Terminal rendering performance**: Do not add work to terminal append paths.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- UI could treat real numeric `0` values as unavailable if helpers rely on truthiness.
- Quest, minimap, and title copy could imply server bugs rather than calmly describing current protocol support.
- Added notices could crowd the sidebar on mobile or pull focus away from command entry.

---

## 9. Testing Strategy

### Unit Tests
- No new unit tests are expected because no test runner is configured yet.
- Record candidate UI-state test cases for Session 05 in `implementation-notes.md`.

### Integration Tests
- Run `npm run lint`.
- Run `npm run build`.
- Confirm TypeScript catches helper and render path regressions.

### Manual Testing
- Review disconnected, connecting, connected-with-no-data, and error map states.
- Review character tab with no title or saves, with zero values, and with explicit override values.
- Review quest tab with no `questInfo`, empty structured values, and structured override values.
- Review 390px mobile width for settings labels, saving throw cells, quest empty state, and map panel.

### Edge Cases
- A reported value of `0` is displayed as data.
- Empty arrays and empty objects render as deliberate empty states, not unavailable server support.
- Blank override-only mapping values do not imply the field is being requested.
- User-provided overrides for `TITLE`, saves, `DAMAGE_BONUS`, `MINIMAP`, or `QUEST_INFO` still render if data arrives.
- Offline and reconnect states do not leave stale optional data copy that implies current live data.

---

## 10. Dependencies

### External Libraries
- None added in this session.

### Other Sessions
- **Depends on**: `phase00-session01-baseline-verification-and-project-hygiene`, `phase00-session02-msdp-variable-map-alignment`.
- **Depended by**: `phase00-session04-msdp-fixture-corpus`, `phase00-session05-state-mapping-tests`, and later game-panel work in Phase 02.

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
