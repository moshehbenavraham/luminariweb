# PRD Phase 03: Borrow the Best Ideas

**Status**: In Progress
**Sessions**: 6
**Estimated Duration**: 6-10 days

**Progress**: 5/6 sessions (83%)

---

## Overview

Phase 03 adds high-value mapper, layout, automation, mobile, deployment, and protocol-inventory ideas from the shortlisted reference projects while preserving the current React/Node architecture and license boundaries. The phase should improve player ergonomics without weakening the terminal-first workflow or treating deferred server protocol support as available.

---

## Progress Tracker

| Session | Name                                | Status      | Est. Tasks | Validated |
|---------|-------------------------------------|-------------|------------|-----------|
| 01      | Mapper UX Reference Implementation  | Complete    | ~12-25     | 2026-05-11 |
| 02      | Windows and Layout Ergonomics       | Complete    | ~12-25     | 2026-05-11 |
| 03      | Alias, Macro, and Trigger UX        | Complete    | ~12-25     | 2026-05-11 |
| 04      | Mobile and PWA Foundation           | Complete    | ~12-25     | 2026-05-11 |
| 05      | Bridge Deployment Options           | Complete    | ~12-25     | 2026-05-11 |
| 06      | Protocol Feature Checklist          | Not Started | ~12-25     | -         |

---

## Completed Sessions

1. Session 01: Mapper UX Reference Implementation - complete on 2026-05-11
2. Session 02: Windows and Layout Ergonomics - complete on 2026-05-11
3. Session 03: Alias, Macro, and Trigger UX - complete on 2026-05-11
4. Session 04: Mobile and PWA Foundation - complete on 2026-05-11
5. Session 05: Bridge Deployment Options - complete on 2026-05-11

---

## Upcoming Sessions

- Session 06: Protocol Feature Checklist

---

## Objectives

1. Improve gameplay ergonomics with a better mapper, denser panel layout, and safer automation management.
2. Make the mobile and installable-browser workflows practical without blocking normal browser play.
3. Document production bridge choices and protocol support boundaries before Phase 04 source-level work.

---

## Prerequisites

- Phase 02 completed.
- Reference repositories under `EXAMPLES/` are available for behavior study only.
- GPL and LGPL reference code is not copied unless the project makes a later explicit licensing decision.
- Open cookie-storage security finding is accounted for before expanding automation persistence.

---

## Technical Considerations

### Architecture

Keep the single React/Node TypeScript project structure. Prefer shared display and protocol helper contracts for any mapper, automation, and protocol-status logic that needs tests. UI-heavy work must preserve command input access, terminal reading, and explicit unavailable states.

### Technologies

- React 19, TypeScript, Vite, and CSS for browser UI.
- Node.js, Express, and `ws` for proxy and runtime settings behavior.
- Browser local storage or IndexedDB for secret-free local persistence improvements.
- Web app manifest and service worker basics only where they improve installability without hurting normal browser play.
- Node test runner, lint, build, and responsive browser checks for validation.

### Risks

- License contamination: Document reference behavior as inspiration and implement original code only.
- UI regression: Check desktop, 390px, and 360px layouts for command input, terminal, HUD, and panels.
- Automation loops: Enforce recursion and trigger-loop limits with visible feedback.
- Persistence privacy: Do not expand cookie storage; move settings, aliases, and triggers to browser-local storage before adding larger data.
- Protocol overcommitment: Keep MCCP, GMCP, MXP, MSP, and native WebSocket work documented unless tests and source facts justify implementation.

### Relevant Considerations

- [P02] **`src/App.tsx` panel wiring**: Keep extraction behind tests so UI wiring does not become a second parser.
- [P02] **Shared display helpers**: Split helpers only at clear contract boundaries.
- [P01] **Terminal renderer path**: Preserve escaped MUD text rendering before renderer or formatting changes.
- [P01] **Public proxy destination policy**: Keep allowlists and fail-closed destination checks intact as deployment options expand.
- [P02] **Browser settings cookies**: Move settings, aliases, and triggers to localStorage or IndexedDB before storing larger or more sensitive data.
- [P02] **Bounded fallback text**: Keep malformed and oversized protocol summaries from overwhelming narrow sidebars.
- [P02] **Source-confirmed versus override-only data**: Keep future additions explicit about server-emitted state versus local overrides.

---

## Success Criteria

Phase complete when:

- [ ] All 6 sessions completed.
- [ ] Mapper and panel-layout improvements remain useful with confirmed room and exit data only.
- [ ] Automation UX has validation, preview or feedback, disable controls, and loop protection.
- [ ] Local persistence no longer expands the open cookie-storage risk.
- [ ] Mobile command, terminal, HUD, and panel workflows pass 390px and 360px smoke checks.
- [ ] Deployment and protocol-support documents clearly define supported, rejected, partial, and deferred behavior.

---

## Dependencies

### Depends On

- Phase 02: Build Luminari Game Panels.

### Enables

- Phase 04: Source-Level Protocol Path.
