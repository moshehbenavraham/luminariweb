import express from 'express';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, type IncomingMessage } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import type { RawData } from 'ws';
import { appSettings } from '../shared/app-settings.ts';
import { defaultMsdpVariables, normalizeMsdpVariableMap } from '../shared/mud.ts';
import { getConfiguredMsdpVariables, mapMsdpUpdate } from '../shared/msdp-state.ts';
import {
  IAC,
  MSDP_VAL,
  MSDP_VAR,
  SB,
  SE,
  TELOPT_MSDP,
  TelnetParser,
  WEB_CLIENT_NAME,
  WEB_CLIENT_VERSION,
} from './telnet-parser.ts';
import type {
  ClientMessage,
  ConnectionStatus,
  MsdpVariableMap,
  MudState,
  ServerMessage,
} from '../shared/mud.ts';

const HTTP_RATE_LIMIT_WINDOW_MS = 10_000;
const HTTP_RATE_LIMIT_MAX_REQUESTS = 25;
const WS_CONNECTION_LIMIT_PER_IP = 4;
const WS_COMMAND_RATE_LIMIT_WINDOW_MS = 10_000;
const WS_COMMAND_RATE_LIMIT_MAX_INPUTS = 20;
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
const httpRateLimiters = new Map<string, SlidingWindowRateLimiter>();
const websocketConnectionsByIp = new Map<string, number>();

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
  const clientIp = getRemoteAddress(request);
  const activeConnections = (websocketConnectionsByIp.get(clientIp) ?? 0) + 1;

  if (activeConnections > WS_CONNECTION_LIMIT_PER_IP) {
    socket.close(1013, 'Too many active connections.');
    return;
  }

  websocketConnectionsByIp.set(clientIp, activeConnections);

  const session = new MudSession(socket);

  socket.on('message', (data) => {
    const message = parseClientMessage(data);
    if (!message) {
      session.sendStatus('error', 'Received an invalid browser message.');
      return;
    }

    if (message.type === 'input' && !session.allowCommandInput()) {
      session.sendStatus('error', 'Command rate limit exceeded. Slow down and retry.');
      return;
    }

    if (message.type === 'connect') {
      session.connect(message.host, message.port, normalizeMsdpVariableMap(message.msdpVariables));
      return;
    }

    if (message.type === 'disconnect') {
      session.disconnect('Disconnected.');
      return;
    }

    if (message.type === 'msdp-config') {
      session.updateMsdpVariables(normalizeMsdpVariableMap(message.msdpVariables));
      return;
    }

    session.sendInput(message.text);
  });

  socket.on('close', () => {
    const remainingConnections = (websocketConnectionsByIp.get(clientIp) ?? 1) - 1;

    if (remainingConnections > 0) {
      websocketConnectionsByIp.set(clientIp, remainingConnections);
    } else {
      websocketConnectionsByIp.delete(clientIp);
    }

    session.disconnect('Disconnected.');
  });
});

const port = Number(process.env.PORT ?? appSettings.ports.server);
server.listen(port, () => {
  console.log(`LuminariWebClient proxy listening on http://localhost:${port}`);
});

class MudSession {
  private mudSocket: net.Socket | null = null;
  private parser: TelnetParser | null = null;
  private state: MudState = {};
  private msdpInitialized = false;
  private msdpVariables: MsdpVariableMap = normalizeMsdpVariableMap(defaultMsdpVariables);
  private readonly commandRateLimiter = new SlidingWindowRateLimiter(
    WS_COMMAND_RATE_LIMIT_WINDOW_MS,
    WS_COMMAND_RATE_LIMIT_MAX_INPUTS,
  );
  private readonly browserSocket: WebSocket;

  constructor(browserSocket: WebSocket) {
    this.browserSocket = browserSocket;
  }

  allowCommandInput() {
    return this.commandRateLimiter.allow().allowed;
  }

  connect(host: string, port: number, msdpVariables: MsdpVariableMap) {
    if (!isValidHost(host) || !Number.isInteger(port) || port < 1 || port > 65535) {
      this.sendStatus('error', 'Provide a valid MUD host and port.');
      return;
    }

    this.disconnect('Disconnected.');
    this.state = {};
    this.msdpInitialized = false;
    this.msdpVariables = normalizeMsdpVariableMap(msdpVariables);
    this.sendStatus('connecting', `Connecting to ${host}:${port}...`);

    const mudSocket = net.createConnection({ host, port });
    this.mudSocket = mudSocket;
    this.parser = new TelnetParser(mudSocket, {
      onText: (text) => {
        this.send({ type: 'terminal', text });
      },
      onMsdp: (variable, value) => {
        const partial = mapMsdpUpdate(variable, value, this.msdpVariables);
        if (Object.keys(partial).length === 0) {
          return;
        }

        this.state = { ...this.state, ...partial };
        this.send({ type: 'state', state: partial });
      },
      onMsdpReady: () => {
        if (this.msdpInitialized) {
          return;
        }

        this.msdpInitialized = true;
        this.initializeMsdp();
      },
    });

    mudSocket.setNoDelay(true);

    mudSocket.on('connect', () => {
      this.sendStatus('connected', `Connected to ${host}:${port}.`);
    });

    mudSocket.on('data', (chunk) => {
      this.parser?.push(chunk);
    });

    mudSocket.on('error', (error) => {
      this.sendStatus('error', `Connection error: ${error.message}`);
    });

    mudSocket.on('close', () => {
      this.cleanupSocket();
      this.sendStatus('disconnected', `Connection to ${host}:${port} closed.`);
    });
  }

  updateMsdpVariables(msdpVariables: MsdpVariableMap) {
    this.msdpVariables = normalizeMsdpVariableMap(msdpVariables);

    if (!this.msdpInitialized) {
      return;
    }

    this.applyMsdpConfiguration();
  }

  disconnect(detail: string) {
    if (this.mudSocket) {
      this.mudSocket.destroy();
    }

    this.cleanupSocket();
    this.state = {};
    this.sendStatus('disconnected', detail);
  }

  sendInput(text: string) {
    if (!this.mudSocket || this.mudSocket.destroyed) {
      this.sendStatus('error', 'Connect to a MUD before sending commands.');
      return;
    }

    this.mudSocket.write(text.endsWith('\n') ? text : `${text}\n`);
    this.requestStateRefresh();
  }

  sendStatus(status: ConnectionStatus, detail: string) {
    this.send({ type: 'connection-status', status, detail });
  }

  private initializeMsdp() {
    if (!this.mudSocket || this.mudSocket.destroyed) {
      return;
    }

    this.sendMsdpPair('CLIENT_ID', WEB_CLIENT_NAME);
    this.sendMsdpPair('CLIENT_VERSION', WEB_CLIENT_VERSION);
    this.sendMsdpPair('ANSI_COLORS', 1);
    this.sendMsdpPair('256_COLORS', 1);
    this.sendMsdpPair('UTF_8', 1);
    this.applyMsdpConfiguration();
  }

  private sendMsdpPair(variable: string, value: string | number) {
    if (!this.mudSocket || this.mudSocket.destroyed) {
      return;
    }

    const payload = Buffer.concat([
      Buffer.from([IAC, SB, TELOPT_MSDP, MSDP_VAR]),
      Buffer.from(variable, 'utf8'),
      Buffer.from([MSDP_VAL]),
      Buffer.from(String(value), 'utf8'),
      Buffer.from([IAC, SE]),
    ]);
    this.mudSocket.write(payload);
  }

  private requestStateRefresh() {
    if (!this.msdpInitialized) {
      return;
    }

    for (const variable of getConfiguredMsdpVariables(this.msdpVariables)) {
      this.sendMsdpPair('SEND', variable);
    }
  }

  private applyMsdpConfiguration() {
    for (const variable of getConfiguredMsdpVariables(this.msdpVariables)) {
      this.sendMsdpPair('REPORT', variable);
    }

    this.requestStateRefresh();
  }

  private cleanupSocket() {
    this.parser?.close();
    this.parser = null;
    this.mudSocket = null;
    this.msdpInitialized = false;
  }

  private send(message: ServerMessage) {
    if (this.browserSocket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.browserSocket.send(JSON.stringify(message));
  }
}

class SlidingWindowRateLimiter {
  private windowStartMs: number;
  private count = 0;
  private lastSeenMs: number;
  private readonly windowMs: number;
  private readonly limit: number;

  constructor(windowMs: number, limit: number, now = Date.now()) {
    this.windowMs = windowMs;
    this.limit = limit;
    this.windowStartMs = now;
    this.lastSeenMs = now;
  }

  allow(now = Date.now()) {
    this.lastSeenMs = now;

    if (now - this.windowStartMs >= this.windowMs) {
      this.windowStartMs = now;
      this.count = 0;
    }

    if (this.count >= this.limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAtMs: this.windowStartMs + this.windowMs,
      };
    }

    this.count += 1;
    return {
      allowed: true,
      remaining: this.limit - this.count,
      resetAtMs: this.windowStartMs + this.windowMs,
    };
  }

  isStale(now = Date.now()) {
    return now - this.lastSeenMs > this.windowMs * 4;
  }
}

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

function parseClientMessage(data: RawData): ClientMessage | null {
  const text = dataToString(data);
  if (!text) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const message = parsed as Record<string, unknown>;

    if (
      message.type === 'connect' &&
      typeof message.host === 'string' &&
      typeof message.port === 'number'
    ) {
      return {
        type: 'connect',
        host: message.host,
        port: message.port,
        msdpVariables: normalizeMsdpVariableMap(message.msdpVariables),
      };
    }

    if (message.type === 'disconnect') {
      return { type: 'disconnect' };
    }

    if (message.type === 'input' && typeof message.text === 'string') {
      return { type: 'input', text: message.text };
    }

    if (message.type === 'msdp-config') {
      return {
        type: 'msdp-config',
        msdpVariables: normalizeMsdpVariableMap(message.msdpVariables),
      };
    }

    return null;
  } catch {
    return null;
  }
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

function isValidHost(host: string) {
  return /^[a-z0-9.-]+$/i.test(host) || /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
}
