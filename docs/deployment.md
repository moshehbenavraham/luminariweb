# Deployment

## Build

```bash
npm install
npm run build
```

The build writes frontend assets to `dist/client` and server output to `dist/server`.

## Local Production Run

```bash
npm start
curl http://localhost:5191/health
```

`npm start` runs `node dist/server/index.js`. The server serves the built frontend, `/api/settings`, `/health`, and `/ws`.

## Production Topology

The supported public topology is the integrated Express and `ws` proxy behind an
operator-managed HTTPS/WSS terminator:

```text
Browser
  |-- HTTPS static app, GET /api/settings, WebSocket /ws
  v
Reverse proxy or HTTPS terminator
  v
Luminari Web integrated proxy
  |-- validated TCP socket
  v
Curated Luminari-compatible MUD
```

The integrated proxy is the default because `/ws` is a structured application
protocol, not raw Telnet bytes. It validates browser messages, enforces public
destination policy, negotiates Telnet/MSDP, maps state for the UI, and emits
sanitized connection statuses. Standalone bridge projects can be useful as
separate raw transport fallbacks, but they are not compatible replacements for
the first-party React app. See [Bridge Deployment Options](bridge-deployment-options.md).

## Health Probe

`GET /health` returns HTTP 200 JSON with `{ "ok": true }`. Local production verification:

```bash
curl -fsS http://localhost:${PORT:-5191}/health
```

For PM2 or operator-hosted deployments, configure the load balancer, reverse proxy, or uptime monitor to check `https://<origin>/health` and alert or restart on non-200 responses. PM2 does not provide an in-repository HTTP probe, so this is a deployment-platform setting.

## Security Controls

The built server applies application-level proxy guardrails before opening a Telnet socket:

- HTTP requests are rate limited per IP with `429 Too Many Requests` and `Retry-After` headers.
- Browser command input sent over `/ws` is throttled per socket.
- Excessive concurrent WebSocket connections from one IP are rejected.
- Public proxy mode is enabled by default and allows only curated MUD presets plus server-only `PROXY_ALLOWED_DESTINATIONS` entries.
- Unexpected WebSocket origins are rejected in public mode before quota acquisition or MUD socket creation.
- Destinations are checked for banned service ports, unsafe direct IP literals, DNS failures, private ranges, loopback, link-local, multicast, reserved ranges, and metadata-service targets.
- Connect and idle timeouts close the active MUD socket with sanitized status details.
- Player command text is not intentionally logged or included in policy, socket, or timeout errors.

Public deployments should still place a WAF or equivalent reverse-proxy rule set in front of the app:

- Allow only the deployed browser origin to reach `/api/settings`, `/health`, and `/ws`.
- Block obvious scan and bot traffic before it reaches the Node process.
- Rate limit abusive requests at the edge even though the app already enforces per-IP request limits.
- Keep the WAF policy aligned with the same public origin that is used in `PROXY_ALLOWED_ORIGINS`.

Recommended public-mode environment:

```bash
PROXY_PUBLIC_MODE=true
PROXY_ALLOWED_ORIGINS=https://play.example.com
PROXY_ALLOWED_DESTINATIONS=extra-mud.example.com:4000
PROXY_CONNECT_TIMEOUT_MS=10000
PROXY_IDLE_TIMEOUT_MS=300000
PROXY_DNS_TIMEOUT_MS=3000
PROXY_DNS_RETRY_COUNT=1
```

`PROXY_ALLOWED_DESTINATIONS` is optional when the curated presets are the only public routes. Use comma-separated `host:port` pairs for additions. Malformed entries are ignored, and banned service ports remain blocked.

Public operators should verify this checklist before exposing the service:

- Serve the browser app over HTTPS and reach `/ws` over WSS from the same public origin unless `VITE_WS_URL` is intentionally configured.
- Set `PROXY_ALLOWED_ORIGINS` to the exact deployed browser origin.
- Keep `PROXY_PUBLIC_MODE=true` unless the deployment is a trusted private operator environment.
- Add only vetted MUD routes to `PROXY_ALLOWED_DESTINATIONS`.
- Confirm the reverse proxy forwards WebSocket upgrades to `/ws` and does not strip the `Origin` header.
- Probe `/health` through the public HTTPS origin and alert on non-200 responses.
- Keep player command text out of proxy, reverse-proxy, bridge, packet-capture, and incident logs by default.

Private or operator deployments can allow browser-supplied public-routable hostnames:

```bash
PROXY_PUBLIC_MODE=false
```

or, for a public-mode process that still permits custom hostnames:

```bash
PROXY_ALLOW_CUSTOM_DESTINATIONS=true
```

Custom routing does not disable private-network, reserved-network, metadata-service, DNS, or banned-port checks. For public hosting, still configure HTTPS termination, CDN or reverse-proxy protections, WAF rules, process supervision, and host-level firewall controls outside this repository.

## Bridge Fallbacks

Do not point the first-party React app's `/ws` endpoint at a blind
WebSocket-to-TCP bridge. A bridge cannot speak the app JSON message contract or
produce MSDP-backed UI state. If a bridge is needed, operate it as a separate
terminal-only path with fixed or mapped targets, TLS, authorization, rate
limits, timeout policy, and recording/TCP-dump features disabled by default for
player traffic. The decision criteria and rollback steps are in
[Bridge Fallback Runbook](runbooks/bridge-fallback.md).

## PM2 Run

```bash
npm install
npm run build
pm2 start dist/server/index.js --name luminari-web-client
```

Optional ecosystem file:

```bash
pm2 start ecosystem.config.cjs
```

Useful commands:

```bash
pm2 status
pm2 logs luminari-web-client
pm2 restart luminari-web-client
pm2 stop luminari-web-client
pm2 delete luminari-web-client
```

## CI/CD Pipeline

The repository includes a manual GitHub Actions deploy workflow at [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml). It builds the app and posts a deployment webhook when the required secret is configured.

Required secret:

| Variable               | Purpose                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| `DEPLOY_WEBHOOK_URL`   | Deployment trigger endpoint for the operator-hosted production environment |
| `DEPLOY_WEBHOOK_TOKEN` | Optional bearer token for webhook authentication                           |

The workflow can be run from the GitHub Actions UI and pointed at a branch or tag ref. It uses `scripts/deploy-webhook.mjs` to send build metadata, rollback guidance, and the source revision to the deployment trigger.

Local release verification remains:

```bash
npm run lint
npm run build
curl http://localhost:5191/health
```

## Rollback

Rollback is operator-managed. Redeploy the previous approved git revision or release artifact through the same webhook or PM2 process, then confirm `/health` and WebSocket reconnect behavior.

Rollback when the health check fails after deploy, the app cannot establish WebSocket connections, or critical connection behavior regresses.
