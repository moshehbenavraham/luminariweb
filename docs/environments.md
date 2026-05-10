# Environments

## Environment Matrix

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | `http://localhost:5190` and `http://localhost:5191` | Local frontend and proxy development |
| Preview | `http://localhost:5192` | Local preview of built frontend assets |
| Production | Not defined in repo | Operator-hosted built app and proxy |

## Configuration Differences

| Config | Development | Preview | Production |
|--------|-------------|---------|------------|
| Frontend serving | Vite dev server | Vite preview | Express static server |
| Proxy/API | `tsx watch server/index.ts` | Separate server required for `/ws` and `/api/settings` | `node dist/server/index.js` |
| WebSocket URL | Same-origin `/ws` through Vite proxy | `VITE_WS_URL` if needed | Same-origin `/ws` by default |
| Server port | `shared/app-settings.ts` or `PORT` | Depends on proxy process | `PORT` or `shared/app-settings.ts` |

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `5191` | Override the Express and WebSocket server port |
| `VITE_WS_URL` | same-origin `/ws` | Override the browser WebSocket target |

## Public Deployment Notes

The current code accepts manual host and port input after basic validation. The PRD requires stronger public proxy policy before public deployment, including allowlisted destinations, origin checks, private-network blocking, connection quotas, rate limits, timeouts, and command-log redaction.
