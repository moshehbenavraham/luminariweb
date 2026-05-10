# HTTP and WebSocket Contracts

## HTTP

### `GET /health`

Returns proxy health:

```json
{ "ok": true }
```

### `GET /api/settings`

Returns `appSettings` from `shared/app-settings.ts`, including port defaults, MUD presets, and personalization text.

## WebSocket `/ws`

The browser opens a WebSocket connection to `/ws`. Message shapes are defined in `shared/mud.ts`.

### Browser to Server

Connect:

```json
{
  "type": "connect",
  "host": "krynn.d20mud.com",
  "port": 4300,
  "msdpVariables": {}
}
```

Disconnect:

```json
{ "type": "disconnect" }
```

Send command input:

```json
{ "type": "input", "text": "look" }
```

Update MSDP variable mapping:

```json
{
  "type": "msdp-config",
  "msdpVariables": {}
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
    "healthMax": 50
  }
}
```

## Validation

The server rejects invalid JSON, unknown message types, malformed connect messages, invalid host strings, and ports outside `1..65535`. Public deployment requires stronger policy than this current baseline.
