# Shared Types and Settings

Shared TypeScript module used by both the React client and Node proxy server.

## Key Files

- `app-settings.ts` defines ports, MUD presets, and personalization text.
- `mud.ts` defines browser/server message types, MUD state shape, default MSDP variable mappings, and mapping normalization.

## Run Commands

| Command         | Purpose                                |
| --------------- | -------------------------------------- |
| `npm run lint`  | Check shared TypeScript through ESLint |
| `npm run build` | Type-check and compile shared code     |

Keep shared contracts backward-compatible with the browser and server in the same change.
