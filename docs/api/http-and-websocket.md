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
  "msdpVariables": {
    "characterName": "CHARACTER_NAME",
    "health": "HEALTH",
    "healthMax": "HEALTH_MAX",
    "roomName": "ROOM_NAME",
    "roomExits": "ROOM_EXITS",
    "actions": "ACTIONS",
    "inventory": "INVENTORY",
    "minimap": ""
  }
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

## Validation

The server rejects invalid JSON, unknown message types, malformed connect messages, invalid host strings, and ports outside `1..65535`. Public deployment requires stronger policy than this current baseline.
