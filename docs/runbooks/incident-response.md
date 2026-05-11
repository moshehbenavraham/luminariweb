# Incident Response

## Severity

| Level | Description                                        | Response Target          |
| ----- | -------------------------------------------------- | ------------------------ |
| P0    | App unavailable or proxy cannot start              | Immediate                |
| P1    | Users cannot connect to configured MUDs            | Under 1 hour             |
| P2    | HUD, panels, aliases, triggers, or settings broken | Under 4 hours            |
| P3    | Documentation or cosmetic issue                    | Next planned maintenance |

## First Checks

```bash
pm2 status
pm2 logs luminari-web-client
curl http://localhost:5191/health
```

For local development:

```bash
npm run dev
```

## Common Incidents

### Server Does Not Start

**Symptoms**: `npm start` or PM2 exits, health check fails.

**Resolution**:

1. Run `npm run build`.
2. Check `dist/server/index.js` exists.
3. Check whether `PORT` is already in use.
4. Review server logs for TypeScript build or runtime errors.

### Browser Cannot Open WebSocket

**Symptoms**: App loads, connect action fails, browser console shows WebSocket errors.

**Resolution**:

1. Verify the proxy server is running.
2. Check `/health`.
3. Confirm Vite proxy settings in `vite.config.ts` for development.
4. Confirm `VITE_WS_URL` if using a non-default target.

### MUD Connection Fails

**Symptoms**: WebSocket connects but MUD status reports an error or closes.

**Resolution**:

1. Confirm host and port.
2. Try a configured preset.
3. Check outbound network access from the server host.
4. In public mode, confirm the route is a curated preset or is present in `PROXY_ALLOWED_DESTINATIONS`.
5. Confirm the port is not a banned service port.
6. Confirm DNS resolves to public-routable addresses and not private, loopback, link-local, reserved, or metadata-service addresses.
7. Review proxy logs for stable policy, DNS, TCP, timeout, or connection reset errors without collecting player command text.

### Public Proxy Policy Rejects Connections

**Symptoms**: Browser can open the app, but `/ws` closes immediately or connect attempts report policy errors.

**Resolution**:

1. Confirm `PROXY_PUBLIC_MODE=true` for public production.
2. Confirm `PROXY_ALLOWED_ORIGINS` exactly matches the deployed HTTPS origin.
3. Confirm the reverse proxy forwards WebSocket upgrades and preserves the `Origin` header.
4. Confirm the MUD host and port are in `shared/app-settings.ts` or `PROXY_ALLOWED_DESTINATIONS`.
5. Confirm `PROXY_ALLOW_CUSTOM_DESTINATIONS=true` was not enabled as a shortcut around missing allowlist entries.
6. Check for banned ports, direct IP literals, unsafe DNS answers, and metadata-service hostnames.
7. Run `node --import tsx --test tests/proxy-deployment-policy.test.ts` after any policy change.

### Bridge Fallback Misroutes App Traffic

**Symptoms**: Terminal or panel state stops working after a bridge is introduced, or the bridge receives JSON app messages.

**Resolution**:

1. Restore the first-party React app's `/ws` route to the integrated Luminari Web proxy.
2. Confirm `/health`, `/api/settings`, and `/ws` are served by the same integrated deployment.
3. Use [bridge-fallback.md](bridge-fallback.md) before considering a separate raw terminal bridge.
4. Keep bridge recording, TCP dump, packet capture, and verbose byte logging disabled for player traffic.
5. Escalate as a privacy incident if logs or support artifacts include player commands, credentials typed inside the MUD, private roleplay, private hostnames, or terminal transcripts.

### HUD Data Missing

**Symptoms**: Terminal works but HUD or panel values stay empty.

**Resolution**:

1. Confirm the MUD negotiated MSDP.
2. Check the MSDP variable mapping in the UI settings.
3. Compare requested variables with `.spec_system/PRD/PRD.md`.
4. Treat unsupported variables as expected gaps unless the current PRD or a completed session explicitly adds support for them.
5. If the Room, Map, or Quests tabs show explicit unavailable or override-only states, verify whether `ROOM`, `ROOM_EXITS`, `MINIMAP`, or `QUEST_INFO` are actually emitted by the server before treating the UI as broken.
