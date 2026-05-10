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
  accounting, terminal resize routing, NAWS reconnect scoping, and 25 repeated connect/disconnect
  cycles.
- Proxy safety coverage for banned service ports, unsafe IPv4/IPv6 ranges, IPv4-mapped IPv6
  addresses, metadata-service targets, public allowlists, explicit custom routing, WebSocket origin
  policy, DNS failure handling, unsafe DNS answers, connect timeouts, idle timeouts, stale timeout
  callbacks, manual timeout/disconnect races, and command-redaction assertions.
- Dynamic NAWS resize coverage for default dimensions, custom initial dimensions, changed
  dimensions, no unsupported-before-negotiation writes, resize before connect, resize before NAWS
  negotiation, resize after disconnect, and resize after reconnect.
- Terminal renderer coverage for escaped HTML output, literal angle brackets, ANSI color conversion,
  Luminari caret/RGB color conversion, reset handling, and streaming output.
- xterm spike helper coverage for query-parameter fallback, option defaults, accessibility settings,
  scrollback, and bounded fit dimensions.

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

Proxy policy tests use injected DNS lookup functions and fake timers. They do not perform real DNS
lookups, open TCP sockets, or require a live MUD. Focused commands:

```sh
node --import tsx --test tests/proxy-network.test.ts
node --import tsx --test tests/proxy-policy.test.ts
node --import tsx --test tests/proxy-lifecycle.test.ts
```

## Manual Resize Notes

The automated NAWS tests do not require a live MUD server or browser. When doing manual UI checks,
start the local app, open the client in a desktop browser, connect to an available MUD route, resize
the terminal pane or browser window, and verify command input focus, auto-scroll, aliases, triggers,
and terminal rendering still behave normally.

For mobile-width checks, use a 390px viewport and verify there is no horizontal page scrolling, the
command dock remains usable, and terminal resize updates do not visibly interrupt input.

## Manual Renderer Notes

The xterm.js renderer is an opt-in spike, not the default terminal path. Start the app and compare:

```sh
npm run dev
```

- Default renderer: open the app without query parameters and verify escaped text, ANSI output,
  command input focus, history, aliases, triggers, movement shortcuts, selection/copy, auto-scroll,
  reconnect reset, and resize behavior.
- xterm spike: open the app with `?terminalRenderer=xterm-spike` and repeat the same checks.
- Invalid mode fallback: open the app with `?terminalRenderer=invalid` and verify the default HTML
  renderer remains active.

## Deferred Coverage

Browser-level visual regression automation remains outside this test suite. Public infrastructure
layers such as CDN, WAF, TLS termination, host firewalling, and cloud deployment health checks are
deployment responsibilities and are not exercised by these Node tests.
