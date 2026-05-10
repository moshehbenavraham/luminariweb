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
- Fixture-driven parser coverage for MSDP scalars, arrays, tables, nested structures,
  mixed array/table payloads, empty collections, malformed payloads, and parser-to-state
  mapping compatibility.
- Side-effect-free Telnet parser edge-case coverage for split IAC sequences, doubled IAC bytes,
  negotiation boundaries, MSDP subnegotiation boundaries, malformed MSDP input, TTYPE, and NAWS.
- Proxy lifecycle coverage for manual disconnect, browser close cleanup, MUD socket close/error
  cleanup, reconnect state reset, stale socket callback suppression, active WebSocket connection
  accounting, and 25 repeated connect/disconnect cycles.

These tests import shared pure helpers directly from `shared/mud.ts`, `shared/msdp-state.ts`,
`server/telnet-parser.ts`, and side-effect-free lifecycle modules such as
`server/mud-session.ts` and `server/connection-accounting.ts`. They do not import
`server/index.ts`, start Express, open WebSocket listeners, connect TCP sockets, launch a browser,
or require live MUD access.

## Fixture Use

Fixture-driven tests load `tests/fixtures/msdp/manifest.json` first and then read each listed fixture file. The helper validates manifest counts, sanitized fixture metadata, expected pair tuple shapes, and recursive `MudValue` payload shapes before mapping expected pairs.

Parser fixture tests encode each fixture `payloadTokens` stream into raw MSDP bytes before
calling `parseMsdpPayload()`. Expected parser output is compared directly with fixture
`expectedPairs`, and malformed fixture payloads are expected to produce safe partial output
or empty values without throwing.

The fixture corpus is synthetic in the current manifest and must remain free of passwords, tokens, private commands, host secrets, and private live session data.

Lifecycle tests use `tests/helpers/proxy-lifecycle-harness.ts` to inject fake browser and MUD
sockets. Fake socket payloads must stay synthetic and must not include passwords, tokens, private
commands, private hosts, or captured live player transcripts.

## Deferred Coverage

Later Phase 01 sessions own dynamic NAWS resize behavior and deployment safety. Browser-level UI
and visual regression coverage are outside this session.
