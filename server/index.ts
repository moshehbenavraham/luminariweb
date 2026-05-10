import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, type IncomingMessage } from 'node:http';
import { WebSocketServer } from 'ws';
import type { RawData } from 'ws';
import { appSettings } from '../shared/app-settings.ts';
import { normalizeMsdpVariableMap, terminalDimensionBounds } from '../shared/mud.ts';
import type { ClientMessage, TerminalDimensions } from '../shared/mud.ts';
import { ActiveConnectionCounter } from './connection-accounting.ts';
import { MudSession } from './mud-session.ts';
import {
  checkWebSocketOrigin,
  createProxyPolicy,
  validateProxyDestination,
} from './proxy-policy.ts';
import { SlidingWindowRateLimiter } from './rate-limiter.ts';

const HTTP_RATE_LIMIT_WINDOW_MS = 10_000;
const HTTP_RATE_LIMIT_MAX_REQUESTS = 25;
const WS_CONNECTION_LIMIT_PER_IP = 4;
const INVALID_BROWSER_MESSAGE_DETAIL = 'Received an invalid browser message.';
const INVALID_RESIZE_MESSAGE_DETAIL = 'Received invalid terminal resize dimensions.';
const port = Number(process.env.PORT ?? appSettings.ports.server);
const proxyPolicy = createProxyPolicy({
  env: process.env,
  localOriginPorts: [
    appSettings.ports.client,
    appSettings.ports.server,
    appSettings.ports.preview,
    port,
  ],
  presets: appSettings.connection.muds,
});
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
const httpRateLimiters = new Map<string, SlidingWindowRateLimiter>();
const websocketConnectionsByIp = new ActiveConnectionCounter(WS_CONNECTION_LIMIT_PER_IP);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../client');

app.use(rateLimitHttpRequests);

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/api/settings', (_request, response) => {
  response.json(appSettings);
});

app.use(express.static(clientDist));

app.get(/^(?!\/ws).*/, (_request, response) => {
  response.sendFile(path.join(clientDist, 'index.html'));
});

wss.on('connection', (socket, request) => {
  const originDecision = checkWebSocketOrigin(proxyPolicy, request.headers.origin);
  if (!originDecision.allowed) {
    socket.close(1008, originDecision.detail);
    return;
  }

  const clientIp = getRemoteAddress(request);
  const connectionLease = websocketConnectionsByIp.acquire(clientIp);

  if (!connectionLease) {
    socket.close(1013, 'Too many active connections.');
    return;
  }

  const session = new MudSession(socket, {
    timeouts: {
      connectTimeoutMs: proxyPolicy.timeouts.connectTimeoutMs,
      idleTimeoutMs: proxyPolicy.timeouts.idleTimeoutMs,
    },
  });
  let activeConnectValidationToken: number | null = null;
  let nextConnectValidationToken = 0;

  socket.on('message', (data) => {
    void handleBrowserMessage(data);
  });

  async function handleBrowserMessage(data: RawData) {
    const parsedMessage = parseClientMessage(data);
    const message = parsedMessage.message;
    if (!message) {
      session.sendStatus('error', parsedMessage.errorDetail);
      return;
    }

    if (message.type === 'input' && !session.allowCommandInput()) {
      session.sendStatus('error', 'Command rate limit exceeded. Slow down and retry.');
      return;
    }

    if (message.type === 'connect') {
      await handleConnectMessage(message);
      return;
    }

    if (message.type === 'disconnect') {
      cancelPendingConnectValidation();
      session.disconnect('Disconnected.');
      return;
    }

    if (message.type === 'msdp-config') {
      session.updateMsdpVariables(normalizeMsdpVariableMap(message.msdpVariables));
      return;
    }

    if (message.type === 'resize') {
      session.updateTerminalDimensions({
        columns: message.columns,
        rows: message.rows,
      });
      return;
    }

    session.sendInput(message.text);
  }

  async function handleConnectMessage(message: Extract<ClientMessage, { type: 'connect' }>) {
    if (activeConnectValidationToken !== null) {
      session.sendStatus('error', 'A connection request is already in progress.');
      return;
    }

    const connectValidationToken = nextConnectValidationToken + 1;
    nextConnectValidationToken = connectValidationToken;
    activeConnectValidationToken = connectValidationToken;

    try {
      const destinationDecision = await validateProxyDestination(proxyPolicy, {
        host: message.host,
        port: message.port,
      });

      if (activeConnectValidationToken !== connectValidationToken) {
        return;
      }

      activeConnectValidationToken = null;

      if (!destinationDecision.allowed) {
        session.sendStatus('error', destinationDecision.detail);
        return;
      }

      session.connect(
        destinationDecision.value.host,
        destinationDecision.value.port,
        normalizeMsdpVariableMap(message.msdpVariables),
      );
    } catch {
      if (activeConnectValidationToken !== connectValidationToken) {
        return;
      }

      activeConnectValidationToken = null;
      session.sendStatus('error', 'This MUD destination could not be verified.');
    }
  }

  function cancelPendingConnectValidation() {
    if (activeConnectValidationToken === null) {
      return;
    }

    activeConnectValidationToken = null;
    nextConnectValidationToken += 1;
  }

  socket.on('close', () => {
    cancelPendingConnectValidation();
    connectionLease.release();
    session.closeBrowser();
  });
});

server.listen(port, () => {
  console.log(`LuminariWebClient proxy listening on http://localhost:${port}`);
});

function rateLimitHttpRequests(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  const clientIp = getRemoteAddress(request);
  const limiter = getHttpRateLimiter(clientIp);
  const result = limiter.allow();

  response.setHeader('X-RateLimit-Limit', String(HTTP_RATE_LIMIT_MAX_REQUESTS));
  response.setHeader('X-RateLimit-Remaining', String(result.remaining));
  response.setHeader('X-RateLimit-Reset', String(Math.ceil(result.resetAtMs / 1000)));

  if (!result.allowed) {
    response.setHeader(
      'Retry-After',
      String(Math.max(1, Math.ceil((result.resetAtMs - Date.now()) / 1000))),
    );
    response.status(429).json({ error: 'Too many requests.' });
    return;
  }

  next();
}

function getHttpRateLimiter(clientIp: string) {
  const existingLimiter = httpRateLimiters.get(clientIp);
  if (existingLimiter) {
    return existingLimiter;
  }

  const limiter = new SlidingWindowRateLimiter(
    HTTP_RATE_LIMIT_WINDOW_MS,
    HTTP_RATE_LIMIT_MAX_REQUESTS,
  );
  httpRateLimiters.set(clientIp, limiter);
  pruneStaleRateLimiters();
  return limiter;
}

function pruneStaleRateLimiters() {
  const now = Date.now();

  for (const [clientIp, limiter] of httpRateLimiters) {
    if (limiter.isStale(now)) {
      httpRateLimiters.delete(clientIp);
    }
  }
}

function getRemoteAddress(request: IncomingMessage | express.Request) {
  return request.socket.remoteAddress ?? 'unknown';
}

type ClientMessageParseResult =
  | {
      errorDetail: string;
      message: null;
    }
  | {
      errorDetail: null;
      message: ClientMessage;
    };

function parseClientMessage(data: RawData): ClientMessageParseResult {
  const text = dataToString(data);
  if (!text) {
    return invalidClientMessage();
  }

  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') {
      return invalidClientMessage();
    }

    const message = parsed as Record<string, unknown>;

    if (
      message.type === 'connect' &&
      typeof message.host === 'string' &&
      typeof message.port === 'number'
    ) {
      return validClientMessage({
        type: 'connect',
        host: message.host,
        port: message.port,
        msdpVariables: normalizeMsdpVariableMap(message.msdpVariables),
      });
    }

    if (message.type === 'disconnect') {
      return validClientMessage({ type: 'disconnect' });
    }

    if (message.type === 'input' && typeof message.text === 'string') {
      return validClientMessage({ type: 'input', text: message.text });
    }

    if (message.type === 'msdp-config') {
      return validClientMessage({
        type: 'msdp-config',
        msdpVariables: normalizeMsdpVariableMap(message.msdpVariables),
      });
    }

    if (message.type === 'resize') {
      const dimensions = parseTerminalDimensions(message);
      if (!dimensions) {
        return invalidClientMessage(INVALID_RESIZE_MESSAGE_DETAIL);
      }

      return validClientMessage({
        type: 'resize',
        columns: dimensions.columns,
        rows: dimensions.rows,
      });
    }

    return invalidClientMessage();
  } catch {
    return invalidClientMessage();
  }
}

function validClientMessage(message: ClientMessage): ClientMessageParseResult {
  return {
    errorDetail: null,
    message,
  };
}

function invalidClientMessage(errorDetail = INVALID_BROWSER_MESSAGE_DETAIL): ClientMessageParseResult {
  return {
    errorDetail,
    message: null,
  };
}

function parseTerminalDimensions(message: Record<string, unknown>): TerminalDimensions | null {
  if (
    !isValidTerminalDimension(
      message.columns,
      terminalDimensionBounds.columns.min,
      terminalDimensionBounds.columns.max,
    ) ||
    !isValidTerminalDimension(
      message.rows,
      terminalDimensionBounds.rows.min,
      terminalDimensionBounds.rows.max,
    )
  ) {
    return null;
  }

  return {
    columns: message.columns,
    rows: message.rows,
  };
}

function isValidTerminalDimension(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function dataToString(data: RawData) {
  if (typeof data === 'string') {
    return data;
  }

  if (data instanceof Buffer) {
    return data.toString('utf8');
  }

  if (Array.isArray(data)) {
    return Buffer.concat(data).toString('utf8');
  }

  if (data instanceof ArrayBuffer) {
    return Buffer.from(data).toString('utf8');
  }

  return '';
}
