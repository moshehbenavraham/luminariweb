export const PROTOCOL_FEATURE_STATUSES = [
  'supported',
  'partial',
  'rejected',
  'deferred',
  'validation-gap',
] as const;

export type ProtocolFeatureStatus = (typeof PROTOCOL_FEATURE_STATUSES)[number];

export const PROTOCOL_FEATURE_STATUS_LABELS = {
  supported: 'Supported',
  partial: 'Partial',
  rejected: 'Rejected',
  deferred: 'Deferred',
  'validation-gap': 'Validation gap',
} as const satisfies Record<ProtocolFeatureStatus, string>;

export const PROTOCOL_FEATURE_GROUPS = [
  {
    id: 'terminal',
    title: 'Terminal and text',
    summary: 'Client-visible terminal capabilities currently handled by the proxy and renderer.',
  },
  {
    id: 'telnet',
    title: 'Telnet negotiation',
    summary: 'Telnet options that are accepted, answered, or rejected by the current proxy.',
  },
  {
    id: 'state',
    title: 'Game state protocols',
    summary: 'Structured game-state capabilities and source-validation boundaries.',
  },
  {
    id: 'source',
    title: 'Source-level follow-ups',
    summary: 'Protocol work that needs Luminari-Source decisions before support can be claimed.',
  },
] as const;

export type ProtocolFeatureGroupId = (typeof PROTOCOL_FEATURE_GROUPS)[number]['id'];

export const PROTOCOL_FEATURE_FOLLOW_UP_TAGS = [
  'p4-source-todo-audit',
  'p4-parser-harness',
  'p4-missing-msdp-variables',
  'p4-mccp-gmcp-decision',
  'p4-native-websocket-feasibility',
] as const;

export type ProtocolFollowUpTag = (typeof PROTOCOL_FEATURE_FOLLOW_UP_TAGS)[number];

export const PROTOCOL_FOLLOW_UP_LABELS = {
  'p4-source-todo-audit': 'P4-S1 source TODO audit',
  'p4-parser-harness': 'P4-S2 parser harness',
  'p4-missing-msdp-variables': 'P4-S3 missing MSDP variables',
  'p4-mccp-gmcp-decision': 'P4-S4 MCCP and GMCP decision',
  'p4-native-websocket-feasibility': 'P4-S5 native WebSocket feasibility',
} as const satisfies Record<ProtocolFollowUpTag, string>;

export type ProtocolEvidenceKind = 'source' | 'code' | 'test' | 'doc' | 'spec' | 'gap';

export type ProtocolFeatureEvidence = {
  kind: ProtocolEvidenceKind;
  label: string;
  path: string;
};

export type ProtocolFeatureRecord = {
  id: string;
  name: string;
  groupId: ProtocolFeatureGroupId;
  status: ProtocolFeatureStatus;
  scope: string;
  summary: string;
  detail: string;
  nextAction: string;
  evidence: readonly ProtocolFeatureEvidence[];
  followUpTags: readonly ProtocolFollowUpTag[];
};

export const REQUIRED_PROTOCOL_FEATURE_IDS = [
  'ansi',
  'colors-256',
  'utf-8',
  'ttype',
  'naws',
  'msdp',
  'gmcp',
  'mxp',
  'msp',
  'mccp',
  'mssp',
  'charset',
] as const;

export type RequiredProtocolFeatureId = (typeof REQUIRED_PROTOCOL_FEATURE_IDS)[number];

export const protocolFeatureRecords = [
  {
    id: 'ansi',
    name: 'ANSI terminal text',
    groupId: 'terminal',
    status: 'supported',
    scope: 'client renderer and proxy text stream',
    summary: 'ANSI-colored terminal output is rendered through the escaped terminal renderer path.',
    detail:
      'The proxy forwards terminal text, and the browser renders escaped ANSI output without adding a raw HTML path.',
    nextAction: 'Keep renderer tests passing when terminal output changes.',
    evidence: [
      {
        kind: 'test',
        label: 'Terminal renderer ANSI and escaping tests',
        path: 'tests/terminal-renderer.test.ts',
      },
      {
        kind: 'doc',
        label: 'Architecture terminal rendering section',
        path: 'docs/ARCHITECTURE.md',
      },
    ],
    followUpTags: [],
  },
  {
    id: 'colors-256',
    name: '256-color client flag',
    groupId: 'terminal',
    status: 'partial',
    scope: 'MSDP client capability announcement',
    summary:
      'The proxy advertises 256-color capability through MSDP, but renderer coverage is ANSI-focused.',
    detail:
      'The session can claim the outbound capability flag and current terminal rendering path, not a complete live server color matrix.',
    nextAction:
      'Add source/live capture evidence before claiming broad 256-color protocol coverage.',
    evidence: [
      {
        kind: 'code',
        label: 'MSDP initialization sends 256_COLORS',
        path: 'server/mud-session.ts',
      },
      {
        kind: 'test',
        label: 'Terminal renderer color conversion tests',
        path: 'tests/terminal-renderer.test.ts',
      },
    ],
    followUpTags: ['p4-parser-harness'],
  },
  {
    id: 'utf-8',
    name: 'UTF-8 text decoding',
    groupId: 'terminal',
    status: 'supported',
    scope: 'proxy parser and MSDP capability announcement',
    summary:
      'The Telnet parser decodes text with UTF-8 and the proxy advertises `UTF_8` over MSDP.',
    detail:
      'Existing parser tests preserve UTF-8 decoder state across doubled IAC handling; this does not claim source text normalization beyond UTF-8 decoding.',
    nextAction: 'Keep parser tests covering split control bytes and UTF-8 text boundaries.',
    evidence: [
      {
        kind: 'code',
        label: 'Telnet parser uses StringDecoder utf8',
        path: 'server/telnet-parser.ts',
      },
      {
        kind: 'test',
        label: 'Doubled IAC and UTF-8 parser test',
        path: 'tests/telnet-parser-edge-cases.test.ts',
      },
    ],
    followUpTags: [],
  },
  {
    id: 'ttype',
    name: 'TTYPE',
    groupId: 'telnet',
    status: 'supported',
    scope: 'proxy Telnet negotiation',
    summary: 'The proxy agrees to TTYPE and replies to SEND with the web client name.',
    detail:
      'This is a fixed identity response, not a user-configurable terminal type negotiation system.',
    nextAction: 'Keep parser tests covering TTYPE negotiation and subnegotiation.',
    evidence: [
      {
        kind: 'code',
        label: 'TTYPE negotiation and SEND response',
        path: 'server/telnet-parser.ts',
      },
      {
        kind: 'test',
        label: 'TTYPE parser edge-case test',
        path: 'tests/telnet-parser-edge-cases.test.ts',
      },
    ],
    followUpTags: ['p4-parser-harness'],
  },
  {
    id: 'naws',
    name: 'NAWS',
    groupId: 'telnet',
    status: 'supported',
    scope: 'proxy Telnet negotiation and browser resize path',
    summary:
      'The proxy negotiates NAWS and sends bounded terminal dimensions after support is known.',
    detail:
      'Resize updates are scoped to active sessions and stop after disconnect or before NAWS negotiation.',
    nextAction:
      'Keep lifecycle and parser resize tests passing when layout changes affect dimensions.',
    evidence: [
      {
        kind: 'code',
        label: 'NAWS negotiation and dimension bounds',
        path: 'server/telnet-parser.ts',
      },
      {
        kind: 'test',
        label: 'Dynamic NAWS and lifecycle tests',
        path: 'tests/proxy-lifecycle.test.ts',
      },
    ],
    followUpTags: ['p4-parser-harness'],
  },
  {
    id: 'msdp',
    name: 'MSDP',
    groupId: 'state',
    status: 'supported',
    scope: 'proxy parser, state mapping, and fixture-backed client panels',
    summary:
      'MSDP is the current game-state integration path for source-confirmed variables and configured overrides.',
    detail:
      'The client maps source-confirmed variables into shared state and keeps override-only values disabled by default.',
    nextAction:
      'Use Phase 04 source work for missing variables and live schema confirmation; do not treat synthetic fixtures as live proof.',
    evidence: [
      {
        kind: 'code',
        label: 'Default, confirmed, optional, and override-only MSDP maps',
        path: 'shared/mud.ts',
      },
      {
        kind: 'test',
        label: 'MSDP parser, mapping, fixture, and display tests',
        path: 'tests/README.md',
      },
    ],
    followUpTags: ['p4-missing-msdp-variables'],
  },
  {
    id: 'gmcp',
    name: 'GMCP',
    groupId: 'source',
    status: 'deferred',
    scope: 'Luminari-Source and proxy future work',
    summary: 'GMCP is not supported by the web client or proxy today.',
    detail:
      'The PRD records source negotiation and send/parse functions, but not a full modern JSON module API or proxy/client contract.',
    nextAction:
      'Decide GMCP direction in Phase 04 before adding server, proxy, or client behavior.',
    evidence: [
      {
        kind: 'spec',
        label: 'Source protocol facts and Phase 04 GMCP decision',
        path: '.spec_system/PRD/PRD.md',
      },
      {
        kind: 'gap',
        label: 'No web client GMCP parser, message contract, or tests',
        path: 'tests/README.md',
      },
    ],
    followUpTags: ['p4-source-todo-audit', 'p4-parser-harness', 'p4-mccp-gmcp-decision'],
  },
  {
    id: 'mxp',
    name: 'MXP',
    groupId: 'telnet',
    status: 'rejected',
    scope: 'proxy Telnet negotiation',
    summary: 'The proxy rejects MXP negotiation.',
    detail:
      'Rejecting MXP avoids exposing markup-like server output as trusted UI behavior before a dedicated security and parser design exists.',
    nextAction:
      'Keep rejecting MXP unless a future source/proxy/UI session designs and tests safe behavior.',
    evidence: [
      {
        kind: 'code',
        label: 'MXP rejected with WONT',
        path: 'server/telnet-parser.ts',
      },
      {
        kind: 'spec',
        label: 'Phase 03 checklist excludes MXP implementation',
        path: '.spec_system/PRD/phase_03/session_06_protocol_feature_checklist.md',
      },
    ],
    followUpTags: ['p4-source-todo-audit', 'p4-parser-harness'],
  },
  {
    id: 'msp',
    name: 'MSP',
    groupId: 'source',
    status: 'deferred',
    scope: 'Luminari-Source and browser media future work',
    summary: 'MSP is source-side protocol code only; the web client has no sound contract.',
    detail:
      'The current client does not request, parse, play, persist, or permission audio protocol data.',
    nextAction:
      'Defer until product requirements define browser audio behavior, permissions, and tests.',
    evidence: [
      {
        kind: 'spec',
        label: 'Source facts mention MSP negotiation code',
        path: '.spec_system/PRD/PRD.md',
      },
      {
        kind: 'gap',
        label: 'No MSP client contract or tests',
        path: 'tests/README.md',
      },
    ],
    followUpTags: ['p4-source-todo-audit'],
  },
  {
    id: 'mccp',
    name: 'MCCP',
    groupId: 'telnet',
    status: 'rejected',
    scope: 'proxy Telnet negotiation',
    summary: 'The proxy rejects MCCP today.',
    detail:
      'The PRD records Luminari-Source compression functions as stubs, and the proxy has no decompression path.',
    nextAction:
      'Keep rejecting MCCP until both server compression and proxy decompression are real and tested.',
    evidence: [
      {
        kind: 'code',
        label: 'MCCP rejected with DONT',
        path: 'server/telnet-parser.ts',
      },
      {
        kind: 'spec',
        label: 'MCCP source stubs and Phase 04 decision',
        path: '.spec_system/PRD/PRD.md',
      },
      {
        kind: 'test',
        label: 'Parser negotiation test covers MCCP rejection',
        path: 'tests/telnet-parser-edge-cases.test.ts',
      },
    ],
    followUpTags: ['p4-source-todo-audit', 'p4-parser-harness', 'p4-mccp-gmcp-decision'],
  },
  {
    id: 'mssp',
    name: 'MSSP',
    groupId: 'source',
    status: 'validation-gap',
    scope: 'source protocol evidence only',
    summary: 'The PRD records MSSP in Luminari-Source, but this client does not consume it.',
    detail:
      'No proxy negotiation path, UI surface, or tests currently depend on MSSP data, so web support is unvalidated.',
    nextAction:
      'Document whether the web client needs MSSP before implementing parser or UI behavior.',
    evidence: [
      {
        kind: 'spec',
        label: 'Source protocol facts record MSSP implementation',
        path: '.spec_system/PRD/PRD.md',
      },
      {
        kind: 'gap',
        label: 'No web client MSSP parser, UI, or tests',
        path: 'tests/README.md',
      },
    ],
    followUpTags: ['p4-source-todo-audit', 'p4-parser-harness'],
  },
  {
    id: 'charset',
    name: 'CHARSET',
    groupId: 'telnet',
    status: 'rejected',
    scope: 'proxy Telnet negotiation',
    summary: 'The proxy rejects CHARSET negotiation and keeps UTF-8 decoding fixed.',
    detail:
      'The client does not implement CHARSET negotiation, fallback encodings, or source-side charset policy.',
    nextAction:
      'Keep rejecting CHARSET unless Phase 04 defines a tested encoding negotiation plan.',
    evidence: [
      {
        kind: 'code',
        label: 'CHARSET rejected with WONT',
        path: 'server/telnet-parser.ts',
      },
      {
        kind: 'test',
        label: 'Parser negotiation test covers CHARSET rejection',
        path: 'tests/telnet-parser-edge-cases.test.ts',
      },
    ],
    followUpTags: ['p4-source-todo-audit', 'p4-parser-harness'],
  },
  {
    id: 'override-only-msdp-fields',
    name: 'Override-only MSDP fields',
    groupId: 'state',
    status: 'validation-gap',
    scope: 'client configuration and future source variables',
    summary:
      '`TITLE`, saves, live `DAMAGE_BONUS`, `MINIMAP`, and `QUEST_INFO` are not requested by default.',
    detail:
      'These fields are kept as explicit disabled mappings or source gaps so UI panels do not claim server support without source confirmation.',
    nextAction:
      'Use Phase 04 missing-variable work for any selected source additions and payload fixtures.',
    evidence: [
      {
        kind: 'code',
        label: 'Override-only MSDP variable keys',
        path: 'shared/mud.ts',
      },
      {
        kind: 'spec',
        label: 'PRD mismatches and quest follow-up notes',
        path: '.spec_system/PRD/PRD.md',
      },
      {
        kind: 'doc',
        label: 'Quest MSDP follow-up',
        path: '.spec_system/specs/phase02-session06-map-and-quest-fallback-strategy/phase04-quest-msdp-follow-up.md',
      },
    ],
    followUpTags: ['p4-missing-msdp-variables'],
  },
  {
    id: 'native-websocket',
    name: 'Native source WebSocket',
    groupId: 'source',
    status: 'deferred',
    scope: 'Luminari-Source future transport decision',
    summary:
      'The current supported app transport remains the integrated proxy and `/ws` application protocol.',
    detail:
      'The PRD records no native WebSocket listener in Luminari-Source, and bridge docs reject blind byte bridges as `/ws` replacements.',
    nextAction:
      'Evaluate native WebSocket feasibility in Phase 04 without replacing the current proxy first.',
    evidence: [
      {
        kind: 'doc',
        label: 'Bridge deployment decision',
        path: 'docs/bridge-deployment-options.md',
      },
      {
        kind: 'spec',
        label: 'Phase 04 native WebSocket feasibility session',
        path: '.spec_system/PRD/PRD.md',
      },
    ],
    followUpTags: ['p4-native-websocket-feasibility'],
  },
] as const satisfies readonly ProtocolFeatureRecord[];

export type ProtocolFeatureId = (typeof protocolFeatureRecords)[number]['id'];

export type ProtocolFeatureGroup = {
  group: (typeof PROTOCOL_FEATURE_GROUPS)[number];
  features: ProtocolFeatureRecord[];
};

export function getProtocolFeaturesByGroup(): ProtocolFeatureGroup[] {
  return PROTOCOL_FEATURE_GROUPS.map((group) => ({
    group,
    features: protocolFeatureRecords.filter((feature) => feature.groupId === group.id),
  }));
}

export function getProtocolFeaturesByStatus(
  status: ProtocolFeatureStatus,
): ProtocolFeatureRecord[] {
  return protocolFeatureRecords.filter((feature) => feature.status === status);
}

export function getProtocolStatusCounts(): Record<ProtocolFeatureStatus, number> {
  return PROTOCOL_FEATURE_STATUSES.reduce(
    (counts, status) => ({
      ...counts,
      [status]: getProtocolFeaturesByStatus(status).length,
    }),
    createEmptyStatusCounts(),
  );
}

export function isRequiredProtocolFeatureId(
  featureId: string,
): featureId is RequiredProtocolFeatureId {
  return (REQUIRED_PROTOCOL_FEATURE_IDS as readonly string[]).includes(featureId);
}

function createEmptyStatusCounts(): Record<ProtocolFeatureStatus, number> {
  return {
    supported: 0,
    partial: 0,
    rejected: 0,
    deferred: 0,
    'validation-gap': 0,
  };
}
