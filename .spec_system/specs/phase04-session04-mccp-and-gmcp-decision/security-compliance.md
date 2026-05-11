# Security and Compliance Review

**Session ID**: `phase04-session04-mccp-and-gmcp-decision`
**Started**: 2026-05-11 11:29 IDT
**Last Updated**: 2026-05-11 11:38 IDT
**Status**: Complete

---

## Scope

This review covers documentation, shared protocol status metadata, and tests for
the MCCP and GMCP protocol direction decision. The session does not implement
runtime compression, decompression, GMCP parsing, GMCP module schemas, browser
state mapping, or transport changes.

---

## Privacy Review

- No commands from live users are added.
- No credentials, tokens, private hosts, character names, or terminal
  transcripts are added.
- Evidence is limited to repository paths, static code facts, and synthetic
  protocol descriptions.

---

## Security Review

### MCCP

- Current proxy behavior remains conservative: MCCP must stay unsupported until
  source compression, proxy decompression, failure handling, reconnect cleanup,
  and tests exist.
- Compression support must not be claimed from negotiation constants or source
  framework placeholders alone.
- ADR 0002 rejects MCCP for the current Luminari Web path.
- Future MCCP work must include decompressor cleanup, corrupt-stream failures,
  reconnect reset coverage, and sanitized connection-status errors.

### GMCP

- Current web behavior remains conservative: GMCP must stay unsupported until
  module names, versions, JSON schemas, parser behavior, client mappings,
  coexistence with MSDP, and fixtures exist.
- GMCP payloads must be treated as untrusted input in any future parser.
- ADR 0002 defers GMCP for the web client and proxy.
- Future GMCP work must validate all module payloads before they update shared
  state or UI.

---

## Validation Gates

### MCCP Future Gate

- Source `CompressStart()` and `CompressEnd()` are implemented and tested.
- Source zlib integration is explicit and `USING_MCCP` is not enabled before
  validation passes.
- Proxy decompression occurs before Telnet text/MSDP parsing.
- Corrupt compressed bytes, inflate failures, timeouts, and disconnects produce
  sanitized connection-status messages.
- Reconnect tests cover compressed, uncompressed, and rollback paths.

### GMCP Future Gate

- Source modules have names, versions, owners, payload schemas, and update
  timing.
- Proxy parser validates GMCP frames without breaking MSDP, text, TTYPE, NAWS,
  or unsupported options.
- Client state mapping has typed contracts and fixtures for empty, partial,
  malformed, nested, oversized, and reconnect-sensitive payloads.
- MSDP coexistence defines precedence and rollback before any panel migration.

---

## Behavioral Quality Checklist

- Resource cleanup: N/A for documentation/status session.
- Duplicate action prevention: N/A for documentation/status session.
- State freshness on re-entry: N/A for documentation/status session.
- Trust boundary enforcement: Relevant to future GMCP/MCCP follow-ups and
  documented as a validation gate.
- Failure path completeness: Relevant to future decompression/parser support and
  documented as a validation gate.
- Concurrency safety: N/A for documentation/status session.
- External dependency resilience: N/A for documentation/status session.
- Contract alignment: Active; docs, shared status records, and tests must agree.
- Error information boundaries: Active for future runtime follow-ups.
- Accessibility and platform compliance: N/A for documentation/status session.

---

## Findings

- No runtime protocol behavior was added.
- No browser persistence or `/ws` message shape changed.
- No private data or live transcript evidence was added.
- Current conservative claims are preserved: MCCP is rejected and GMCP is
  deferred.
- Remaining verification is test/build/lint execution and ASCII/LF validation.
