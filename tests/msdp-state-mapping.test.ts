import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultMsdpVariables, normalizeMsdpVariableMap } from '../shared/mud.ts';
import { mapMsdpUpdate } from '../shared/msdp-state.ts';
import type { MsdpVariableMap, MudState, MudValue } from '../shared/mud.ts';

const defaultMap = normalizeMsdpVariableMap(defaultMsdpVariables);

test('maps metadata and character scalar fields', () => {
  assert.deepEqual(
    mapPairs([
      ['SERVER_ID', 'LuminariMUD'],
      ['SERVER_TIME', 1710000000],
      ['SNIPPET_VERSION', 8],
      ['CHARACTER_NAME', 'Fixture Tester'],
      ['LEVEL', '17'],
      ['RACE', 'human'],
      ['CLASS', 'wizard'],
      ['STR', 10],
      ['DEX', 11],
      ['CON', 12],
      ['INT', 18],
      ['WIS', 16],
      ['CHA', 14],
    ]),
    {
      serverId: 'LuminariMUD',
      serverTime: 1710000000,
      snippetVersion: 8,
      characterName: 'Fixture Tester',
      level: 17,
      race: 'human',
      className: 'wizard',
      strength: 10,
      dexterity: 11,
      constitution: 12,
      intelligence: 18,
      wisdom: 16,
      charisma: 14,
    },
  );
});

test('maps resources, combat, economy, position, and zero values', () => {
  assert.deepEqual(
    mapPairs([
      ['HEALTH', '0'],
      ['HEALTH_MAX', 120],
      ['PSP', 34],
      ['PSP_MAX', 44],
      ['MOVEMENT', 91],
      ['MOVEMENT_MAX', 110],
      ['EXPERIENCE', 451200],
      ['EXPERIENCE_MAX', 500000],
      ['EXPERIENCE_TNL', 48800],
      ['ATTACK_BONUS', -2],
      ['AC', 0],
      ['OPPONENT_NAME', 'training dummy'],
      ['OPPONENT_HEALTH', 25],
      ['OPPONENT_HEALTH_MAX', 100],
      ['TANK_NAME', 'Shield Ally'],
      ['TANK_HEALTH', 80],
      ['TANK_HEALTH_MAX', 100],
      ['MONEY', 12345],
      ['PRACTICE', 7],
      ['POSITION', 'fighting'],
      ['ALIGNMENT', 'neutral good'],
    ]),
    {
      health: 0,
      healthMax: 120,
      psp: 34,
      pspMax: 44,
      movement: 91,
      movementMax: 110,
      experience: 451200,
      experienceMax: 500000,
      experienceTnl: 48800,
      attackBonus: -2,
      armorClass: 0,
      opponentName: 'training dummy',
      opponentHealth: 25,
      opponentHealthMax: 100,
      tankName: 'Shield Ally',
      tankHealth: 80,
      tankHealthMax: 100,
      money: 12345,
      practice: 7,
      position: 'fighting',
      alignment: 'neutral good',
    },
  );
});

test('maps nonnumeric numeric values to undefined fields', () => {
  assert.deepEqual(mapMsdpUpdate('HEALTH', 'bad-value', defaultMap), { health: undefined });
  assert.deepEqual(mapMsdpUpdate('SERVER_TIME', { time: 1 }, defaultMap), {
    serverTime: undefined,
  });
});

test('preserves structured room and collection payloads without lossy coercion', () => {
  const room = {
    name: 'Hall of Fixtures',
    exits: {
      north: 1002,
      east: 'closed',
    },
  };
  const exits = {
    north: 1002,
    down: 'closed',
  };
  const actions = ['standard', { name: 'quick draw', cost: 1 }];
  const inventory = {
    worn: ['practice robe'],
    carried: {
      torch: 2,
    },
  };
  const affects = [
    {
      name: 'haste',
      duration: 3,
    },
  ];
  const group = [
    {
      name: 'Fixture Ally',
      health: 42,
    },
  ];
  const questInfo = {
    title: 'Synthetic Quest',
    steps: ['start', 'finish'],
  };
  const overrideMap = withOverrides({ questInfo: 'QUEST_INFO' });

  assert.deepEqual(mapMsdpUpdate('ROOM', room, defaultMap), { room });
  assert.deepEqual(mapMsdpUpdate('ROOM_EXITS', exits, defaultMap), { roomExits: exits });
  assert.deepEqual(mapMsdpUpdate('ACTIONS', actions, defaultMap), { actions });
  assert.deepEqual(mapMsdpUpdate('INVENTORY', inventory, defaultMap), { inventory });
  assert.deepEqual(mapMsdpUpdate('AFFECTS', affects, defaultMap), { affects });
  assert.deepEqual(mapMsdpUpdate('GROUP', group, defaultMap), { group });
  assert.deepEqual(mapMsdpUpdate('QUEST_INFO', questInfo, overrideMap), { questInfo });
});

test('ignores unknown variables, blank mappings, and unsupported defaults', () => {
  assert.deepEqual(mapMsdpUpdate('UNKNOWN_VARIABLE', 1, defaultMap), {});
  assert.deepEqual(mapMsdpUpdate('TITLE', 'the brave', defaultMap), {});
  assert.deepEqual(mapMsdpUpdate('FORTITUDE', 10, defaultMap), {});
  assert.deepEqual(mapMsdpUpdate('DAMAGE_BONUS', 3, defaultMap), {});
  assert.deepEqual(mapMsdpUpdate('MINIMAP', 'map text', defaultMap), {});
  assert.deepEqual(mapMsdpUpdate('QUEST_INFO', { title: 'ignored' }, defaultMap), {});
});

test('maps override-only variables when settings explicitly configure them', () => {
  const overrideMap = withOverrides({
    title: 'TITLE',
    fortitude: 'FORTITUDE',
    reflex: 'REFLEX',
    willpower: 'WILLPOWER',
    damageBonus: 'DAMAGE_BONUS',
    minimap: 'MINIMAP',
    questInfo: 'QUEST_INFO',
  });
  const questInfo = {
    title: 'Override Quest',
    complete: false,
  };

  assert.deepEqual(
    mapPairs(
      [
        ['TITLE', 'the brave'],
        ['FORTITUDE', '9'],
        ['REFLEX', 8],
        ['WILLPOWER', 7],
        ['DAMAGE_BONUS', 4],
        ['MINIMAP', 'map text'],
        ['QUEST_INFO', questInfo],
      ],
      overrideMap,
    ),
    {
      title: 'the brave',
      fortitude: 9,
      reflex: 8,
      willpower: 7,
      damageBonus: 4,
      minimap: 'map text',
      questInfo,
    },
  );
});

function mapPairs(
  pairs: Array<readonly [string, MudValue]>,
  variables = defaultMap,
): Partial<MudState> {
  return Object.assign(
    {},
    ...pairs.map(([variable, value]) => mapMsdpUpdate(variable, value, variables)),
  ) as Partial<MudState>;
}

function withOverrides(overrides: Partial<MsdpVariableMap>) {
  return normalizeMsdpVariableMap({
    ...defaultMsdpVariables,
    ...overrides,
  });
}
