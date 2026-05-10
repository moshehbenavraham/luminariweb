import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, type IncomingMessage } from 'node:http';
import { WebSocketServer } from 'ws';
import type { RawData } from 'ws';
import { appSettings } from '../shared/app-settings.ts';
import { normalizeMsdpVariableMap } from '../shared/mud.ts';
import type { ClientMessage } from '../shared/mud.ts';
import { ActiveConnectionCounter } from './connection-accounting.ts';
import { MudSession } from './mud-session.ts';
import { SlidingWindowRateLimiter } from './rate-limiter.ts';

const HTTP_RATE_LIMIT_WINDOW_MS = 10_000;
const HTTP_RATE_LIMIT_MAX_REQUESTS = 25;
const WS_CONNECTION_LIMIT_PER_IP = 4;
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
  const clientIp = getRemoteAddress(request);
  const connectionLease = websocketConnectionsByIp.acquire(clientIp);

  if (!connectionLease) {
    socket.close(1013, 'Too many active connections.');
    return;
  }

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
    connectionLease.release();
    session.closeBrowser();
  });
});

const port = Number(process.env.PORT ?? appSettings.ports.server);
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
