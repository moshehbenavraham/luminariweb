# Security & Compliance

> Cumulative security posture and GDPR compliance record. Updated between phases via carryforward.
> **Line budget**: 1000 max | **Last updated**: Phase 04 (2026-05-11)

---

## Current Security Posture

### Overall: CLEAN

| Metric           | Value |
| ---------------- | ----- |
| Open Findings    | 0     |
| Critical/High    | 0     |
| Medium/Low       | 0     |
| Phases Audited   | 5     |
| Last Clean Phase | P04   |

---

## Open Findings

None.

---

## Resolved Findings

Recently closed issues are retained here for phase history and regression awareness.

| Finding                                                       | Severity | Resolution                                                                                                                                                            | Closed |
| ------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| P00-SEC-002 Browser settings are stored in cookies            | Medium   | Phase 03 moved browser settings, aliases, and triggers to versioned `localStorage`, and legacy cookie groups are cleared only after a valid local payload is written. | P03    |
| P00-SEC-001 Public proxy can target arbitrary hosts and ports | High     | Phase 01 added destination allowlists, origin checks, DNS/IP classification, banned service ports, and connect/idle timeouts before socket creation.                  | P01    |
| P00-SEC-003 Command/input rate limiting implemented locally   | Medium   | HTTP requests are rate limited per IP, browser command input is throttled per WebSocket session, and concurrent WebSocket connections are capped per IP.              | P00    |
| P00-SEC-004 HTML rendering depends on escaping invariants     | Low      | Phase 01 preserved escaped HTML rendering in shared helpers and added renderer coverage before any xterm opt-in path was exposed.                                     | P01    |
| P00-SEC-005 No automated security regression tests            | Low      | Phase 01 added parser, lifecycle, resize, policy, and renderer tests, plus passing lint/build/test coverage.                                                          | P01    |

---

## GDPR Compliance Status

### Overall: LOW RISK / LOCAL-ONLY

### Personal Data Inventory

No account system, database, analytics, payment flow, or server-side profile storage exists in this repository.

Browser-local data currently includes:

- Client display settings
- Layout preferences
- MSDP variable mappings
- Aliases
- Triggers
- Protocol inspector tab state
- Imported and exported local configuration files

Phase 04 added no new browser-local personal-data categories.

Potentially sensitive operational data:

- Player command text passes through the proxy to the selected MUD but is not intentionally logged by current code.
- MUD host and port are sent to the proxy during connection.

### Compliance Checklist

| Requirement                            | Status  | Notes                                                                                                       |
| -------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| Data collection has documented purpose | Partial | Browser-local settings support gameplay preferences; no server-side account data exists.                    |
| Consent obtained before data storage   | Partial | Settings are saved through app controls, but there is no explicit storage notice.                           |
| Data minimization verified             | Pass    | No secrets are required, and client settings now stay in browser-local storage instead of cookies.          |
| Deletion/erasure path exists           | Partial | Users can clear browser storage through normal browser controls; no in-app clear-all control is documented. |
| No PII in application logs             | Pass    | Current code logs startup and settings-load errors, not command text.                                       |
| Third-party transfers documented       | Partial | Commands and connection data are sent to selected MUD hosts; production policy is documented and enforced.  |

## Dependency Security

`npm audit --omit=dev --audit-level=moderate` reported 0 production dependency vulnerabilities after the phase 01 xterm spike and proxy hardening.

Top-level runtime dependencies observed:

- `@xterm/addon-fit`
- `@xterm/xterm`
- `ansi-to-html`
- `express`
- `react`
- `react-dom`
- `ws`

Development dependencies include Vite, TypeScript, ESLint, React plugin packages, `tsx`, and `concurrently`.

## Phase History

| Phase | Sessions     | Security                                                                                       | GDPR                         | Findings Opened | Findings Closed |
| ----- | ------------ | ---------------------------------------------------------------------------------------------- | ---------------------------- | --------------- | --------------- |
| 00    | 5/5 complete | Initial code scan                                                                              | Local-only baseline          | 4               | 1               |
| 01    | 6/6 complete | Proxy safety hardened and renderer coverage expanded                                           | Local-only baseline retained | 0               | 4               |
| 02    | 6/6 complete | Panel expansion remained client-side; no new findings introduced                               | Local-only baseline retained | 0               | 0               |
| 03    | 6/6 complete | Browser-local settings moved off cookies; protocol inventory and deployment posture documented | Local-only baseline retained | 0               | 1               |
| 04    | 5/5 complete | Protocol claim boundaries, parser harnesses, and native transport decisions were clarified    | Local-only baseline retained | 0               | 0               |

## Recommendations

1. Keep browser settings, aliases, triggers, and layout preferences in browser-local storage only; do not reintroduce cookies or store secrets.
2. Keep the public proxy allowlist, origin, DNS/IP, and timeout checks fail-closed.
3. Treat the protocol inventory as evidence-backed documentation, not runtime proof of support.
4. Keep command logging disabled by default.
5. Keep service-worker caching limited to the static shell and never cache live protocol traffic.
6. Keep the integrated `/ws` proxy as the supported browser contract until a separate native source transport spec proves parity.

_Auto-generated by carryforward. Updated between phases._
