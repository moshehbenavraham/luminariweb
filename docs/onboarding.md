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
- [ ] `npm test` passes.
- [ ] `node --import tsx --test tests/proxy-deployment-policy.test.ts` passes when changing public proxy deployment behavior.
- [ ] A selected preset or custom host can attempt a MUD connection and the terminal plus panels respond normally.
- [ ] Character, combat, group, affects, inventory, room, map, and quest tabs show explicit available, unavailable, or override-only states instead of blank placeholders.

## Required Secrets

No secrets are required for local development.

## First Files to Read

- `README.md` for commands and project map.
- `docs/ARCHITECTURE.md` for runtime flow.
- `docs/deployment.md` and `docs/bridge-deployment-options.md` for the supported public topology.
- `docs/runbooks/bridge-fallback.md` before considering any standalone bridge fallback.
- `shared/app-settings.ts` for ports, presets, and display defaults.
- `shared/README_shared.md` for shared display helper entry points.
- `tests/README.md` for current coverage and manual smoke expectations.
- `.spec_system/PRD/PRD.md` for roadmap and protocol decisions.

## Reference Boundaries

`EXAMPLES/` repositories are research inputs only. Do not copy source, service
files, Docker files, sample maps, command text, or configuration from bridge
projects into the product. Summarize behavior in original wording and keep the
integrated Luminari Web proxy as the default public `/ws` implementation unless
a future spec changes that boundary.
