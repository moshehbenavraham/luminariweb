# Session Specification

**Session ID**: `phase03-session04-mobile-and-pwa-foundation`
**Phase**: 03 - Borrow the Best Ideas
**Status**: Not Started
**Created**: 2026-05-11

---

## 1. Session Overview

This session makes Luminari Web more reliable and comfortable on narrow mobile screens while preserving the normal browser client as the primary product. The current app already has responsive breakpoints for the terminal, HUD, inspector, map, and automation surfaces, but mobile play still needs a deliberate pass over command input ergonomics, status visibility, online/offline messaging, safe-area behavior, and no-horizontal-scroll guarantees at 390px and 360px widths.

The session borrows behavior-level lessons from `EXAMPLES/lociterm`: mobile-first terminal access, installable-browser metadata, touch-friendly controls, network status visibility, and local browser settings. The implementation must remain original, must not copy LGPL/GPL reference code or styling, and must stay aligned with the Luminari-specific React/Node architecture rather than becoming a generic terminal clone.

The PWA work is intentionally foundational. Add app metadata and service-worker basics only where they improve installability and shell reliability without pretending to support offline gameplay. WebSocket play remains online-only, `/api/settings` and `/ws` must not be cached, and browsers that do not expose install prompts should still run the normal web client cleanly.

---

## 2. Objectives

1. Record behavior-only mobile and PWA lessons from `EXAMPLES/lociterm` without importing reference code or license obligations.
2. Improve command input, terminal reading, HUD, inspector, and panel ergonomics at 390px and 360px widths.
3. Add explicit online, offline, reconnect, and PWA capability messaging that does not block normal WebSocket play.
4. Add safe PWA metadata and service-worker foundation where practical, then document browser limits and validation results.

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session01-core-hud-and-character-panel` - Provides the core terminal, command input, and HUD workflow that mobile must preserve.
- [x] `phase02-session05-room-context-panel` - Provides room and panel display behavior that must remain readable on narrow screens.
- [x] `phase02-session06-map-and-quest-fallback-strategy` - Provides bounded fallback text patterns for panel content on small widths.
- [x] `phase03-session02-windows-and-layout-ergonomics` - Provides current layout, inspector, density, and focus behavior that mobile changes must respect.
- [x] `phase03-session03-alias-macro-and-trigger-ux` - Provides current automation menu and local persistence behavior that mobile/PWA changes must not regress.

### Required Tools/Knowledge
- Current responsive CSS and app layout in `src/App.css` and `src/App.tsx`.
- Current service shell in `index.html`, `src/main.tsx`, and `public/`.
- `EXAMPLES/lociterm` as behavior-only reference input for mobile/PWA affordances.
- Browser PWA concepts: manifest, secure-context requirements, service-worker scope, online/offline events, and install limitations.
- React 19, TypeScript, Vite public assets, CSS safe-area insets, and Node test runner conventions.

### Environment Requirements
- Dependencies installed from the current lockfile.
- Local quality commands available: `npm run test`, `npm run lint`, and `npm run build`.
- A local dev or preview server for manual responsive checks.
- Browser dev tools or Playwright-style viewport checks for desktop, 390px, and 360px widths.

---

## 4. Scope

### In Scope (MVP)
- Player can use connect, terminal, command input, HUD, and primary inspector workflows at 390px width - Tighten mobile layout, safe-area spacing, and text wrapping without hiding the command path.
- Player can smoke-test the app at 360px width without horizontal page scrolling - Add or adjust responsive constraints for known overflow surfaces.
- Player can understand reconnect, offline, online, and proxy status on mobile - Add status messaging that distinguishes browser network state from MUD/WebSocket connection state.
- Player can use mobile command controls without losing focus or sending duplicate commands - Improve touch-sized command controls and history affordances only where they fit the current UI.
- Browser can expose installable metadata where practical - Add manifest metadata, mobile theme hints, and static icon references without requiring binary asset churn.
- Service worker can provide a safe application-shell foundation - Cache only same-origin static shell assets, avoid `/api/settings` and `/ws`, fail open to network, and never cache player commands or session data.
- Maintainer can verify mobile/PWA behavior - Add focused helper tests, docs, and manual 390px/360px validation notes.

### Out of Scope (Deferred)
- Offline gameplay or offline command queueing - *Reason: MUD play requires a live WebSocket-to-Telnet connection.*
- Push notifications, background sync, or native app packaging - *Reason: installability basics come first.*
- Replacing browser WebSocket behavior or adding reconnect persistence across server-side sessions - *Reason: proxy lifecycle remains online and session-scoped.*
- Full xterm.js migration or terminal renderer swap - *Reason: renderer migration has a separate ADR and spike path.*
- Cloud profiles, account-linked settings, or cross-device sync - *Reason: first release remains browser-local only.*
- Copying LGPL/GPL reference implementation code or styling - *Reason: reference projects are behavior-only inputs.*

---

## 5. Technical Approach

### Architecture

Keep the app as a single React/Vite client with static public assets. Add a small shared helper for PWA and network capability decisions so user-facing status text, install limitations, and service-worker eligibility can be tested outside React. `src/App.tsx` should own the live online/offline event wiring and status rendering, with cleanup for all event listeners and no new persistence of secrets or command text.

PWA assets should stay minimal: `index.html` links to a manifest and advertises mobile theme/viewport hints, `public/manifest.webmanifest` describes the app shell, and `public/service-worker.js` handles only safe same-origin static asset caching. The service worker must bypass `/api/`, `/ws`, non-GET requests, cross-origin requests, and WebSocket upgrades, then fall back to network rather than breaking play.

Responsive improvements should be implemented in the existing `src/App.css` breakpoints and current React structure. Prioritize stable dimensions, safe-area padding, wrapped text, reachable controls, and command input visibility. Avoid broad layout rewrites and avoid turning the mobile view into a separate app.

### Design Patterns
- Progressive enhancement: PWA and service-worker registration improve capable browsers without blocking unsupported browsers.
- Explicit network-state model: Browser offline, proxy disconnected, MUD disconnected, and reconnecting states remain distinct.
- Cache allowlist: Service-worker behavior is conservative, static-only, and excludes dynamic protocol traffic.
- Mobile constraint checks: Treat 390px as the main mobile target and 360px as a smoke target for overflow risks.
- Behavior-only reference use: Study `lociterm` affordances but keep code, CSS, copy, and assets original.

### Technology Stack
- React 19.2.5 for status UI, command controls, and event wiring.
- TypeScript 6.0.2 for shared capability helpers and app integration.
- Vite static public assets for manifest and service worker.
- CSS for safe-area spacing, narrow-width layout, and touch target tuning.
- Node test runner with `tsx` for helper tests.
- No new runtime dependencies expected.

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `shared/pwa-support.ts` | Testable PWA, online/offline, installability, and service-worker cache eligibility helpers | ~170 |
| `tests/pwa-support.test.ts` | Unit tests for status messages, capability decisions, cache allowlist, and excluded dynamic routes | ~150 |
| `public/manifest.webmanifest` | App metadata, display mode, theme color, start URL, scope, and static icon references | ~45 |
| `public/service-worker.js` | Conservative static shell cache with network fallback and dynamic route bypasses | ~120 |
| `docs/mobile-pwa.md` | Mobile/PWA behavior notes, browser limits, service-worker policy, and smoke-test procedure | ~140 |
| `.spec_system/specs/phase03-session04-mobile-and-pwa-foundation/implementation-notes.md` | Reference notes, implementation evidence, manual checks, and handoff notes | ~90 |
| `.spec_system/specs/phase03-session04-mobile-and-pwa-foundation/security-compliance.md` | Service-worker cache privacy notes, no-secret persistence posture, and reference license notes | ~70 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `index.html` | Add manifest link, mobile theme metadata, viewport-fit support, and app description metadata | ~10 |
| `src/main.tsx` | Register service worker with guarded capability checks and failure handling | ~45 |
| `src/App.tsx` | Add online/offline event state, mobile status/reconnect messaging, touch-friendly command affordances, and focus-safe controls | ~180 |
| `src/App.css` | Tune mobile layout, safe-area spacing, terminal height, HUD wrapping, inspector tabs, and command dock behavior | ~220 |
| `tests/README.md` | Add mobile/PWA helper test commands and manual desktop/390px/360px smoke checks | ~45 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Connect, disconnect, reconnect, command input, terminal output, and core HUD remain usable at 390px width.
- [ ] 360px smoke checks show no horizontal page scrolling in the terminal, HUD, inspector, automation menu, map, room, group, affects, inventory, and quest surfaces.
- [ ] Browser online/offline state is visible without being confused with proxy or MUD connection state.
- [ ] Reconnect messaging is clear and reachable on mobile.
- [ ] Manifest metadata is linked and valid enough for capable browsers to recognize the app shell.
- [ ] Service-worker registration succeeds or fails gracefully, and dynamic `/api/settings` and `/ws` traffic is never cached.
- [ ] Browser play works normally where install prompts or service workers are unavailable.

### Testing Requirements
- [ ] Unit tests cover PWA status messages, service-worker eligibility, cache allowlist decisions, and dynamic route exclusions.
- [ ] Manual testing covers desktop, 390px, and 360px widths.
- [ ] Manual testing covers online/offline toggling, reconnect messaging, normal command send, command history controls, and service-worker registration behavior.

### Non-Functional Requirements
- [ ] No passwords, player commands, terminal transcripts, host secrets, WebSocket messages, or `/api/settings` responses are cached or persisted by PWA work.
- [ ] Command input remains keyboard reachable and touch targets are usable on narrow screens.
- [ ] Color-coded network states also expose readable text labels.
- [ ] No new runtime dependencies are introduced.
- [ ] No LGPL/GPL reference code, CSS, or assets are copied.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.
- [ ] `npm run test`, `npm run lint`, and `npm run build` pass or any failures are documented with cause.

---

## 8. Implementation Notes

### Key Considerations
- `src/App.css` already contains 390px and 360px breakpoints. This session should refine those constraints instead of introducing a parallel mobile layout.
- `src/App.tsx` already preserves command-input focus across terminal and inspector interactions. Mobile controls must not steal focus unnecessarily or send duplicate commands.
- `src/main.tsx` currently only mounts React. Service-worker registration should be opt-in by capability and fail without breaking startup.
- `index.html` currently lacks manifest and PWA metadata. Add only metadata that is true for the current app.
- `public/favicon.svg` and `public/icons.svg` can be reused or extended as static references, but binary icon generation is not required unless local tooling makes it low risk.

### Potential Challenges
- Service-worker caching can stale dynamic settings: Bypass `/api/`, `/ws`, non-GET, cross-origin, and upgrade requests.
- Browser offline state can be misleading: Label it as browser network state, not proof that the MUD route is available.
- Mobile keyboard viewport changes can hide the command input: Use safe-area spacing and stable command dock sizing rather than viewport-width font scaling.
- Installability differs by browser and origin: Document secure-context and browser-specific limitations instead of promising a universal install prompt.
- Narrow panel content can overflow: Apply bounded wrapping and scroll behavior to long room, map, group, affects, inventory, quest, automation, and protocol text.

### Relevant Considerations
- [P02] **`src/App.tsx` panel wiring**: Keep mobile status and command affordances focused so App does not become a second protocol parser.
- [P02] **Shared display helpers**: Add a small PWA helper only for a clear, testable contract; do not split display helpers without need.
- [P01] **Terminal renderer path**: Preserve escaped MUD text rendering and avoid raw HTML paths while changing mobile terminal layout.
- [P02] **Browser settings cookies**: Do not expand browser persistence; verify mobile/PWA work does not store secrets or command data.
- [P02] **Bounded fallback text**: Keep malformed or oversized panel content wrapped or locally scrollable on narrow widths.
- [P02] **Manual responsive checks**: Continue desktop, 390px, and 360px checks for every UI surface touched.

### Behavioral Quality Focus
Checklist active: Yes
Top behavioral risks for this session:
- Mobile layout regressions hiding the command input or causing horizontal page scroll.
- Offline or reconnect messaging implying the game can be played without a live connection.
- Service-worker caching accidentally storing dynamic settings, command traffic, or stale app state.

---

## 9. Testing Strategy

### Unit Tests
- Add `tests/pwa-support.test.ts` for online/offline status labels, reconnect status decisions, service-worker support decisions, static asset cache eligibility, and exclusions for `/api/settings`, `/ws`, non-GET, cross-origin, and upgrade requests.

### Integration Tests
- Run the focused PWA helper tests.
- Run the full Node test suite with `npm run test`.
- Run `npm run lint` and `npm run build` after implementation.

### Manual Testing
- At desktop width, verify connect/disconnect, terminal output, HUD, inspector, and command input still match the current workflow.
- At 390px width, verify connect, reconnect messaging, online/offline state, terminal reading, command send, command history controls, HUD bars, inspector tabs, map, room, group, affects, inventory, quest, and automation menu behavior.
- At 360px width, verify no horizontal page scrolling and no overlapping text or controls.
- Toggle browser offline/online state and verify status messaging updates without crashing the app.
- Verify service-worker registration in a supported browser and confirm `/api/settings` and WebSocket traffic are not cached.
- Verify unsupported install/service-worker contexts keep normal browser play functional.

### Edge Cases
- Browser starts offline before `/api/settings` loads.
- Browser goes offline while WebSocket status is `connected`.
- Browser returns online while WebSocket status is `error` or `disconnected`.
- Service-worker registration throws or is unavailable.
- Existing service-worker cache contains an older app shell.
- Narrow viewport plus on-screen keyboard reduces usable height.
- Long host names, status details, room names, item names, affects, and raw fallback text appear at 360px.
- Touch users tap history or reconnect controls repeatedly while a send or connect action is in flight.

---

## 10. Dependencies

### External Libraries
- No new runtime libraries expected.
- Existing React, TypeScript, Vite, CSS, and Node test runner tooling are sufficient.

### Other Sessions
- **Depends on**: `phase03-session02-windows-and-layout-ergonomics`, `phase03-session03-alias-macro-and-trigger-ux`, Phase 02 panel sessions.
- **Depended by**: `phase03-session05-bridge-deployment-options`, `phase03-session06-protocol-feature-checklist`, and Phase 04 source-level protocol work.

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
