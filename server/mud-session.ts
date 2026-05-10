import net from 'node:net';
import {
  defaultMsdpVariables,
  normalizeMsdpVariableMap,
  terminalDimensionBounds,
} from '../shared/mud.ts';
import type {
  ConnectionStatus,
  MsdpVariableMap,
  MudState,
  ServerMessage,
  TerminalDimensions,
} from '../shared/mud.ts';
import { getConfiguredMsdpVariables, mapMsdpUpdate } from '../shared/msdp-state.ts';
import {
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
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
import { SlidingWindowRateLimiter } from './rate-limiter.ts';

const WS_COMMAND_RATE_LIMIT_WINDOW_MS = 10_000;
const WS_COMMAND_RATE_LIMIT_MAX_INPUTS = 20;
const BROWSER_SOCKET_OPEN_STATE = 1;
const DEFAULT_TERMINAL_DIMENSIONS: TerminalDimensions = {
  columns: DEFAULT_COLUMNS,
  rows: DEFAULT_ROWS,
};

export type BrowserSocket = {
  readonly readyState: number;
  send(data: string): void;
};

export type MudSocketAddress = {
  host: string;
  port: number;
};

export type MudSocket = {
  readonly destroyed: boolean;
  setNoDelay(noDelay: boolean): void;
  write(chunk: string | Buffer): void;
  destroy(): void;
  on(event: 'connect', listener: () => void): void;
  on(event: 'data', listener: (chunk: Buffer) => void): void;
  on(event: 'error', listener: (error: Error) => void): void;
  on(event: 'close', listener: () => void): void;
};

export type MudSocketFactory = (address: MudSocketAddress) => MudSocket;

export type MudSessionTimeoutSettings = {
  connectTimeoutMs: number;
  idleTimeoutMs: number;
};

export type MudSessionTimerApi = {
  clearTimeout(handle: unknown): void;
  setTimeout(listener: () => void, delayMs: number): unknown;
};

export type MudSessionOptions = {
  createMudSocket?: MudSocketFactory;
  timerApi?: MudSessionTimerApi;
  timeouts?: Partial<MudSessionTimeoutSettings>;
};

const DEFAULT_MUD_SESSION_TIMEOUTS: MudSessionTimeoutSettings = {
  connectTimeoutMs: 10_000,
  idleTimeoutMs: 300_000,
};

export class MudSession {
  private mudSocket: MudSocket | null = null;
  private parser: TelnetParser | null = null;
  private state: MudState = {};
  private terminalDimensions: TerminalDimensions = DEFAULT_TERMINAL_DIMENSIONS;
  private msdpInitialized = false;
  private msdpVariables: MsdpVariableMap = normalizeMsdpVariableMap(defaultMsdpVariables);
  private lastDisconnectedStatusKey: string | null = null;
  private readonly commandRateLimiter = new SlidingWindowRateLimiter(
    WS_COMMAND_RATE_LIMIT_WINDOW_MS,
    WS_COMMAND_RATE_LIMIT_MAX_INPUTS,
  );
  private readonly browserSocket: BrowserSocket;
  private readonly createMudSocket: MudSocketFactory;
  private readonly timerApi: MudSessionTimerApi;
  private readonly timeouts: MudSessionTimeoutSettings;
  private connectTimeoutHandle: unknown | null = null;
  private connectTimeoutToken = 0;
  private idleTimeoutHandle: unknown | null = null;
  private idleTimeoutToken = 0;

  constructor(browserSocket: BrowserSocket, options: MudSessionOptions = {}) {
    this.browserSocket = browserSocket;
    this.createMudSocket = options.createMudSocket ?? createNetMudSocket;
    this.timerApi = options.timerApi ?? defaultMudSessionTimerApi;
    this.timeouts = normalizeMudSessionTimeouts(options.timeouts);
  }

  allowCommandInput() {
    return this.commandRateLimiter.allow().allowed;
  }

  connect(host: string, port: number, msdpVariables: MsdpVariableMap) {
    if (!isValidHost(host) || !Number.isInteger(port) || port < 1 || port > 65535) {
      this.sendStatus('error', 'Provide a valid MUD host and port.');
      return;
    }

    this.cleanupActiveSocket({ destroySocket: true });
    this.resetMudState();
    this.msdpVariables = normalizeMsdpVariableMap(msdpVariables);
    this.sendStatus('connecting', `Connecting to ${host}:${port}...`);

    let mudSocket: MudSocket;
    try {
      mudSocket = this.createMudSocket({ host, port });
    } catch {
      this.cleanupActiveSocket({ destroySocket: false });
      this.sendStatus('error', 'Connection error. Unable to open the MUD socket.');
      return;
    }

    this.mudSocket = mudSocket;
    this.parser = this.createParser(mudSocket);
    this.registerSocketHandlers(mudSocket, host, port);
    this.armConnectTimeout(mudSocket);

    try {
      mudSocket.setNoDelay(true);
    } catch {
      this.cleanupCurrentSocket(mudSocket);
      this.destroySocket(mudSocket);
      this.sendStatus('error', 'Connection error. Unable to configure the MUD socket.');
    }
  }

  updateMsdpVariables(msdpVariables: MsdpVariableMap) {
    this.msdpVariables = normalizeMsdpVariableMap(msdpVariables);

    if (!this.msdpInitialized) {
      return;
    }

    this.applyMsdpConfiguration();
  }

  updateTerminalDimensions(dimensions: TerminalDimensions) {
    const normalizedDimensions = normalizeTerminalDimensions(dimensions);
    if (
      normalizedDimensions.columns === this.terminalDimensions.columns &&
      normalizedDimensions.rows === this.terminalDimensions.rows
    ) {
      return;
    }

    this.terminalDimensions = normalizedDimensions;
    this.applyTerminalDimensionsToParser(
      'Connection error. Unable to send terminal size to the MUD.',
    );
  }

  disconnect(detail: string) {
    this.cleanupActiveSocket({ destroySocket: true });
    this.resetMudState();
    this.sendStatus('disconnected', detail);
  }

  closeBrowser() {
    this.cleanupActiveSocket({ destroySocket: true });
    this.resetMudState();
  }

  sendInput(text: string) {
    const mudSocket = this.mudSocket;
    if (!mudSocket || mudSocket.destroyed) {
      this.sendStatus('error', 'Connect to a MUD before sending commands.');
      return;
    }

    const wroteInput = this.writeToActiveSocket(
      text.endsWith('\n') ? text : `${text}\n`,
      'Connection error. Unable to send command to the MUD.',
    );

    if (wroteInput) {
      if (mudSocket && this.isCurrentSocket(mudSocket)) {
        this.armIdleTimeout(mudSocket);
      }

      this.requestStateRefresh();
    }
  }

  sendStatus(status: ConnectionStatus, detail: string) {
    if (status === 'disconnected') {
      const statusKey = `${status}:${detail}`;
      if (this.lastDisconnectedStatusKey === statusKey) {
        return;
      }
      this.lastDisconnectedStatusKey = statusKey;
    } else {
      this.lastDisconnectedStatusKey = null;
    }

    this.send({ type: 'connection-status', status, detail });
  }

  private createParser(mudSocket: MudSocket) {
    const parser = new TelnetParser(mudSocket, {
      onText: (text) => {
        if (!this.isCurrentSocket(mudSocket)) {
          return;
        }

        this.send({ type: 'terminal', text });
      },
      onMsdp: (variable, value) => {
        if (!this.isCurrentSocket(mudSocket)) {
          return;
        }

        const partial = mapMsdpUpdate(variable, value, this.msdpVariables);
        if (Object.keys(partial).length === 0) {
          return;
        }

        this.state = { ...this.state, ...partial };
        this.send({ type: 'state', state: partial });
      },
      onMsdpReady: () => {
        if (!this.isCurrentSocket(mudSocket) || this.msdpInitialized) {
          return;
        }

        this.msdpInitialized = true;
        this.initializeMsdp();
      },
    });

    parser.updateTerminalSize(this.terminalDimensions);
    return parser;
  }

  private registerSocketHandlers(mudSocket: MudSocket, host: string, port: number) {
    mudSocket.on('connect', () => {
      if (!this.isCurrentSocket(mudSocket)) {
        return;
      }

      this.clearConnectTimeout();
      this.armIdleTimeout(mudSocket);
      this.sendStatus('connected', `Connected to ${host}:${port}.`);
    });

    mudSocket.on('data', (chunk) => {
      if (!this.isCurrentSocket(mudSocket)) {
        return;
      }

      this.armIdleTimeout(mudSocket);

      try {
        this.parser?.push(chunk);
      } catch {
        this.cleanupCurrentSocket(mudSocket);
        this.destroySocket(mudSocket);
        this.sendStatus('error', 'Connection error. Unable to parse MUD traffic.');
      }
    });

    mudSocket.on('error', () => {
      if (!this.isCurrentSocket(mudSocket)) {
        return;
      }

      this.cleanupCurrentSocket(mudSocket);
      this.destroySocket(mudSocket);
      this.sendStatus('error', 'Connection error. The MUD connection closed unexpectedly.');
    });

    mudSocket.on('close', () => {
      if (!this.cleanupCurrentSocket(mudSocket)) {
        return;
      }

      this.sendStatus('disconnected', `Connection to ${host}:${port} closed.`);
    });
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
      return false;
    }

    const payload = Buffer.concat([
      Buffer.from([IAC, SB, TELOPT_MSDP, MSDP_VAR]),
      Buffer.from(variable, 'utf8'),
      Buffer.from([MSDP_VAL]),
      Buffer.from(String(value), 'utf8'),
      Buffer.from([IAC, SE]),
    ]);

    return this.writeToActiveSocket(payload, 'Connection error. Unable to exchange MSDP data.');
  }

  private requestStateRefresh() {
    if (!this.msdpInitialized) {
      return;
    }

    for (const variable of getConfiguredMsdpVariables(this.msdpVariables)) {
      if (!this.sendMsdpPair('SEND', variable)) {
        return;
      }
    }
  }

  private applyMsdpConfiguration() {
    for (const variable of getConfiguredMsdpVariables(this.msdpVariables)) {
      if (!this.sendMsdpPair('REPORT', variable)) {
        return;
      }
    }

    this.requestStateRefresh();
  }

  private applyTerminalDimensionsToParser(failureDetail: string) {
    const mudSocket = this.mudSocket;
    if (!mudSocket || mudSocket.destroyed || !this.parser) {
      return;
    }

    try {
      this.parser.updateTerminalSize(this.terminalDimensions);
    } catch {
      this.cleanupCurrentSocket(mudSocket);
      this.destroySocket(mudSocket);
      this.sendStatus('error', failureDetail);
    }
  }

  private writeToActiveSocket(chunk: string | Buffer, failureDetail: string) {
    const mudSocket = this.mudSocket;
    if (!mudSocket || mudSocket.destroyed) {
      return false;
    }

    try {
      mudSocket.write(chunk);
      return true;
    } catch {
      this.cleanupCurrentSocket(mudSocket);
      this.destroySocket(mudSocket);
      this.sendStatus('error', failureDetail);
      return false;
    }
  }

  private cleanupActiveSocket(options: { destroySocket: boolean }) {
    const mudSocket = this.mudSocket;
    this.clearSocketTimers();
    this.parser?.close();
    this.parser = null;
    this.mudSocket = null;
    this.msdpInitialized = false;

    if (options.destroySocket && mudSocket) {
      this.destroySocket(mudSocket);
    }
  }

  private cleanupCurrentSocket(mudSocket: MudSocket) {
    if (this.mudSocket !== mudSocket) {
      return false;
    }

    this.clearSocketTimers();
    this.parser?.close();
    this.parser = null;
    this.mudSocket = null;
    this.msdpInitialized = false;
    this.resetMudState();
    return true;
  }

  private resetMudState() {
    this.state = {};
  }

  private destroySocket(mudSocket: MudSocket) {
    if (mudSocket.destroyed) {
      return;
    }

    try {
      mudSocket.destroy();
    } catch {
      this.sendStatus('error', 'Connection error. Unable to close the MUD socket cleanly.');
    }
  }

  private isCurrentSocket(mudSocket: MudSocket) {
    return this.mudSocket === mudSocket;
  }

  private armConnectTimeout(mudSocket: MudSocket) {
    this.clearConnectTimeout();
    const timeoutToken = this.connectTimeoutToken + 1;
    this.connectTimeoutToken = timeoutToken;
    this.connectTimeoutHandle = this.timerApi.setTimeout(() => {
      if (this.connectTimeoutToken !== timeoutToken || !this.isCurrentSocket(mudSocket)) {
        return;
      }

      this.cleanupCurrentSocket(mudSocket);
      this.destroySocket(mudSocket);
      this.sendStatus('error', 'Connection timed out before the MUD accepted the connection.');
    }, this.timeouts.connectTimeoutMs);
  }

  private armIdleTimeout(mudSocket: MudSocket) {
    this.clearIdleTimeout();
    const timeoutToken = this.idleTimeoutToken + 1;
    this.idleTimeoutToken = timeoutToken;
    this.idleTimeoutHandle = this.timerApi.setTimeout(() => {
      if (this.idleTimeoutToken !== timeoutToken || !this.isCurrentSocket(mudSocket)) {
        return;
      }

      this.cleanupCurrentSocket(mudSocket);
      this.destroySocket(mudSocket);
      this.sendStatus('disconnected', 'Connection closed after being idle too long.');
    }, this.timeouts.idleTimeoutMs);
  }

  private clearSocketTimers() {
    this.clearConnectTimeout();
    this.clearIdleTimeout();
  }

  private clearConnectTimeout() {
    if (this.connectTimeoutHandle === null) {
      return;
    }

    this.timerApi.clearTimeout(this.connectTimeoutHandle);
    this.connectTimeoutHandle = null;
    this.connectTimeoutToken += 1;
  }

  private clearIdleTimeout() {
    if (this.idleTimeoutHandle === null) {
      return;
    }

    this.timerApi.clearTimeout(this.idleTimeoutHandle);
    this.idleTimeoutHandle = null;
    this.idleTimeoutToken += 1;
  }

  private send(message: ServerMessage) {
    if (this.browserSocket.readyState !== BROWSER_SOCKET_OPEN_STATE) {
      return;
    }

    try {
      this.browserSocket.send(JSON.stringify(message));
    } catch {
      return;
    }
  }
}

function createNetMudSocket(address: MudSocketAddress): MudSocket {
  return net.createConnection({ host: address.host, port: address.port });
}

const defaultMudSessionTimerApi: MudSessionTimerApi = {
  clearTimeout: (handle) => {
    clearTimeout(handle as ReturnType<typeof setTimeout>);
  },
  setTimeout: (listener, delayMs) => setTimeout(listener, delayMs),
};

function normalizeMudSessionTimeouts(
  timeouts: Partial<MudSessionTimeoutSettings> | undefined,
): MudSessionTimeoutSettings {
  return {
    connectTimeoutMs: normalizeMudSessionTimeout(
      timeouts?.connectTimeoutMs,
      DEFAULT_MUD_SESSION_TIMEOUTS.connectTimeoutMs,
    ),
    idleTimeoutMs: normalizeMudSessionTimeout(
      timeouts?.idleTimeoutMs,
      DEFAULT_MUD_SESSION_TIMEOUTS.idleTimeoutMs,
    ),
  };
}

function normalizeMudSessionTimeout(value: number | undefined, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : fallback;
}

function normalizeTerminalDimensions(dimensions: TerminalDimensions): TerminalDimensions {
  return {
    columns: normalizeTerminalDimension(
      dimensions.columns,
      terminalDimensionBounds.columns.min,
      terminalDimensionBounds.columns.max,
      DEFAULT_TERMINAL_DIMENSIONS.columns,
    ),
    rows: normalizeTerminalDimension(
      dimensions.rows,
      terminalDimensionBounds.rows.min,
      terminalDimensionBounds.rows.max,
      DEFAULT_TERMINAL_DIMENSIONS.rows,
    ),
  };
}

function normalizeTerminalDimension(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.floor(value)));
}

function isValidHost(host: string) {
  return /^[a-z0-9.-]+$/i.test(host) || net.isIP(host) !== 0;
}
