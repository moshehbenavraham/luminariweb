# Web MUD Client Shortlist for LuminariMUD

Prepared for: M. Ben Avraham / LuminariMUD
Updated: 10 May 2026

This document now focuses on the short list of repositories we actually want to
study for a first-party Luminari webclient. The broader survey is intentionally
out of scope for the next build phase.

## Local Repositories

All shortlist repositories have been cloned under `EXAMPLES/`, next to the
already-present LuminariWebClient checkout.

| Role | Local path | Remote | Local branch/commit |
| --- | --- | --- | --- |
| Luminari server source | `/home/aiwithapex/projects/Luminari-Source` | `https://github.com/LuminariMUD/Luminari-Source.git` | `master` / `60cbeff6` / 2026-02-22 |
| First-party client base | `/home/aiwithapex/projects/luminariweb/EXAMPLES/LuminariWebClient` | `https://github.com/GickerLDS/LuminariWebClient` | `main` / `76bfca9` / 2026-05-10 |
| Feature/UI reference | `/home/aiwithapex/projects/luminariweb/EXAMPLES/mud-web-client` | `https://github.com/maldorne/mud-web-client.git` | `master` / `012720a` / 2026-04-27 |
| Protocol proxy reference | `/home/aiwithapex/projects/luminariweb/EXAMPLES/mud-web-proxy` | `https://github.com/maldorne/mud-web-proxy.git` | `master` / `03dd743` / 2026-04-27 |
| Mobile/PWA reference | `/home/aiwithapex/projects/luminariweb/EXAMPLES/lociterm` | `https://github.com/RahjIII/lociterm.git` | `dev` / `6370cd5` / 2026-02-02 |
| Battle-tested bridge fallback | `/home/aiwithapex/projects/luminariweb/EXAMPLES/websockify` | `https://github.com/novnc/websockify.git` | `master` / `a4d6cc5` / 2026-02-11 |
| Single-binary bridge fallback | `/home/aiwithapex/projects/luminariweb/EXAMPLES/wsgate-server` | `https://github.com/kazeburo/wsgate-server.git` | `master` / `71871da` / 2025-05-04 |
| Native WebSocket architecture reference | `/home/aiwithapex/projects/luminariweb/EXAMPLES/mud-r` | `https://github.com/lpautet/mud-r.git` | `main` / `3e2e2bd` / 2025-09-29 |

Note on `mud-r`: GitHub repository metadata showed repo-level activity in 2026,
but the cloned default branch currently points at the 2025-09-29 commit above.
Use the local commit table when comparing checked-out code.

Verification note: `npm run lint` was attempted in
`EXAMPLES/LuminariWebClient`, but dependencies are not installed in the local
checkout, so the command failed with `eslint: not found`. Do not treat the
example client as freshly linted or built until `npm ci`, `npm run lint`, and
`npm run build` have been run successfully.

## Shortlist Summary

### 1. `GickerLDS/LuminariWebClient`

Use this as the base we build from.

Why:

- Already Luminari/d20MUD specific.
- Already has a React frontend and Node WebSocket-to-Telnet proxy.
- Already parses MSDP and drives HUD/sidebar panels.
- Already has aliases, triggers, command history, settings, import/export, and
  MUD presets.

Main gaps:

- The terminal is a custom HTML renderer, not xterm.js.
- The client requests some MSDP variables that the audited Luminari source does
  not currently provide.
- No GMCP, MXP, MCCP decompression, dynamic NAWS resize, mapper, or parser test
  suite yet.

### 2. `maldorne/mud-web-client`

Use this as the main feature and UI reference.

Why:

- Modern Vite web MUD client.
- Has broad protocol support: MCCP, MXP, MSDP, GMCP/ATCP, 256-color, UTF-8.
- Includes mapper, triggers/macros, command memory, and windowed UI ideas.

Constraint:

- GPL-3.0. Treat it as a reference unless we intentionally decide GPL inheritance
  is acceptable for the first-party client.

### 3. `maldorne/mud-web-proxy`

Use this as the main protocol proxy reference.

Why:

- Purpose-built WebSocket-to-Telnet MUD proxy.
- Pairs with `mud-web-client`.
- Good comparison point for our Node proxy's Telnet negotiation behavior.

Constraint:

- GPL-3.0, same caution as the client.

### 4. `RahjIII/lociterm`

Use this as the mobile/PWA and robust Telnet handling reference.

Why:

- Strong mobile story.
- PWA-first approach.
- C server component uses dedicated Telnet handling libraries.
- Useful model for installable browser play, reconnect behavior, and small-screen
  ergonomics.

Constraint:

- LGPL-3.0 and a very different stack. It is guidance, not our base.

### 5. `novnc/websockify`

Use this as the proven bridge fallback.

Why:

- Battle-tested WebSocket-to-TCP bridge.
- Good emergency path for a minimal browser connection.
- Useful deployment and reliability reference.

Constraint:

- It does not understand MUD protocols or game state.

### 6. `kazeburo/wsgate-server`

Use this as the lightweight bridge fallback.

Why:

- MIT-licensed.
- Go single-binary WebSocket-to-TCP bridge.
- Useful if we want a small bridge separate from the app server.

Constraint:

- Like websockify, it is a bridge, not a game-aware client.

### 7. `lpautet/mud-r`

Use this only as a native WebSocket architecture reference.

Why:

- Rust CircleMUD-style server with both Telnet and WebSocket connectivity.
- Good pattern if Luminari-Source later grows a native WebSocket listener.

Constraint:

- Not a drop-in client.
- Luminari-Source should not add native WebSocket first. The proxy is safer until
  the current C protocol parser is hardened and tested.

## Luminari-Source Protocol Facts

Sources inspected:

- `/home/aiwithapex/projects/Luminari-Source/src/protocol.h`
- `/home/aiwithapex/projects/Luminari-Source/src/protocol.c`
- `/home/aiwithapex/projects/Luminari-Source/src/comm.c`
- `/home/aiwithapex/projects/Luminari-Source/docs/systems/PROTOCOL_SYSTEMS.md`
- `/home/aiwithapex/projects/Luminari-Source/docs/systems/MSDP_VARIABLES.md`
- `/home/aiwithapex/projects/Luminari-Source/docs/project-management-zusuk/PROTOCOL_TODO.md`

Current facts:

- KaVir Protocol Snippet v8 is integrated.
- MSDP is implemented and is the best current integration point.
- GMCP negotiation and send/parse functions exist, but this is not yet a full
  modern JSON module API.
- MSSP is implemented.
- MXP, MSP, TTYPE, NAWS, and CHARSET negotiation code exists.
- MCCP is compiled with `USING_MCCP`, but `CompressStart()` and `CompressEnd()`
  are stubs. Treat MCCP as not functionally implemented.
- No native WebSocket listener exists in the current Luminari source tree.

Confirmed MSDP table variables include:

- Server/client: `SERVER_ID`, `SERVER_TIME`, `SNIPPET_VERSION`, `CLIENT_ID`,
  `CLIENT_VERSION`, `PLUGIN_ID`, `ANSI_COLORS`, `256_COLORS`, `UTF_8`, `SOUND`,
  `MXP`
- Character: `CHARACTER_NAME`, `LEVEL`, `RACE`, `CLASS`, `POSITION`,
  `ALIGNMENT`, `MONEY`, `PRACTICE`, `WIMPY`
- Resources: `HEALTH`, `HEALTH_MAX`, `PSP`, `PSP_MAX`, `MOVEMENT`,
  `MOVEMENT_MAX`, `EXPERIENCE`, `EXPERIENCE_MAX`, `EXPERIENCE_TNL`
- Combat: `ATTACK_BONUS`, `DAMAGE_BONUS`, `AC`, `OPPONENT_NAME`,
  `OPPONENT_LEVEL`, `OPPONENT_HEALTH`, `OPPONENT_HEALTH_MAX`, `TANK_NAME`,
  `TANK_HEALTH`, `TANK_HEALTH_MAX`
- Ability scores: `STR`, `INT`, `WIS`, `DEX`, `CON`, `CHA`, and permanent score
  variants
- Collections: `AFFECTS`, `INVENTORY`, `ACTIONS`, `GROUP`
- Room/world: `ROOM`, `AREA_NAME`, `ROOM_EXITS`, `ROOM_NAME`, `ROOM_VNUM`,
  `WORLD_TIME`, `SECTORS`, `MINIMAP`
- GUI hints: `BUTTON_1` through `BUTTON_5`, `GAUGE_1` through `GAUGE_5`

Important source/client mismatches:

| Area | Current fact | Impact |
| --- | --- | --- |
| `TITLE` | Requested by LuminariWebClient, not present in `VariableNameTable` | Character title UI will not fill from source MSDP today |
| `QUEST_INFO` | Requested by LuminariWebClient, not present in `VariableNameTable` | Quest tab needs a new server variable or another data source |
| `FORTITUDE`, `REFLEX`, `WILLPOWER` | Requested by LuminariWebClient, not present in `VariableNameTable` | Save widgets need server variables or removal |
| `MINIMAP` | Declared in the table, but no `MSDPSet*` call was found in the audit | Minimap UI may wait forever unless source populates it |
| `ROOM` / `ROOM_EXITS` | Populated by source, but not requested by the current client default map | The webclient should request and parse these before adding a mapper |
| `DAMAGE_BONUS` | Defined, but the update block in `comm.c` appears commented out | Do not build a damage-bonus HUD without confirming live data |
| MCCP | Negotiation path exists, compression functions are stubs | The proxy should keep rejecting MCCP unless real compression is implemented |

## Recommended Build Strategy

The right product is a first-party Luminari webclient, not a generic terminal.
Use LuminariWebClient as the codebase and the shortlist repos as references.

### Phase 0: Align With Real Luminari Data

- Install dependencies and verify `npm run lint` and `npm run build`.
- Change the default MSDP request map to match variables actually emitted by
  Luminari-Source.
- Add client state for `ROOM`, `ROOM_NAME`, `AREA_NAME`, `ROOM_EXITS`,
  `ROOM_VNUM`, `ACTIONS`, and `INVENTORY`.
- Stop treating `TITLE`, `QUEST_INFO`, saves, and `MINIMAP` as guaranteed.
- Add parser fixtures from real Luminari MSDP payloads.

### Phase 1: Harden Terminal and Proxy

- Compare our proxy against `mud-web-proxy`.
- Add parser tests for split IAC sequences, doubled IAC bytes, MSDP tables,
  MSDP arrays, malformed subnegotiations, and reconnect cleanup.
- Add dynamic NAWS resize support.
- Decide whether to replace the custom output renderer with xterm.js.
- Keep rejecting MCCP until the server actually compresses or the proxy is ready
  to decompress.
- Add proxy rate limits and connection quotas.

### Phase 2: Build Luminari Game Panels

- HUD: health, PSP, movement, XP/TNL, AC, attack bonus, money, position.
- Combat: opponent, tank, action economy.
- Party: parse `GROUP`.
- Affects: parse and normalize `AFFECTS`.
- Inventory: render `INVENTORY` after confirming payload shape.
- Room/map: build from `ROOM` and `ROOM_EXITS`; use `MINIMAP` only if the source
  starts populating it.
- Quests: either add `QUEST_INFO` server-side or parse a structured quest command
  response.

### Phase 3: Borrow the Best Ideas

- From `mud-web-client`: mapper, windows, macros, trigger UX, protocol feature
  checklist.
- From `mud-web-proxy`: Telnet negotiation and proxy behavior.
- From `lociterm`: PWA install, mobile layout, reconnect behavior.
- From `websockify` and `wsgate-server`: bridge deployment and isolation.
- From `mud-r`: possible future native WebSocket listener pattern.

### Phase 4: Consider Source-Level Changes Later

- Harden `src/protocol.c` according to the local protocol TODO.
- Add fuzz tests for protocol input/output.
- Implement real MCCP or disable the stubbed path.
- Decide whether GMCP should become a real module API.
- Consider native WebSocket in `comm.c` only after the proxy client is stable.

## Current Shortlist Metadata

GitHub metadata was checked on 10 May 2026. Local clone state is listed in the
Local Repositories table above.

| Repo | Stars | Repo last push | License signal | Primary role |
| --- | ---: | --- | --- | --- |
| `GickerLDS/LuminariWebClient` | 2 | 2026-05-10 | No assertion | First-party base |
| `maldorne/mud-web-client` | 17 | 2026-04-27 | GPL-3.0 | Feature/UI reference |
| `maldorne/mud-web-proxy` | 12 | 2026-04-27 | GPL-3.0 | Protocol proxy reference |
| `RahjIII/lociterm` | 16 | 2026-02-03 | LGPL-3.0 | Mobile/PWA reference |
| `novnc/websockify` | 4390 | 2026-02-11 | LGPL-3.0 | Bridge fallback |
| `kazeburo/wsgate-server` | 37 | 2025-05-04 | MIT | Single-binary bridge fallback |
| `lpautet/mud-r` | 2 | 2026-04-22 | CircleMUD terms, no SPDX | Native WebSocket reference |

## Sources

- Local source repo: `/home/aiwithapex/projects/Luminari-Source`
- Local first-party client: `/home/aiwithapex/projects/luminariweb/EXAMPLES/LuminariWebClient`
- Cloned shortlist repos:
  - `/home/aiwithapex/projects/luminariweb/EXAMPLES/mud-web-client`
  - `/home/aiwithapex/projects/luminariweb/EXAMPLES/mud-web-proxy`
  - `/home/aiwithapex/projects/luminariweb/EXAMPLES/lociterm`
  - `/home/aiwithapex/projects/luminariweb/EXAMPLES/websockify`
  - `/home/aiwithapex/projects/luminariweb/EXAMPLES/wsgate-server`
  - `/home/aiwithapex/projects/luminariweb/EXAMPLES/mud-r`
- GitHub remotes:
  - https://github.com/GickerLDS/LuminariWebClient
  - https://github.com/maldorne/mud-web-client
  - https://github.com/maldorne/mud-web-proxy
  - https://github.com/RahjIII/lociterm
  - https://github.com/novnc/websockify
  - https://github.com/kazeburo/wsgate-server
  - https://github.com/lpautet/mud-r
