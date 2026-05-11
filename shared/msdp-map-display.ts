import type { ConnectionStatus, MsdpVariableMap, MudState } from './mud.ts';
import {
  formatAvailabilityAriaLabel,
  isMsdpVariableConfigured,
} from './msdp-display.ts';
import type { DisplayAvailabilityNotice } from './msdp-display.ts';
import { buildRoomDisplayModel } from './msdp-room-display.ts';
import type {
  RoomDisplayModel,
  RoomExitModel,
  RoomIdentityFieldModel,
} from './msdp-room-display.ts';

export type MapDisplayState =
  | 'liveOverride'
  | 'fallback'
  | 'empty'
  | 'loading'
  | 'offline'
  | 'error'
  | 'disabled';

export type MapDisplaySource = 'minimapOverride' | 'roomFallback' | 'none';

export type MapFallbackIdentityField = {
  id: string;
  label: string;
  valueText: string;
  ariaLabel: string;
};

export type MapFallbackExit = {
  id: string;
  kind: 'exit' | 'raw';
  directionText: string;
  destinationText?: string;
  statusText?: string;
  rawText?: string;
  unknownFieldsText?: string;
  ariaLabel: string;
};

export type MapFallbackModel = {
  headingText: string;
  summaryText: string;
  identityFields: MapFallbackIdentityField[];
  exits: MapFallbackExit[];
  rawRoomText?: string;
  ariaLabel: string;
};

export type MapDisplayModel = {
  state: MapDisplayState;
  source: MapDisplaySource;
  availability: DisplayAvailabilityNotice;
  minimapText?: string;
  fallback?: MapFallbackModel;
  ariaLabel: string;
};

export function buildMapDisplayModel(
  mudState: MudState,
  status: ConnectionStatus,
  msdpVariables: MsdpVariableMap,
): MapDisplayModel {
  if (status === 'idle' || status === 'disconnected') {
    return buildUnavailableMapModel('offline', {
      title: 'Map offline',
      detail: 'Connect before room or minimap data can be evaluated.',
    });
  }

  if (status === 'error') {
    return buildUnavailableMapModel('error', {
      title: 'Map unavailable',
      detail: 'The connection ended before map data could be evaluated.',
    });
  }

  const minimapConfigured = isMsdpVariableConfigured(msdpVariables, 'minimap');
  const minimapText = normalizeMinimapText(mudState.minimap);

  if (minimapConfigured && minimapText) {
    const availability = createMapNotice('present', {
      title: 'Live MINIMAP override',
      detail: 'A configured MINIMAP override produced server map text.',
    });

    return {
      state: 'liveOverride',
      source: 'minimapOverride',
      availability,
      minimapText,
      ariaLabel: formatAvailabilityAriaLabel(availability),
    };
  }

  const roomDisplay = buildRoomDisplayModel(pickRoomState(mudState), status, msdpVariables);

  if (roomDisplay.state === 'present' || roomDisplay.state === 'raw') {
    const fallback = buildMapFallback(roomDisplay);
    const availability = createMapNotice('present', {
      title: 'Room/exits map fallback',
      detail:
        'Using source-confirmed room identity and exits while live MINIMAP is unavailable.',
    });

    return {
      state: 'fallback',
      source: 'roomFallback',
      availability,
      fallback,
      ariaLabel: fallback.ariaLabel,
    };
  }

  const roomMappingsConfigured = hasAnyRoomMapMapping(msdpVariables);

  if (!roomMappingsConfigured && !minimapConfigured) {
    return buildUnavailableMapModel('disabled', {
      title: 'Map data disabled',
      detail: 'Room MSDP mappings and MINIMAP override are not currently requested.',
    });
  }

  if (minimapConfigured && mudState.minimap !== undefined && !minimapText) {
    return buildUnavailableMapModel('empty', {
      title: 'Minimap empty',
      detail: 'The configured MINIMAP override arrived, but it did not contain displayable text.',
    });
  }

  if (roomDisplay.state === 'empty') {
    return buildUnavailableMapModel('empty', {
      title: 'Map fallback empty',
      detail:
        'Room MSDP values arrived, but no displayable room identity, exits, or raw room text were present.',
    });
  }

  if (!roomMappingsConfigured && minimapConfigured) {
    return buildUnavailableMapModel('loading', {
      title: 'Waiting for MINIMAP override',
      detail: 'A MINIMAP override is configured, but no live map payload has arrived.',
    });
  }

  return buildUnavailableMapModel('loading', {
    title: 'Waiting for room map data',
    detail:
      'Room MSDP variables are requested, but no room or exit payload has arrived in this session.',
  });
}

function pickRoomState(mudState: MudState): MudState {
  return {
    room: mudState.room,
    roomName: mudState.roomName,
    areaName: mudState.areaName,
    roomVnum: mudState.roomVnum,
    roomExits: mudState.roomExits,
    worldTime: mudState.worldTime,
  };
}

function buildMapFallback(roomDisplay: RoomDisplayModel): MapFallbackModel {
  const presentFields = roomDisplay.identityFields
    .filter((field) => field.availability.kind === 'present')
    .map(toMapIdentityField);
  const exits = roomDisplay.exits.map(toMapExit);
  const roomName = readFieldText(roomDisplay.identityFields, 'roomName');
  const areaName = readFieldText(roomDisplay.identityFields, 'areaName');
  const roomVnum = readFieldText(roomDisplay.identityFields, 'roomVnum');
  const worldTime = readFieldText(roomDisplay.identityFields, 'worldTime');
  const headingText = [roomName, areaName].filter(Boolean).join(' - ') || 'Room context';
  const summaryLines = [
    headingText,
    roomVnum ? `Room #${roomVnum}` : undefined,
    worldTime ? `World time: ${worldTime}` : undefined,
    exits.length > 0 ? `Exits: ${exits.map(formatExitSummary).join(', ')}` : undefined,
    roomDisplay.rawRoomText,
  ].filter((line): line is string => Boolean(line));
  const summaryText = summaryLines.join('\n');
  const ariaLabelParts = [
    'Room map fallback.',
    roomName ? `Room ${roomName}.` : undefined,
    areaName ? `Area ${areaName}.` : undefined,
    exits.length > 0 ? `${exits.length} ${exits.length === 1 ? 'exit' : 'exits'} available.` : undefined,
  ].filter(Boolean);

  return {
    headingText,
    summaryText,
    identityFields: presentFields,
    exits,
    rawRoomText: roomDisplay.rawRoomText,
    ariaLabel: ariaLabelParts.join(' '),
  };
}

function toMapIdentityField(field: RoomIdentityFieldModel): MapFallbackIdentityField {
  return {
    id: field.id,
    label: field.label,
    valueText: field.valueText,
    ariaLabel: field.ariaLabel,
  };
}

function toMapExit(exit: RoomExitModel): MapFallbackExit {
  return {
    id: exit.id,
    kind: exit.kind,
    directionText: exit.directionText,
    destinationText: exit.destinationText,
    statusText: exit.statusText,
    rawText: exit.rawText,
    unknownFieldsText: exit.unknownFieldsText,
    ariaLabel: exit.ariaLabel,
  };
}

function readFieldText(fields: RoomIdentityFieldModel[], id: RoomIdentityFieldModel['id']) {
  const field = fields.find((entry) => entry.id === id && entry.availability.kind === 'present');
  return field?.valueText;
}

function formatExitSummary(exit: MapFallbackExit) {
  if (exit.kind === 'raw') {
    return exit.rawText ? `${exit.directionText}: ${exit.rawText}` : exit.directionText;
  }

  const detail = [exit.destinationText, exit.statusText].filter(Boolean).join(', ');
  return detail ? `${exit.directionText} (${detail})` : exit.directionText;
}

function normalizeMinimapText(value: string | undefined) {
  const text = value?.trimEnd();
  return text && text.trim().length > 0 ? text : undefined;
}

function hasAnyRoomMapMapping(msdpVariables: MsdpVariableMap) {
  return (
    isMsdpVariableConfigured(msdpVariables, 'room') ||
    isMsdpVariableConfigured(msdpVariables, 'roomName') ||
    isMsdpVariableConfigured(msdpVariables, 'areaName') ||
    isMsdpVariableConfigured(msdpVariables, 'roomVnum') ||
    isMsdpVariableConfigured(msdpVariables, 'roomExits') ||
    isMsdpVariableConfigured(msdpVariables, 'worldTime')
  );
}

function buildUnavailableMapModel(
  state: Exclude<MapDisplayState, 'liveOverride' | 'fallback'>,
  notice: Omit<DisplayAvailabilityNotice, 'kind'>,
): MapDisplayModel {
  const kind = state === 'disabled' ? 'unavailable' : state;
  const availability = createMapNotice(kind, notice);

  return {
    state,
    source: 'none',
    availability,
    ariaLabel: formatAvailabilityAriaLabel(availability),
  };
}

function createMapNotice(
  kind: DisplayAvailabilityNotice['kind'],
  notice: Omit<DisplayAvailabilityNotice, 'kind'>,
): DisplayAvailabilityNotice {
  return {
    kind,
    ...notice,
  };
}
