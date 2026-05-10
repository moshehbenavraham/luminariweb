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

No CI/CD workflow is committed yet. Until one exists, release verification is local:

```bash
npm run lint
npm run build
curl http://localhost:5191/health
```

## Rollback

No automated rollback is configured in this repository. For PM2 deployment, keep the previous build artifact or git revision available, then redeploy that revision and restart the process.

Rollback when the health check fails after deploy, the app cannot establish WebSocket connections, or critical connection behavior regresses.
