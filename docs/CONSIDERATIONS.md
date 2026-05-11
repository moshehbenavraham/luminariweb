# Considerations

> Institutional memory for AI assistants. Updated between phases via carryforward.
> **Line budget**: 600 max | **Last updated**: Phase 04 (2026-05-11)

---

## Active Concerns

Items requiring attention in upcoming phases. Review before each session.

### Technical Debt

- [P03] **Shared helper surface**: `shared/msdp-*`, `shared/client-*`, and `shared/protocol-feature-status.ts` now carry most product logic. Keep future extraction behind tests so `src/App.tsx` stays orchestration only.
- [P03] **Layout and panel drift**: Terminal, inspector tabs, and responsive panel rules must stay aligned. Re-run desktop, 390px, and 360px checks when adding new surfaces.
- [P04] **Protocol claim synchronization**: `docs/source-protocol-backlog.md`, `docs/protocol-feature-checklist.md`, shared status data, and tests must move together when support claims change.

### External Dependencies

- [P01] **Proxy destination policy**: Public `/ws` routing still depends on external host behavior and DNS/IP classification. Keep allowlists, origin checks, and fail-closed defaults intact.
- [P01] **Renderer escaping invariant**: The terminal renderer still depends on escaping guarantees for browser HTML output. Preserve that invariant before any formatter or renderer swap.
- [P04] **Transport contract split**: The integrated `/ws` proxy remains the supported browser contract. Treat any future native source listener as a separate spec with its own validation gate.

### Performance / Security

- [P03] **Browser-local config boundary**: Layout preferences, aliases, triggers, and other client settings should remain secret-free localStorage data. Do not reintroduce cookies or store commands, hosts, transcripts, or tokens.
- [P03] **PWA cache scope**: Service-worker caching must stay limited to the static shell. Never cache `/api/`, `/ws`, settings payloads, or live protocol traffic.
- [P02] **Bounded fallback text**: Map, quest, room, combat, and protocol fallback text must stay explicit and short on narrow widths.
- [P04] **Privacy-safe protocol evidence**: Keep protocol audits, harnesses, and decision docs free of private hosts, transcripts, credentials, and live player data.

### Architecture

- [P03] **Source vs override boundaries**: Keep source-confirmed protocol data, local UI preferences, and override-only fields explicitly separated in code and docs.
- [P03] **Evidence-backed protocol inventory**: The protocol checklist is a maintainer aid, not proof of live support. Keep claims conservative and backed by tests or source data.
- [P02] **Synthetic fixtures are contracts**: Fixture updates should continue to mirror source verification so new panels do not drift into invented schema.
- [P04] **Native transport is not parity**: A source-native WebSocket path would need its own browser contract, auth, quotas, logging policy, and rollback path before it could replace the proxy.

---

## Lessons Learned

Proven patterns and anti-patterns. Reference during implementation.

### What Worked

- [P03] **Pure helper contracts**: Moving layout, automation, PWA, map, and protocol rules into shared helpers kept behavior deterministic and easy to test.
- [P03] **Typed storage validation**: Parsing browser storage through versioned contracts with defaults made corrupt or future payloads safe to ignore.
- [P03] **Full-parse-before-commit imports**: Validating the entire automation payload before state replacement prevented partial configuration corruption.
- [P03] **Terminal-first responsive refinement**: Narrow-width fixes worked best when they refined the existing layout instead of branching into a separate mobile shell.
- [P03] **Evidence-backed protocol docs**: A shared catalog kept UI labels, docs, and tests aligned without overstating support.
- [P03] **One policy source for ops**: Putting bridge and deployment guidance in a primary doc plus short runbooks reduced drift.
- [P04] **Decision docs plus status sync**: ADRs, protocol status records, and tests stayed coherent when transport decisions were recorded together.
- [P04] **Harnesses before runtime changes**: The source protocol harness created a safe baseline for later MSDP and transport decisions.
- [P02] **Explicit unavailable states**: Clear empty, offline, error, and fallback copy stayed more honest than generic missing-data messages.
- [P02] **Shared room/map normalization**: Reusing exit normalization avoided a second parser and kept fallback behavior aligned.

### What to Avoid

- [P03] **Cookies for client config**: Do not put browser settings, aliases, triggers, or other growing UI state back into cookies.
- [P03] **Overclaiming protocol support**: Unsupported or deferred features should stay marked as such until source-level support exists.
- [P03] **Bridge-by-default public routing**: Keep the integrated proxy as the default public path unless the policy is intentionally reworked.
- [P04] **Treating source scaffolding as runtime support**: Parser constants, docs, or TODO completion do not prove a browser-facing protocol path is production-ready.
- [P04] **Bundling transport decisions**: Keep MCCP, GMCP, and native WebSocket follow-ups separate so each can be validated and rolled back independently.
- [P02] **Broad parser rewrites without fixtures**: Do not expand parser scope without edge-case coverage and fallback expectations.
- [P02] **Narrow-width overflow regressions**: Mobile and compact layouts need explicit smoke checks before landing denser UI.

### Tool/Library Notes

- [P03] **`node --import tsx --test`**: Still the fastest path for focused TypeScript test runs in this repo.
- [P03] **`npm run lint` / `npm run build`**: These were sufficient quality gates alongside targeted browser smoke checks.
- [P03] **Browser smoke at 390px and 360px**: Those widths consistently surfaced overflow and focus issues early.
- [P04] **Source harness targets**: The focused parser harness is useful for protocol validation without needing live captures or private session data.

---

## Resolved

Recently closed items (buffer - rotates out after 2 phases).

| Phase | Item                                                                 | Resolution                                                                                                                                            |
| ----- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| P03   | Browser settings stored in cookies                                   | Moved browser settings, aliases, and triggers to versioned `localStorage` and clear legacy cookie groups only after a valid local payload is written. |
| P02   | `src/App.tsx` panel concentration                                    | Phase 02 extracted HUD, combat, group, inventory, room, map, and quest interpretation into shared helpers, leaving App as wiring and rendering glue.  |
| P01   | Availability states only covered the earlier renderer slice          | Phase 02 extended explicit unavailable handling across the new panel surface and kept fallback states visible instead of inferred.                    |
| P01   | Room and map fallback logic needed a shared contract                 | Phase 02 reused room normalization for map summary generation and kept `MINIMAP` override-only.                                                       |
| P00   | Source-confirmed data should stay distinct from override-only fields | Phase 02 reinforced the boundary across map and quest panels, with `MINIMAP` and `QUEST_INFO` still explicit override paths.                          |
| P04   | Protocol decision drift across docs and tests                        | Phase 04 synchronized backlog, checklist, shared status, and tests around MCCP, GMCP, and native WebSocket decisions.                                 |

_Auto-generated by carryforward. Manual edits allowed but may be overwritten._
