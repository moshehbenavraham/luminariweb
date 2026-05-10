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
4. Review proxy logs for DNS, TCP, or connection reset errors.

### HUD Data Missing

**Symptoms**: Terminal works but HUD or panel values stay empty.

**Resolution**:

1. Confirm the MUD negotiated MSDP.
2. Check the MSDP variable mapping in the UI settings.
3. Compare requested variables with `.spec_system/PRD/PRD.md`.
4. Treat unsupported variables as expected gaps until Phase 00 alignment work is complete.
