# Considerations

> Institutional memory for AI assistants. Updated between phases via carryforward.
> **Line budget**: 600 max | **Last updated**: Phase 00 (2026-05-10)

---

## Active Concerns

Items requiring attention in upcoming phases. Review before each session.

### Technical Debt <!-- Max 5 items -->

- P00-TD1: `shared/mud.ts` default MSDP mapping still requests unconfirmed variables (`TITLE`, `FORTITUDE`, `REFLEX`, `WILLPOWER`, `MINIMAP`, `QUEST_INFO`) and does not yet request/map confirmed room/action/inventory fields. Phase 00 should align defaults and mapping with audited Luminari-Source facts.
- P00-TD2: `src/App.tsx` is a large single component file that owns rendering, WebSocket lifecycle, aliases, triggers, imports, cookies, and many formatters. Extract only after behavior is covered, because protocol/UI coupling is currently implicit.
- P00-TD3: `server/index.ts` combines Express routes, WebSocket session handling, Telnet parser, MSDP parser, and state mapping. Parser and mapping tests should come before major extraction.
- P00-TD4: No committed test runner or fixtures exist yet. Parser, proxy lifecycle, and MSDP mapping changes currently rely on lint/build plus manual checks.

### External Dependencies <!-- Max 5 items -->

- P00-EXT1: `ansi-to-html` is the current renderer. All `dangerouslySetInnerHTML` paths rely on `escapeXML: true`; preserve that invariant until any xterm.js migration is proven.
- P00-EXT2: Reference repositories under `EXAMPLES/` include GPL/LGPL projects. Use them for behavior and acceptance ideas only unless license strategy changes.
- P00-EXT3: Live compatibility depends on external MUD hosts and Luminari-Source protocol behavior. Prefer fixtures over live access for repeatable tests.

### Performance / Security <!-- Max 5 items -->

- P00-SEC1: The proxy accepts arbitrary host/port input after basic syntax and range validation. Public deployment needs allowlists, origin checks, reserved-IP blocking, quotas, and rate limits.
- P00-SEC2: Client settings, aliases, and triggers are stored in browser cookies with `SameSite=Lax` and `path=/`, so they are sent with HTTP/WebSocket requests. Migrate to localStorage or IndexedDB before settings grow or include sensitive data.
- P00-SEC3: Trigger and alias automation has a recursion limit, but command send rate is not limited. Add client/proxy safeguards before public deployment.
- P00-PERF1: Terminal output is capped at 500 chunks, but rendering still joins HTML chunks into one `dangerouslySetInnerHTML` payload. Watch performance under high-output MUD bursts.

### Architecture <!-- Max 5 items -->

- P00-ARCH1: The repository is a single TypeScript app, not a monorepo. Keep shared client/server contracts in `shared/`.
- P00-ARCH2: Runtime configuration comes from `shared/app-settings.ts` and `/api/settings`; preset or branding changes should not require rebuilding the frontend once the server restarts.
- P00-ARCH3: NAWS currently sends fixed `120x40` dimensions from the proxy. Browser-measured resize support is planned for Phase 01.
- P00-ARCH4: There is no database or account system. First-release persistence is browser-local only.

---

## Lessons Learned

Proven patterns and anti-patterns. Reference during implementation.

### What Worked <!-- Max 15 items -->

- `normalizeMsdpVariableMap` gives one shared fallback path for browser and proxy MSDP settings.
- Import parsing uses tolerant normalization and clear user-facing errors for aliases, triggers, and full config files.
- `renderMudHtml` and the streaming terminal converter both set `escapeXML: true`, making current HTML rendering safer despite `dangerouslySetInnerHTML`.
- The proxy sends partial `MudState` updates, which keeps browser state merging simple.
- Lint and build currently pass and are the only automated quality gates.
- `npm audit --omit=dev` reported 0 production dependency vulnerabilities on 2026-05-10.

### What to Avoid <!-- Max 10 items -->

- Do not treat unsupported MSDP fields as reliable server data just because the current UI has slots for them.
- Do not copy GPL reference code into this Unlicense project.
- Do not log raw player commands or imported automation content.
- Do not add broad parser rewrites without fixtures for split IAC, doubled IAC, tables, arrays, malformed payloads, and reconnect cleanup.
- Do not add accounts, cloud sync, or server-side settings storage without a separate auth/privacy design.
- Do not change terminal HTML rendering paths without preserving XML escaping or replacing the renderer entirely.

### Tool/Library Notes <!-- Max 5 items -->

- `npm run lint` and `npm run build` passed on 2026-05-10 after the documentation audit.
- `npm audit --omit=dev --audit-level=moderate` passed on 2026-05-10 with 0 vulnerabilities.
- Vite development proxies `/api/settings` and `/ws` to the Node server port from `shared/app-settings.ts`.
- `ansi-to-html` is used both for streaming terminal output and one-shot Luminari color rendering.

---

## Resolved

Recently closed items (buffer - rotates out after 2 phases).

| Phase | Item                        | Resolution                                                                                                                  |
| ----- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 00    | Initial documentation audit | Root and standard project docs were created or refreshed; remaining docs gaps are captured in `.spec_system/docs-audit.md`. |

_Auto-generated by initspec. Updated by carryforward between phases._
