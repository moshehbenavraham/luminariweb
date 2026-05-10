# Development Guide

## Required Tools

- Node.js with npm.
- Git.

## Port Mappings

| Service          | Port | URL                     |
| ---------------- | ---- | ----------------------- |
| Vite frontend    | 5190 | `http://localhost:5190` |
| Proxy/API server | 5191 | `http://localhost:5191` |
| Vite preview     | 5192 | `http://localhost:5192` |

Ports are configured in `shared/app-settings.ts`.

## Dev Scripts

| Command              | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Run the frontend and proxy together              |
| `npm run dev:client` | Run Vite only                                    |
| `npm run dev:server` | Run the proxy server with `tsx watch`            |
| `npm run lint`       | Run ESLint                                       |
| `npm run build`      | Type-check and build client/server output        |
| `npm run preview`    | Preview built frontend assets                    |
| `npm start`          | Run the built server from `dist/server/index.js` |

## Local Workflow

1. Install dependencies with `npm install`.
2. Start both services with `npm run dev`.
3. Edit React code in `src/`, proxy code in `server/`, or shared contracts in `shared/`.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Run `npm test` for the fixture-backed MSDP state tests.

## Testing

Run the focused test suite with:

```bash
npm test
```

The test script uses Node's built-in `node:test` runner with the existing `tsx` loader. Current coverage focuses on MSDP variable-map normalization, configured-variable filtering, pure MSDP state mapping, and fixture-driven state-mapping checks.

Phase 00 added the fixture and state-mapping test foundations. Telnet parser hardening, reconnect lifecycle coverage, and browser-level UI verification remain separate work.

## Generated Output

`dist/` is build output and is ignored by git. `node_modules/` is dependency output and is ignored by git.
