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
- Side-effect-free Telnet parser edge-case coverage for split IAC sequences, doubled IAC bytes,
  negotiation boundaries, MSDP subnegotiation boundaries, malformed MSDP input, TTYPE, and NAWS.

These tests import shared pure helpers directly from `shared/mud.ts`, `shared/msdp-state.ts`, and `server/telnet-parser.ts`. They do not import `server/index.ts`, start Express, open WebSocket listeners, connect TCP sockets, launch a browser, or require live MUD access.

## Fixture Use

Fixture-driven tests load `tests/fixtures/msdp/manifest.json` first and then read each listed fixture file. The helper validates manifest counts, sanitized fixture metadata, expected pair tuple shapes, and recursive `MudValue` payload shapes before mapping expected pairs.

The fixture corpus is synthetic in the current manifest and must remain free of passwords, tokens, private commands, host secrets, and private live session data.

## Deferred Coverage

Later Phase 01 sessions own structured MSDP table and array expansion, repeated connect and disconnect lifecycle tests, reconnect-sensitive proxy behavior, dynamic NAWS resize behavior, and deployment safety. Browser-level UI and visual regression coverage are outside this session.
