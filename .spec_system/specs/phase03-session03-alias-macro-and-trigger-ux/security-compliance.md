# Security and Compliance Notes

**Session ID**: `phase03-session03-alias-macro-and-trigger-ux`
**Created**: 2026-05-11
**Last Updated**: 2026-05-11 08:48

---

## P00-SEC-002 Remediation Scope

Open finding `P00-SEC-002` states that browser settings, aliases, and triggers are stored in chunked cookies and are therefore sent on HTTP and WebSocket requests. This session moves that client configuration to versioned `localStorage` payloads and clears the legacy cookie groups only after a valid payload can be written.

## Data Classification

Persisted data allowed by this session:
- Display settings.
- MSDP variable display overrides.
- Alias definitions.
- Trigger definitions.

Persisted data forbidden by this session:
- Passwords.
- Authentication tokens.
- Host secrets.
- Raw command history.
- Terminal transcripts.
- Live MUD output.

## Migration Safety

- Read `localStorage` first when available.
- Read legacy chunked cookies only as migration input when no valid local payload exists.
- Normalize settings, aliases, and triggers before writing a migrated payload.
- Clear `lwc.settings`, `lwc.aliases`, `lwc.triggers`, and chunked variants only after a successful local write.
- Fall back to defaults and in-memory edits if storage reads or writes throw.

## Import and Export Safety

- Export only the explicit settings, aliases, and triggers payload.
- Parse and validate the full imported payload before replacing current state.
- Preserve current browser state when any import field is malformed.
- Surface bounded user-visible import errors without exposing stack traces.

## License Boundary

- No GPL client source code or styles are copied.
- Existing reference-client material is behavior-only context for user-facing affordances.

## Current Status

- Complete: browser settings, aliases, and triggers now persist through `localStorage.lwc.config`.
- Complete: legacy chunked cookie groups are migrated and cleared only after a successful local write.
- Complete: imports validate the full replacement payload before state changes.
- Complete: exports contain only settings, aliases, triggers, type, and version fields.
- Complete: no GPL reference source or styling was copied.

## Validation Evidence

- `node --import tsx --test tests/client-automation.test.ts tests/client-config-persistence.test.ts` passed with 17 tests.
- `npm run test` passed with 142 tests.
- `npm run lint` passed.
- `npm run build` passed.
- Browser smoke passed for legacy cookie migration, alias preview/delete confirmation, trigger preview, config export, config import, and 390px/360px overflow checks.
