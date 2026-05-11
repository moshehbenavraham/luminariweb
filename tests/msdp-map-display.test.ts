import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultMsdpVariables, normalizeMsdpVariableMap } from '../shared/mud.ts';
import type { MsdpVariableMap } from '../shared/mud.ts';
import { buildMapDisplayModel } from '../shared/msdp-map-display.ts';

const defaultMap = normalizeMsdpVariableMap(defaultMsdpVariables);

test('builds a deterministic room and exits fallback when MINIMAP is absent', () => {
  const model = buildMapDisplayModel(
    {
      roomName: 'Hall of Fixtures',
      areaName: 'Test Keep',
      roomVnum: 1001,
      worldTime: 'Day 12',
      roomExits: {
        south: 1003,
        north: 1002,
        portal: {
          destination: 'Astral Gate',
          status: 'uncertain',
        },
      },
    },
    'connected',
    defaultMap,
  );

  assert.equal(model.state, 'fallback');
  assert.equal(model.source, 'roomFallback');
  assert.equal(model.availability.kind, 'present');
  assert.equal(model.fallback?.headingText, 'Hall of Fixtures - Test Keep');
  assert.deepEqual(
    model.fallback?.identityFields.map((field) => [field.id, field.valueText]),
    [
      ['roomName', 'Hall of Fixtures'],
      ['areaName', 'Test Keep'],
      ['roomVnum', '1,001'],
      ['worldTime', 'Day 12'],
    ],
  );
  assert.deepEqual(
    model.fallback?.exits.map((exit) => [exit.directionText, exit.destinationText, exit.statusText]),
    [
      ['North', '1,002', undefined],
      ['South', '1,003', undefined],
      ['Portal', 'Astral Gate', 'uncertain'],
    ],
  );
  assert.match(model.fallback?.summaryText ?? '', /Exits: North \(1,002\), South \(1,003\)/);
});

test('uses live MINIMAP only when a configured override provides text', () => {
  const unconfigured = buildMapDisplayModel(
    {
      minimap: 'server minimap',
    },
    'connected',
    defaultMap,
  );
  const configuredMap: MsdpVariableMap = { ...defaultMap, minimap: 'MINIMAP' };
  const configured = buildMapDisplayModel(
    {
      minimap: 'server minimap\n  north',
    },
    'connected',
    configuredMap,
  );

  assert.notEqual(unconfigured.state, 'liveOverride');
  assert.equal(unconfigured.state, 'loading');
  assert.equal(configured.state, 'liveOverride');
  assert.equal(configured.source, 'minimapOverride');
  assert.equal(configured.minimapText, 'server minimap\n  north');
});

test('keeps disabled, loading, empty, offline, and error map states distinct', () => {
  const disabledMap: MsdpVariableMap = {
    ...defaultMap,
    room: '',
    roomName: '',
    areaName: '',
    roomVnum: '',
    roomExits: '',
    worldTime: '',
    minimap: '',
  };
  const minimapOnlyMap: MsdpVariableMap = {
    ...disabledMap,
    minimap: 'MINIMAP',
  };

  assert.equal(buildMapDisplayModel({}, 'connected', disabledMap).state, 'disabled');
  assert.equal(buildMapDisplayModel({}, 'connected', defaultMap).state, 'loading');
  assert.equal(
    buildMapDisplayModel({ minimap: '   ' }, 'connected', minimapOnlyMap).state,
    'empty',
  );
  assert.equal(buildMapDisplayModel({ room: {}, roomExits: [] }, 'connected', defaultMap).state, 'empty');
  assert.equal(buildMapDisplayModel({}, 'idle', defaultMap).state, 'offline');
  assert.equal(buildMapDisplayModel({}, 'disconnected', defaultMap).state, 'offline');
  assert.equal(buildMapDisplayModel({}, 'error', defaultMap).state, 'error');
});

test('preserves raw room and malformed exit fallback text without treating it as MINIMAP', () => {
  const model = buildMapDisplayModel(
    {
      room: 'Raw room description',
      roomExits: 'north=??; east={vnum',
    },
    'connected',
    defaultMap,
  );

  assert.equal(model.state, 'fallback');
  assert.equal(model.source, 'roomFallback');
  assert.equal(model.fallback?.rawRoomText, 'Raw room description');
  assert.equal(model.fallback?.exits.length, 1);
  assert.equal(model.fallback?.exits[0].kind, 'raw');
  assert.equal(model.fallback?.exits[0].rawText, 'north=??; east={vnum');
});
