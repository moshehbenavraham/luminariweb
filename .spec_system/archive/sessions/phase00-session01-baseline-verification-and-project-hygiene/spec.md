# Session Specification

**Session ID**: `phase00-session01-baseline-verification-and-project-hygiene`
**Phase**: 00 - Align With Real Luminari Data
**Status**: Not Started
**Created**: 2026-05-10

---

## 1. Session Overview

This session establishes a trusted local baseline for Luminari Web before protocol and UI behavior changes begin. It verifies dependency state, lint, build, and development startup behavior against the current React, TypeScript, Vite, Express, and `ws` application.

The purpose is not to change product behavior. The session records what currently works, fixes only small hygiene blockers that prevent baseline verification, and documents repeatable commands that later Phase 00 sessions can rely on.

This is the first session in Phase 00. Its output enables MSDP variable alignment, unavailable-data UX work, fixture creation, and state-mapping tests to start from known local tool and build facts.

---

## 2. Objectives

1. Verify dependency installation and local tool assumptions for the current project.
2. Run and record `npm run lint`, `npm run build`, and production dependency audit results.
3. Verify that the development server can start and expose the documented health endpoint.
4. Apply only minimal hygiene fixes required to complete baseline verification, or document unresolved failures as follow-up work.
5. Preserve a repeatable baseline command record for future Phase 00 sessions.

---

## 3. Prerequisites

### Required Sessions
- None. This is the first session in phase 00.

### Required Tools/Knowledge
- Node.js and npm for dependency and script execution.
- Familiarity with the project npm scripts in `package.json`.
- Basic understanding of the React client in `src/`, proxy server in `server/`, and shared contracts in `shared/`.

### Environment Requirements
- Project dependencies are installable from `package-lock.json`.
- Local ports 5190 and 5191 are available or conflicts can be documented.
- Network access is available if dependency installation or audit needs registry access.

---

## 4. Scope

### In Scope (MVP)
- Maintainer can verify dependency state - record Node, npm, install, and audit facts in session notes.
- Maintainer can run local quality gates - run `npm run lint` and `npm run build`, then record pass/fail details.
- Maintainer can start the local app - verify `npm run dev` or the split dev scripts long enough to check `/health`.
- Maintainer can repeat the baseline - keep exact commands and outcomes in implementation notes, and update `docs/development.md` only if observed behavior differs from the docs.
- Maintainer can unblock baseline verification - apply minimal lint/type/build hygiene fixes when failures are small and directly block verification.

### Out of Scope (Deferred)
- MSDP variable map alignment - *Reason: planned for session 02 after baseline facts are known.*
- Unavailable-data UI states - *Reason: planned for session 03 after variable behavior is aligned.*
- Fixture corpus and test framework design - *Reason: planned for sessions 04 and 05.*
- Terminal renderer replacement - *Reason: belongs to later terminal-focused work.*
- Proxy security hardening - *Reason: important but belongs to Phase 01 production hardening.*

---

## 5. Technical Approach

### Architecture
Use the existing single-project architecture and npm scripts as the baseline surface. The session should not introduce new runtime architecture, package boundaries, or feature behavior. Verification results should be recorded in the session implementation notes so later sessions can distinguish baseline failures from changes they introduce.

If commands fail, classify each failure before editing code. Small ESLint, unused symbol, formatting, or TypeScript blockers can be fixed in the directly affected file. Broader failures, missing test infrastructure, protocol mismatch, proxy hardening, or UI behavior gaps should be documented as follow-up work without expanding this session.

### Design Patterns
- Script-first verification: Use `package.json` commands as the repeatable quality gate contract.
- Minimal-change hygiene: Fix only local blockers needed for baseline verification.
- Documentation as evidence: Record command inputs, outcomes, and unresolved follow-ups in `implementation-notes.md`.
- Source-of-truth preservation: Keep product requirements in `.spec_system/PRD/PRD.md` and local command guidance in `docs/development.md`.

### Technology Stack
- TypeScript 6.0.2
- React 19.2.5
- Vite 8.0.10
- Express 5.1.0
- `ws` 8.18.3
- ESLint 10.2.1
- Node.js and npm from the local development environment

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `.spec_system/specs/phase00-session01-baseline-verification-and-project-hygiene/implementation-notes.md` | Baseline command log, findings, fixes, and follow-up notes | ~120 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `docs/development.md` | Optional command or port documentation corrections if observed baseline differs | ~10 |
| `shared/mud.ts` | Optional minimal shared type or lint hygiene if it blocks baseline verification | ~20 |
| `src/App.tsx` | Optional minimal client lint/type hygiene if it blocks baseline verification | ~30 |
| `server/index.ts` | Optional minimal proxy lint/type hygiene if it blocks baseline verification | ~30 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Dependency state is verified or documented with exact blocker details.
- [ ] `npm run lint` passes or failures are recorded as actionable follow-up work.
- [ ] `npm run build` passes or failures are recorded as actionable follow-up work.
- [ ] The development server can be started and `/health` can be checked, or blockers are documented.
- [ ] No feature behavior changes are introduced beyond required baseline hygiene fixes.

### Testing Requirements
- [ ] Baseline command results are recorded in `implementation-notes.md`.
- [ ] Final lint result is recorded after any hygiene fixes.
- [ ] Final build result is recorded after any hygiene fixes.
- [ ] Development startup and health-check result are recorded.

### Non-Functional Requirements
- [ ] Baseline command notes identify any risk to later Phase 00 sessions.
- [ ] Any unresolved failures include affected file paths and a concrete next action.
- [ ] No player commands, secrets, or live credentials are logged in session artifacts.

### Quality Gates
- [ ] All files ASCII-encoded.
- [ ] Unix LF line endings.
- [ ] Code follows project conventions.

---

## 8. Implementation Notes

### Key Considerations
- `npm run lint` and `npm run build` are the current automated quality gates.
- There is no committed test runner yet, so this session must not pretend broader tests exist.
- Current security findings are important but mostly out of scope unless they block local verification.
- Existing working tree changes may exist; review diffs before editing and avoid reverting unrelated user work.

### Potential Challenges
- Dependency or lockfile drift: Prefer `npm install` only if dependencies are missing, and document any lockfile impact.
- Port conflict: Record the conflict and use split scripts only long enough to verify the app when possible.
- Lint/build failure breadth: Fix small direct blockers, but document broad feature or architecture issues for later sessions.
- Dev server process management: Stop any local process started during verification before ending implementation.

### Relevant Considerations
- P00-TD1 **Default MSDP mapping mismatch**: Do not fix variable alignment here; record only if it appears in baseline output.
- P00-TD2 **Large `src/App.tsx` component**: Avoid extraction or broad cleanup during baseline hygiene.
- P00-TD3 **Combined `server/index.ts` responsibilities**: Avoid parser or proxy refactors during baseline hygiene.
- P00-TD4 **No committed test runner or fixtures**: Keep verification to current scripts and document test gaps.
- P00-SEC1 **Arbitrary proxy host/port**: Do not expand into public hardening; note as out-of-scope risk if observed.
- P00-SEC2 **Cookie-based local settings**: Do not migrate persistence in this session.
- P00-EXT1 **`ansi-to-html` escape invariant**: Do not change terminal rendering paths.

---

## 9. Testing Strategy

### Unit Tests
- No new unit tests are expected in this baseline session because a test framework is not configured yet.

### Integration Tests
- Run `npm run lint`.
- Run `npm run build`.
- Run `npm audit --omit=dev --audit-level=moderate`.

### Manual Testing
- Start local development services.
- Check `http://localhost:5191/health`.
- Confirm the frontend dev URL responds or document the blocker.

### Edge Cases
- Missing `node_modules` or dependency install failure.
- Existing port 5190 or 5191 conflicts.
- Build output succeeds but server entrypoint path differs from `npm start` expectations.
- Lint/build failures caused by generated, reference, or unrelated files.

---

## 10. Dependencies

### External Libraries
- None added in this session.

### Other Sessions
- **Depends on**: None.
- **Depended by**: `phase00-session02-msdp-variable-map-alignment`, `phase00-session04-msdp-fixture-corpus`, and `phase00-session05-state-mapping-tests`.

---

## Next Steps

Run the implement workflow step to begin AI-led implementation.
