# Environments

## Environment Matrix

| Environment | URL                                                 | Purpose                                |
| ----------- | --------------------------------------------------- | -------------------------------------- |
| Development | `http://localhost:5190` and `http://localhost:5191` | Local frontend and proxy development   |
| Preview     | `http://localhost:5192`                             | Local preview of built frontend assets |
| Production  | Not defined in repo                                 | Operator-hosted built app and proxy    |

## Configuration Differences

| Config           | Development                          | Preview                                                | Production                                      |
| ---------------- | ------------------------------------ | ------------------------------------------------------ | ----------------------------------------------- |
| Frontend serving | Vite dev server                      | Vite preview                                           | Express static server                           |
| Proxy/API        | `tsx watch server/index.ts`          | Separate server required for `/ws` and `/api/settings` | `node dist/server/index.js`                     |
| WebSocket URL    | Same-origin `/ws` through Vite proxy | `VITE_WS_URL` if needed                                | Same-origin `/ws` by default                    |
| Server port      | `shared/app-settings.ts` or `PORT`   | Depends on proxy process                               | `PORT` or `shared/app-settings.ts`              |
| Proxy routing    | Curated presets plus local origins   | Curated presets plus configured origins                | Curated presets plus explicit server allowlists |

## Environment Variables

| Variable                          | Default           | Purpose                                                                |
| --------------------------------- | ----------------- | ---------------------------------------------------------------------- |
| `PORT`                            | `5191`            | Override the Express and WebSocket server port                         |
| `VITE_WS_URL`                     | same-origin `/ws` | Override the browser WebSocket target                                  |
| `PROXY_PUBLIC_MODE`               | `true`            | Keep proxy in allowlisted public mode when `true`                      |
| `PROXY_ALLOWED_ORIGINS`           | local dev origins | Comma-separated allowed browser origins such as `https://play.example` |
| `PROXY_ALLOWED_DESTINATIONS`      | curated presets   | Comma-separated server-only `host:port` additions                      |
| `PROXY_ALLOW_CUSTOM_DESTINATIONS` | `false` in public | Permit custom public-routable hostnames when explicitly enabled        |
| `PROXY_CONNECT_TIMEOUT_MS`        | `10000`           | MUD TCP connect timeout, clamped to `1000..30000`                      |
| `PROXY_IDLE_TIMEOUT_MS`           | `300000`          | Connected MUD idle timeout, clamped to `30000..3600000`                |
| `PROXY_DNS_TIMEOUT_MS`            | `3000`            | Destination DNS lookup timeout, clamped to `500..10000`                |
| `PROXY_DNS_RETRY_COUNT`           | `1`               | DNS retry count, clamped to `0..2`                                     |

## Deployment Variables

| Variable               | Default | Purpose                                                                                         |
| ---------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `DEPLOY_WEBHOOK_URL`   | none    | Required by the GitHub Actions deploy workflow to trigger the operator-hosted deployment target |
| `DEPLOY_WEBHOOK_TOKEN` | none    | Optional bearer token sent with the deployment webhook request                                  |

## Public Deployment Notes

Public mode fails closed for browser origins and destinations. A production host should set `PROXY_ALLOWED_ORIGINS` to the deployed HTTPS origin. `PROXY_ALLOWED_DESTINATIONS` is needed only for vetted MUD routes outside `shared/app-settings.ts`.

Malformed destination and origin entries are ignored. Malformed timeout values fall back to bounded defaults or are clamped to safe limits. Private/operator custom routing requires `PROXY_PUBLIC_MODE=false` or `PROXY_ALLOW_CUSTOM_DESTINATIONS=true`; even then, private, loopback, link-local, multicast, reserved, metadata-service, and banned-port targets remain blocked.
