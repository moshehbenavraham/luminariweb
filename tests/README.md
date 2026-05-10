# Tests

Run focused TypeScript tests with:

```sh
npm test
```

The test script uses Node's built-in `node:test` runner with the existing `tsx` loader:

```sh
node --import tsx --test tests/*.test.ts
```

## Current Scope

- MSDP variable-map normalization.
- Configured outbound MSDP request filtering.
- Pure MSDP variable/value mapping into `MudState` partials.
- Fixture-driven state-mapping coverage from `tests/fixtures/msdp/manifest.json`.

These tests import shared pure helpers directly. They do not import `server/index.ts`, start Express, open WebSocket listeners, connect TCP sockets, launch a browser, or require live MUD access.

## Fixture Use

Fixture-driven tests load `tests/fixtures/msdp/manifest.json` first and then read each listed fixture file. The helper validates manifest counts, sanitized fixture metadata, expected pair tuple shapes, and recursive `MudValue` payload shapes before mapping expected pairs.

The fixture corpus is synthetic in the current manifest and must remain free of passwords, tokens, private commands, host secrets, and private live session data.

## Deferred Coverage

Phase 01 owns Telnet parser hardening, split and doubled IAC cases, malformed subnegotiation behavior, repeated connect and disconnect lifecycle tests, and reconnect-sensitive proxy behavior. Browser-level UI and visual regression coverage are outside this session.
