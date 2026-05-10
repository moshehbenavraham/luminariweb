# Security & Compliance

> Cumulative security posture and GDPR compliance record. Updated between phases via carryforward.
> **Line budget**: 1000 max | **Last updated**: Phase 00 (2026-05-10)

---

## Current Security Posture

### Overall: NEEDS HARDENING BEFORE PUBLIC DEPLOYMENT

| Metric           | Value |
| ---------------- | ----- |
| Open Findings    | 5     |
| Critical/High    | 1     |
| Medium/Low       | 4     |
| Phases Audited   | 0     |
| Last Clean Phase | --    |

## Open Findings

### Critical / High

- **HIGH P00-SEC-001: Public proxy can target arbitrary hosts and ports.** `server/index.ts` validates only host syntax and port range before `net.createConnection()`. Before public deployment, add configured destination allowlists, DNS/IP checks that reject loopback/private/link-local/multicast/metadata ranges, banned service ports, origin checks, connection quotas, rate limits, and connect/idle timeouts.

### Medium / Low

- **MEDIUM P00-SEC-002: Browser settings are stored in cookies.** `src/App.tsx` stores aliases, triggers, and client settings in chunked cookies with `SameSite=Lax` and `path=/`. They are not passwords, but they are sent to the server on HTTP/WebSocket requests. Prefer localStorage or IndexedDB and keep secrets out of client persistence.
- **MEDIUM P00-SEC-003: No command/input rate limiting.** Alias and trigger recursion is capped, but neither browser command submission nor proxy input forwarding has rate limits. Add safeguards before public deployment to reduce automation loops and abuse.
- **LOW P00-SEC-004: HTML rendering depends on escaping invariants.** Terminal and panel rendering use `dangerouslySetInnerHTML`, currently through `ansi-to-html` with `escapeXML: true`. Preserve that invariant, and add tests around HTML escaping before renderer changes.
- **LOW P00-SEC-005: No automated security regression tests.** Lint/build pass, but parser, WebSocket validation, reconnect cleanup, and unsafe host rejection are not covered by committed tests yet.

## GDPR Compliance Status

### Overall: LOW RISK / LOCAL-ONLY

### Personal Data Inventory

No account system, database, analytics, payment flow, or server-side profile storage exists in this repository.

Browser-local data currently includes:

- Client display settings
- MSDP variable mappings
- Aliases
- Triggers
- Imported/exported local configuration files

Potentially sensitive operational data:

- Player command text passes through the proxy to the selected MUD but is not intentionally logged by current code.
- MUD host and port are sent to the proxy during connection.

### Compliance Checklist

| Requirement                            | Status  | Notes                                                                                           |
| -------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| Data collection has documented purpose | Partial | Browser-local settings support gameplay preferences; no server-side account data exists         |
| Consent obtained before data storage   | Partial | Settings are saved by using app controls, but there is no explicit storage notice               |
| Data minimization verified             | Partial | No secrets are required; cookies should be replaced for local settings                          |
| Deletion/erasure path exists           | Partial | Users can clear browser storage/cookies; no in-app clear-all control is documented              |
| No PII in application logs             | Pass    | Current code logs startup and settings-load errors, not command text                            |
| Third-party transfers documented       | Partial | Commands and connection data are sent to selected MUD hosts; production policy is not finalized |

## Dependency Security

`npm audit --omit=dev --audit-level=moderate` reported 0 production dependency vulnerabilities on 2026-05-10.

Top-level runtime dependencies observed:

- `ansi-to-html`
- `express`
- `react`
- `react-dom`
- `ws`

Development dependencies include Vite, TypeScript, ESLint, React plugin packages, `tsx`, and `concurrently`.

## Resolved Findings

_No resolved findings yet._

## Phase History

| Phase | Sessions    | Security          | GDPR                | Findings Opened | Findings Closed |
| ----- | ----------- | ----------------- | ------------------- | --------------- | --------------- |
| 00    | 0/5 planned | Initial code scan | Local-only baseline | 5               | 0               |

## Recommendations

1. Prioritize proxy allowlist, origin, DNS/IP, quota, and rate-limit work before any public deployment.
2. Move browser-local settings, aliases, and triggers out of cookies before storing larger data or any sensitive values.
3. Add tests for WebSocket message validation, host rejection, HTML escaping, parser malformed input, and reconnect cleanup.
4. Keep command logging disabled by default.
5. Document any production MUD host policy in `docs/deployment.md` and `.spec_system/PRD/PRD.md`.

_Auto-generated by initspec. Updated by carryforward between phases._
