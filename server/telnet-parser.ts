import { StringDecoder } from 'node:string_decoder';
import type { MudValue } from '../shared/mud.ts';

export const IAC = 255;
export const DONT = 254;
export const DO = 253;
export const WONT = 252;
export const WILL = 251;
export const SB = 250;
export const SE = 240;
export const TTYPE_IS = 0;
export const TTYPE_SEND = 1;
export const TELOPT_ECHO = 1;
export const TELOPT_SGA = 3;
export const TELOPT_TTYPE = 24;
export const TELOPT_NAWS = 31;
export const TELOPT_CHARSET = 42;
export const TELOPT_MSDP = 69;
export const TELOPT_MCCP = 86;
export const TELOPT_MXP = 91;
export const MSDP_VAR = 1;
export const MSDP_VAL = 2;
export const MSDP_TABLE_OPEN = 3;
export const MSDP_TABLE_CLOSE = 4;
export const MSDP_ARRAY_OPEN = 5;
export const MSDP_ARRAY_CLOSE = 6;
export const WEB_CLIENT_NAME = 'LuminariWebClient';
export const WEB_CLIENT_VERSION = '0.1.0';
export const DEFAULT_COLUMNS = 120;
export const DEFAULT_ROWS = 40;

const CONTROL_BYTES = new Set([
  MSDP_VAR,
  MSDP_VAL,
  MSDP_TABLE_OPEN,
  MSDP_TABLE_CLOSE,
  MSDP_ARRAY_OPEN,
  MSDP_ARRAY_CLOSE,
]);

export type TelnetTransport = {
  write: (chunk: Buffer) => void;
};

export type TelnetParserCallbacks = {
  onText: (text: string) => void;
  onMsdp: (variable: string, value: MudValue) => void;
  onMsdpReady: () => void;
};

type ParserState = 'data' | 'iac' | 'iac-command' | 'sb-option' | 'sb-data' | 'sb-iac';

export class TelnetParser {
  private state: ParserState = 'data';
  private readonly decoder = new StringDecoder('utf8');
  private readonly textBuffer: number[] = [];
  private readonly sbBuffer: number[] = [];
  private pendingCommand = 0;
  private currentSbOption = 0;
  private readonly transport: TelnetTransport;
  private readonly callbacks: TelnetParserCallbacks;

  constructor(transport: TelnetTransport, callbacks: TelnetParserCallbacks) {
    this.transport = transport;
    this.callbacks = callbacks;
  }

  push(chunk: Buffer) {
    for (const byte of chunk) {
      this.consume(byte);
    }

    this.flushText();
  }

  close() {
    this.textBuffer.length = 0;
    this.sbBuffer.length = 0;
    this.pendingCommand = 0;
    this.currentSbOption = 0;
    this.state = 'data';
    this.decoder.end();
  }

  private consume(byte: number) {
    if (this.state === 'data') {
      if (byte === IAC) {
        this.flushText();
        this.state = 'iac';
        return;
      }

      this.textBuffer.push(byte);
      return;
    }

    if (this.state === 'iac') {
      if (byte === IAC) {
        this.textBuffer.push(IAC);
        this.state = 'data';
        return;
      }

      if (byte === WILL || byte === WONT || byte === DO || byte === DONT) {
        this.pendingCommand = byte;
        this.state = 'iac-command';
        return;
      }

      if (byte === SB) {
        this.state = 'sb-option';
        return;
      }

      this.state = 'data';
      return;
    }

    if (this.state === 'iac-command') {
      this.handleNegotiation(this.pendingCommand, byte);
      this.state = 'data';
      return;
    }

    if (this.state === 'sb-option') {
      this.currentSbOption = byte;
      this.sbBuffer.length = 0;
      this.state = 'sb-data';
      return;
    }

    if (this.state === 'sb-data') {
      if (byte === IAC) {
        this.state = 'sb-iac';
        return;
      }

      this.sbBuffer.push(byte);
      return;
    }

    if (byte === SE) {
      this.handleSubnegotiation(this.currentSbOption, Buffer.from(this.sbBuffer));
      this.sbBuffer.length = 0;
      this.state = 'data';
      return;
    }

    if (byte === IAC) {
      this.sbBuffer.push(IAC);
    }

    this.state = 'sb-data';
  }

  private flushText() {
    if (this.textBuffer.length === 0) {
      return;
    }

    const text = this.decoder.write(Buffer.from(this.textBuffer));
    this.textBuffer.length = 0;

    if (text) {
      this.callbacks.onText(text);
    }
  }

  private handleNegotiation(command: number, option: number) {
    if (command === WILL) {
      if (option === TELOPT_MSDP) {
        this.sendNegotiation(DO, option);
        this.callbacks.onMsdpReady();
        return;
      }

      if (option === TELOPT_ECHO || option === TELOPT_SGA) {
        this.sendNegotiation(DO, option);
        return;
      }

      if (option === TELOPT_MCCP) {
        this.sendNegotiation(DONT, option);
        return;
      }

      this.sendNegotiation(DONT, option);
      return;
    }

    if (command === DO) {
      if (option === TELOPT_TTYPE) {
        this.sendNegotiation(WILL, option);
        return;
      }

      if (option === TELOPT_NAWS) {
        this.sendNegotiation(WILL, option);
        this.sendNaws(DEFAULT_COLUMNS, DEFAULT_ROWS);
        return;
      }

      if (option === TELOPT_CHARSET || option === TELOPT_MXP) {
        this.sendNegotiation(WONT, option);
        return;
      }

      this.sendNegotiation(WONT, option);
    }
  }

  private handleSubnegotiation(option: number, payload: Buffer) {
    if (option === TELOPT_MSDP) {
      for (const [variable, value] of parseMsdpPayload(payload)) {
        this.callbacks.onMsdp(variable, value);
      }
      return;
    }

    if (option === TELOPT_TTYPE && payload[0] === TTYPE_SEND) {
      this.transport.write(
        Buffer.concat([
          Buffer.from([IAC, SB, TELOPT_TTYPE, TTYPE_IS]),
          Buffer.from(WEB_CLIENT_NAME, 'utf8'),
          Buffer.from([IAC, SE]),
        ]),
      );
    }
  }

  private sendNegotiation(command: number, option: number) {
    this.transport.write(Buffer.from([IAC, command, option]));
  }

  private sendNaws(columns: number, rows: number) {
    const width = Buffer.from([columns >> 8, columns & 0xff]);
    const height = Buffer.from([rows >> 8, rows & 0xff]);
    this.transport.write(
      Buffer.concat([Buffer.from([IAC, SB, TELOPT_NAWS]), width, height, Buffer.from([IAC, SE])]),
    );
  }
}

export function parseMsdpPayload(payload: Buffer): Array<[string, MudValue]> {
  const pairs: Array<[string, MudValue]> = [];
  let index = 0;

  while (index < payload.length) {
    if (payload[index] !== MSDP_VAR) {
      index += 1;
      continue;
    }

    index += 1;
    const [variable, nextIndex] = readScalar(payload, index);
    index = nextIndex;

    if (payload[index] !== MSDP_VAL) {
      continue;
    }

    index += 1;
    const [value, afterValue] = readValue(payload, index);
    index = afterValue;

    if (variable) {
      pairs.push([variable, value]);
    }
  }

  return pairs;
}

function readValue(payload: Buffer, index: number): [MudValue, number] {
  const marker = payload[index];

  if (marker === MSDP_ARRAY_OPEN) {
    const items: MudValue[] = [];
    let cursor = index + 1;

    while (cursor < payload.length && payload[cursor] !== MSDP_ARRAY_CLOSE) {
      if (payload[cursor] === MSDP_VAL) {
        cursor += 1;
        const [value, nextCursor] = readValue(payload, cursor);
        items.push(value);
        cursor = nextCursor;
        continue;
      }

      const [value, nextCursor] = readScalar(payload, cursor);
      if (value !== '') {
        items.push(normalizeScalar(value));
      }
      cursor = nextCursor;
    }

    return [items, cursor + 1];
  }

  if (marker === MSDP_TABLE_OPEN) {
    const table: Record<string, MudValue> = {};
    let cursor = index + 1;

    while (cursor < payload.length && payload[cursor] !== MSDP_TABLE_CLOSE) {
      if (payload[cursor] !== MSDP_VAR) {
        cursor += 1;
        continue;
      }

      cursor += 1;
      const [key, nextCursor] = readScalar(payload, cursor);
      cursor = nextCursor;

      if (payload[cursor] !== MSDP_VAL) {
        continue;
      }

      cursor += 1;
      const [value, afterValue] = readValue(payload, cursor);
      cursor = afterValue;

      if (key) {
        table[key] = value;
      }
    }

    return [table, cursor + 1];
  }

  const [value, nextIndex] = readScalar(payload, index);
  return [normalizeScalar(value), nextIndex];
}

function readScalar(payload: Buffer, index: number): [string, number] {
  const bytes: number[] = [];
  let cursor = index;

  while (cursor < payload.length && !CONTROL_BYTES.has(payload[cursor])) {
    bytes.push(payload[cursor]);
    cursor += 1;
  }

  return [Buffer.from(bytes).toString('utf8'), cursor];
}

function normalizeScalar(value: string): MudValue {
  if (/^-?\d+$/.test(value)) {
    return Number(value);
  }

  return value;
}
