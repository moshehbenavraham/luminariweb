# Phase 04 Quest MSDP Follow-Up

## Current Status

`QUEST_INFO` is not present in the audited Luminari-Source `VariableNameTable`, so the first-release web client must treat structured quest data as unavailable unless a user explicitly configures an override for a server that emits it.

The client should not parse free-form quest command output. Quest prose can change by area, language, staff customization, or player state, and parsing it would create brittle behavior that appears authoritative when it is not source-backed.

## Preferred Source-Level Path

Add a structured quest MSDP variable in Luminari-Source only after the server owns the payload contract. The tentative variable name can remain `QUEST_INFO` if it is added to the source variable table and emitted through the same MSDP reporting path as other source-confirmed values.

## Payload Shape Questions

- Should the payload be an array of active quest records, a table keyed by quest id, or a table grouped by quest status?
- Which identifiers are stable enough for client display and tests: quest vnum, quest name, journal id, giver id, or area id?
- Which progress fields are authoritative: completed count, required count, target name, target vnum, area, expiration time, and completion state?
- Should hidden, completed, failed, timed, daily, or repeatable quests be included?
- Which strings may contain Luminari color codes and require the client renderer path?
- Which fields are guaranteed numeric, and which are display strings only?

## Fixture Requirements

- Empty quest collection.
- One active quest with name, type, vnum, and simple progress.
- Multiple active quests with distinct statuses.
- Quest with target rows or nested objective rows.
- Quest with zero completed progress and completed progress.
- Quest with color-coded name or target text.
- Malformed or partial payload that preserves safe display without throwing.
- Reconnect fixture proving stale quest state clears when the connection resets.

## Client Acceptance Notes

- Keep `QUEST_INFO` disabled in the default MSDP request map until source support exists.
- Add parser, mapping, display-helper, and UI tests in the same source-support session.
- Continue using `renderMudHtml` for text emitted by the server.
- Do not add cookie-persisted quest preferences unless the persistence posture changes.
