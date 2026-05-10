import assert from 'node:assert/strict';
import test from 'node:test';
import { ActiveConnectionCounter } from '../server/connection-accounting.ts';
import {
  createProxyLifecycleHarness,
  getStatusDetails,
  msdpReadyPacket,
  msdpScalarPacket,
} from './helpers/proxy-lifecycle-harness.ts';

test('manual disconnect emits one disconnected status and ignores the resulting socket close', (t) => {
  const harness = createProxyLifecycleHarness();
  t.after(() => harness.cleanup());

  const mudSocket = harness.connect();
  assert.deepEqual(getStatusDetails(harness.browser), [
    'connecting:Connecting to mud.example.test:4000...',
  ]);

  mudSocket.emitConnect();
  assert.deepEqual(getStatusDetails(harness.browser), [
    'connecting:Connecting to mud.example.test:4000...',
    'connected:Connected to mud.example.test:4000.',
  ]);

  harness.session.disconnect('Disconnected.');
  assert.equal(mudSocket.destroyCount, 1);
  assert.deepEqual(getStatusDetails(harness.browser), [
    'connecting:Connecting to mud.example.test:4000...',
    'connected:Connected to mud.example.test:4000.',
    'disconnected:Disconnected.',
  ]);

  mudSocket.emitClose();
  harness.session.disconnect('Disconnected.');
  assert.deepEqual(getStatusDetails(harness.browser), [
    'connecting:Connecting to mud.example.test:4000...',
    'connected:Connected to mud.example.test:4000.',
    'disconnected:Disconnected.',
  ]);
});

test('MUD socket close emits one closed status for the active socket', (t) => {
  const harness = createProxyLifecycleHarness();
  t.after(() => harness.cleanup());

  const mudSocket = harness.connect();
  mudSocket.emitConnect();
  harness.browser.clearMessages();

  mudSocket.emitClose();
  mudSocket.emitClose();

  assert.deepEqual(getStatusDetails(harness.browser), [
    'disconnected:Connection to mud.example.test:4000 closed.',
  ]);
});

test('runs 25 deterministic connect and disconnect cycles without stale socket cleanup', (t) => {
  const harness = createProxyLifecycleHarness();
  t.after(() => harness.cleanup());

  for (let cycle = 1; cycle <= 25; cycle += 1) {
    const port = 4100 + cycle;
    const mudSocket = harness.connect('cycle.example.test', port);
    mudSocket.emitConnect();
    mudSocket.emitData(msdpReadyPacket());

    assert.equal(mudSocket.noDelay, true, `cycle ${cycle} should enable TCP no-delay`);
    assert.ok(mudSocket.writtenChunks.length > 0, `cycle ${cycle} should initialize MSDP`);

    harness.session.disconnect('Disconnected.');
    assert.equal(mudSocket.destroyCount, 1, `cycle ${cycle} should destroy once`);
    assert.equal(mudSocket.destroyed, true, `cycle ${cycle} should leave socket destroyed`);
  }

  assert.equal(harness.mudSockets.length, 25);
  assert.equal(
    harness.browser.statusMessages.filter((message) => message.status === 'disconnected').length,
    25,
  );
});

test('browser close destroys active MUD socket and active connection accounting releases once', (t) => {
  const harness = createProxyLifecycleHarness();
  t.after(() => harness.cleanup());

  const mudSocket = harness.connect();
  mudSocket.emitConnect();

  harness.session.closeBrowser();
  harness.session.closeBrowser();

  assert.equal(mudSocket.destroyCount, 1);
  assert.equal(mudSocket.destroyed, true);
  assert.deepEqual(getStatusDetails(harness.browser), [
    'connecting:Connecting to mud.example.test:4000...',
    'connected:Connected to mud.example.test:4000.',
  ]);

  const counter = new ActiveConnectionCounter(1);
  const lease = counter.acquire('client-a');
  assert.ok(lease);
  assert.equal(counter.getActiveCount('client-a'), 1);
  assert.equal(counter.acquire('client-a'), null);

  assert.equal(lease.release(), true);
  assert.equal(lease.release(), false);
  assert.equal(counter.getActiveCount('client-a'), 0);
});

test('MUD socket close resets active lifecycle state and allows fresh MSDP readiness', (t) => {
  const harness = createProxyLifecycleHarness();
  t.after(() => harness.cleanup());

  const firstSocket = harness.connect();
  firstSocket.emitConnect();
  firstSocket.emitData(msdpReadyPacket());
  firstSocket.emitData(msdpScalarPacket('HEALTH', 12));

  assert.deepEqual(
    harness.browser.stateMessages.map((message) => message.state),
    [{ health: 12 }],
  );
  assert.ok(firstSocket.writtenChunks.length > 0);

  harness.browser.clearMessages();
  firstSocket.emitClose();

  assert.deepEqual(getStatusDetails(harness.browser), [
    'disconnected:Connection to mud.example.test:4000 closed.',
  ]);

  harness.session.sendInput('look');
  assert.deepEqual(getStatusDetails(harness.browser), [
    'disconnected:Connection to mud.example.test:4000 closed.',
    'error:Connect to a MUD before sending commands.',
  ]);

  harness.browser.clearMessages();
  const secondSocket = harness.connect();
  secondSocket.emitData(msdpReadyPacket());

  assert.notEqual(secondSocket, firstSocket);
  assert.ok(secondSocket.writtenChunks.length > 0);
  assert.deepEqual(getStatusDetails(harness.browser), [
    'connecting:Connecting to mud.example.test:4000...',
  ]);
});

test('MUD socket error resets lifecycle state and keeps error details stable', (t) => {
  const harness = createProxyLifecycleHarness();
  t.after(() => harness.cleanup());

  const mudSocket = harness.connect();
  mudSocket.emitConnect();
  harness.session.sendInput('say secret-player-command');
  harness.browser.clearMessages();

  mudSocket.emitError(new Error('secret-player-command internal socket failure'));
  mudSocket.emitClose();

  assert.equal(mudSocket.destroyCount, 1);
  assert.deepEqual(getStatusDetails(harness.browser), [
    'error:Connection error. The MUD connection closed unexpectedly.',
  ]);
  assert.equal(harness.browser.rawMessages.join('\n').includes('secret-player-command'), false);
  assert.equal(harness.browser.rawMessages.join('\n').includes('internal socket failure'), false);

  harness.session.sendInput('look');
  assert.deepEqual(getStatusDetails(harness.browser), [
    'error:Connection error. The MUD connection closed unexpectedly.',
    'error:Connect to a MUD before sending commands.',
  ]);
});

test('reconnect after MSDP state ignores stale callbacks and stale state', (t) => {
  const harness = createProxyLifecycleHarness();
  t.after(() => harness.cleanup());

  const firstSocket = harness.connect();
  firstSocket.emitConnect();
  firstSocket.emitData(msdpReadyPacket());
  firstSocket.emitData(msdpScalarPacket('HEALTH', 12));

  assert.deepEqual(
    harness.browser.stateMessages.map((message) => message.state),
    [{ health: 12 }],
  );

  harness.browser.clearMessages();
  const secondSocket = harness.connect();
  assert.equal(firstSocket.destroyCount, 1);
  assert.deepEqual(getStatusDetails(harness.browser), [
    'connecting:Connecting to mud.example.test:4000...',
  ]);

  harness.browser.clearMessages();
  firstSocket.emitData(msdpScalarPacket('HEALTH', 99));
  firstSocket.emitError(new Error('stale socket error'));
  firstSocket.emitClose();

  assert.deepEqual(harness.browser.messages, []);

  secondSocket.emitConnect();
  secondSocket.emitData(msdpReadyPacket());
  secondSocket.emitData(msdpScalarPacket('PSP', 7));

  assert.deepEqual(getStatusDetails(harness.browser), [
    'connected:Connected to mud.example.test:4000.',
  ]);
  assert.deepEqual(
    harness.browser.stateMessages.map((message) => message.state),
    [{ psp: 7 }],
  );
});
