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
- Core MSDP display helper coverage for HUD bars, XP/TNL progress, character stats, zero values,
  negative values, missing max values, unavailable fields, and override-only waiting states.
- Combat display helper coverage for opponent and tank status, zero and partial health values,
  quiet inactive states, `ACTIONS` arrays and fallback payloads, and override-only damage bonus
  availability.
- Group display helper coverage for full and partial members, missing names, zero values, movement
  maximums, leader flags, status text, unknown fields, object-like payloads, raw fallback entries,
  disabled mappings, and connection availability states.
- Affects and inventory display helper coverage for full and partial effects, zero and negative
  durations, modifiers, grouped and counted inventory, item locations, long names, unknown fields,
  raw fallback entries, disabled mappings, and connection availability states.
- Room display helper coverage for full and partial identity, zero room vnum, blank fields,
  structured `ROOM` fallback, string/array/table/object-like exits, deterministic ordering,
  unknown fields, raw fallback entries, disabled mappings, and connection availability states.

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
node --import tsx --test tests/msdp-display.test.ts
node --import tsx --test tests/msdp-group-display.test.ts
node --import tsx --test tests/msdp-affects-inventory-display.test.ts
node --import tsx --test tests/msdp-room-display.test.ts
node --import tsx --test tests/msdp-state-mapping.test.ts
node --import tsx --test tests/proxy-network.test.ts
node --import tsx --test tests/proxy-policy.test.ts
node --import tsx --test tests/proxy-lifecycle.test.ts
```

## Manual Resize Notes

The automated NAWS tests do not require a live MUD server or browser. When doing manual UI checks,
start the local app, open the client in a desktop browser, connect to an available MUD route, resize
the terminal pane or browser window, and verify command input focus, auto-scroll, aliases, triggers,
and terminal rendering still behave normally.

For core HUD and character panel checks, use desktop, 390px, and 360px viewports. Verify there is no
horizontal page scrolling, the command dock remains usable, HP/PSP/movement/XP bars show visible
text, character stats wrap inside the sidebar, unavailable title/saves/damage states remain
explicit, and terminal resize updates do not visibly interrupt input.

For combat panel checks, use desktop, 390px, and 360px viewports. Verify inactive combat stays quiet,
opponent-only, tank-only, opponent+tank, empty actions, mixed action entries, and damage-bonus
availability states remain readable, the Combat tab wraps without horizontal page scrolling, and
command input focus returns normally after selecting the combat tab.

For group panel checks, use desktop, 390px, and 360px viewports. Verify waiting, empty, full, partial,
long-name, leader, status, health, movement, raw fallback, and unknown-field states remain readable,
resource text stays visible with or without maximum values, the Group tab wraps without horizontal
page scrolling, and command input focus returns normally after selecting the group tab.

`GROUP` fixtures are synthetic display and parser contracts for a source-confirmed MSDP variable.
They should not be treated as proof of final live server member field names until source-level
protocol work confirms the member schema.

For affects and inventory panel checks, use desktop, 390px, and 360px viewports. Verify waiting,
empty, full, partial, grouped, counted, long-name, raw fallback, unknown-field, disabled, offline,
and error states remain readable, collection row text wraps inside the sidebar, the Inventory and
Affects tabs wrap without horizontal page scrolling, and command input focus returns normally after
selecting either tab.

`AFFECTS` and `INVENTORY` fixtures are synthetic display and parser contracts for source-confirmed
MSDP variables. They should not be treated as proof of final live server affect or inventory field
names until source-level protocol work confirms those schemas.

For room panel checks, use desktop, 390px, and 360px viewports. Verify waiting, empty, full,
partial, table, array, string, long-name, disabled, offline, error, raw fallback, and unknown-field
states remain readable, room fields and exit rows wrap inside the sidebar, the Room tab wraps
without horizontal page scrolling, the existing map fallback still works when `MINIMAP` is absent,
and command input focus returns normally after selecting the Room tab.

`ROOM` and `ROOM_EXITS` fixtures are synthetic display and parser contracts for source-confirmed
MSDP variables. They should not be treated as proof of final live server room or exit field names,
and the Room tab must remain separate from unconfirmed live `MINIMAP` behavior.

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
