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

Private or operator deployments can allow browser-supplied public-routable hostnames:

```bash
PROXY_PUBLIC_MODE=false
```

or, for a public-mode process that still permits custom hostnames:

```bash
PROXY_ALLOW_CUSTOM_DESTINATIONS=true
```

Custom routing does not disable private-network, reserved-network, metadata-service, DNS, or banned-port checks. For public hosting, still configure HTTPS termination, CDN or reverse-proxy protections, WAF rules, process supervision, and host-level firewall controls outside this repository.

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
