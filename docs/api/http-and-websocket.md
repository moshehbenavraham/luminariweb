# HTTP and WebSocket Contracts

## HTTP

### `GET /health`

Returns proxy health:

```json
{ "ok": true }
```

### `GET /api/settings`

Returns `appSettings` from `shared/app-settings.ts`, including port defaults, MUD presets, and personalization text.

Both HTTP endpoints are rate limited per IP. When the limit is exceeded, the server returns `429 Too Many Requests` with `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers.

## WebSocket `/ws`

The browser opens a WebSocket connection to `/ws`. Message shapes are defined in `shared/mud.ts`.

`/ws` is an application protocol, not a raw Telnet bridge. The server expects
structured JSON browser messages and returns typed terminal, state, and
connection-status messages. A direct websockify or wsgate-style bridge cannot
serve this endpoint for the first-party React app because it forwards bytes
without validating the app message schema, negotiating MSDP for the app,
mapping state, or producing the documented status details.

In public proxy mode, the server checks the `Origin` header before creating a proxy session. Local development origins are allowed by default. Production origins must be configured with `PROXY_ALLOWED_ORIGINS`. Missing or unexpected public-mode origins are closed before a MUD socket can be opened.

### Browser to Server

Connect:

```json
{
  "type": "connect",
  "host": "krynn.d20mud.com",
  "port": 4300,
  "msdpVariables": {
    "characterName": "CHARACTER_NAME",
    "health": "HEALTH",
    "healthMax": "HEALTH_MAX",
    "room": "ROOM",
    "roomName": "ROOM_NAME",
    "roomExits": "ROOM_EXITS",
    "actions": "ACTIONS",
    "inventory": "INVENTORY",
    "minimap": "",
    "questInfo": ""
  }
}
```

Connect messages are validated asynchronously before `MudSession.connect()` opens a TCP socket. Public mode accepts curated preset `host:port` pairs and server-only `PROXY_ALLOWED_DESTINATIONS` additions. Arbitrary hostnames require explicit custom routing through `PROXY_PUBLIC_MODE=false` or `PROXY_ALLOW_CUSTOM_DESTINATIONS=true`.

Rejected connect attempts receive a `connection-status` message with `status: "error"` and a sanitized detail such as:

- `Provide a valid MUD host and port.`
- `This MUD destination is not allowed.`
- `Direct IP MUD destinations are not allowed in public mode.`
- `This MUD port is not allowed.`
- `This MUD destination could not be verified.`
- `This MUD destination resolves to a blocked network.`
- `A connection request is already in progress.`

Policy rejection details do not include raw DNS errors, socket errors, internal paths, or player command text.

Disconnect:

```json
{ "type": "disconnect" }
```

Send command input:

```json
{ "type": "input", "text": "look" }
```

Browser command input is throttled per WebSocket session. Excessive command bursts receive a connection-status error and are ignored until the rate window resets.

Update MSDP variable mapping:

```json
{
  "type": "msdp-config",
  "msdpVariables": {
    "room": "ROOM",
    "areaName": "AREA_NAME",
    "roomName": "ROOM_NAME",
    "roomVnum": "ROOM_VNUM",
    "roomExits": "ROOM_EXITS",
    "worldTime": "WORLD_TIME",
    "questInfo": ""
  }
}
```

### Server to Browser

Connection status:

```json
{
  "type": "connection-status",
  "status": "connected",
  "detail": "Connected to krynn.d20mud.com:4300."
}
```

Timeout statuses use stable text:

```json
{
  "type": "connection-status",
  "status": "error",
  "detail": "Connection timed out before the MUD accepted the connection."
}
```

```json
{
  "type": "connection-status",
  "status": "disconnected",
  "detail": "Connection closed after being idle too long."
}
```

Terminal text:

```json
{
  "type": "terminal",
  "text": "Welcome..."
}
```

Partial MUD state update:

```json
{
  "type": "state",
  "state": {
    "health": 42,
    "healthMax": 50,
    "roomName": "Market Square",
    "areaName": "Luminari",
    "roomVnum": 1234,
    "roomExits": {
      "north": "1235",
      "south": "1233"
    },
    "actions": ["look", "rest"],
    "inventory": [
      {
        "name": "lantern",
        "quantity": 1
      }
    ]
  }
}
```

Blank MSDP mapping values are override-only slots. They are normalized and preserved in browser settings, but the proxy filters them out before sending MSDP `REPORT` or `SEND` requests.

The browser renders room, map, and quest panels from the resulting `state` messages. `ROOM`, `ROOM_EXITS`, `MINIMAP`, and `QUEST_INFO` remain explicit fallback or override-only paths until the server emits the corresponding live values.

## Validation

The server rejects invalid JSON, unknown message types, malformed connect messages, invalid host strings, ports outside `1..65535`, banned service ports, disallowed destinations, unsafe direct IP literals, unsafe DNS answers, and unexpected public-mode origins. Destination failures are handled before `net.createConnection()` is called.

Bridge fallback services, if any, must use separate routes and separate client
expectations. They are not valid implementations of this `/ws` contract.
