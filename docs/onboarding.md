# Onboarding

## Prerequisites

- [ ] Node.js and npm installed.
- [ ] Git installed.
- [ ] Network access to at least one configured MUD host if testing live connections.

## Setup

```bash
git clone https://github.com/moshehbenavraham/luminariweb.git
cd luminariweb
npm install
npm run dev
```

Open `http://localhost:5190`.

## Verify Setup

- [ ] `npm run dev` starts the Vite client and Node proxy.
- [ ] `curl http://localhost:5191/health` returns `{ "ok": true }`.
- [ ] The browser loads the app at `http://localhost:5190`.
- [ ] A selected preset or custom host can attempt a MUD connection.

## Required Secrets

No secrets are required for local development.

## First Files to Read

- `README.md` for commands and project map.
- `docs/ARCHITECTURE.md` for runtime flow.
- `shared/app-settings.ts` for ports, presets, and display defaults.
- `.spec_system/PRD/PRD.md` for roadmap and protocol decisions.
