import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

const HASH_PREFIX = 'scrypt';
const KEY_LENGTH = 64;

type ScryptParams = { N: number; r: number; p: number; maxmem: number };

@Injectable()
export class PasswordHasher {
  private readonly params: ScryptParams;

  constructor() {
    const N = numberFromEnv('LIBIF_SCRYPT_N', 131_072);
    const r = numberFromEnv('LIBIF_SCRYPT_R', 8);
    const p = numberFromEnv('LIBIF_SCRYPT_P', 1);
    const maxmem = numberFromEnv('LIBIF_SCRYPT_MAXMEM', 192 * 1024 * 1024);
    this.params = { N, r, p, maxmem };
  }

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16);
    const derived = await this.derive(password, salt, this.params);
    return `${HASH_PREFIX}$N=${this.params.N},r=${this.params.r},p=${this.params.p}$${salt.toString('base64')}$${derived.toString('base64')}`;
  }

  async verify(password: string, storedHash: string): Promise<boolean> {
    const parsed = parseStoredHash(storedHash);
    if (!parsed) return false;
    const candidate = await this.derive(password, parsed.salt, parsed.params);
    if (candidate.byteLength !== parsed.derived.byteLength) return false;
    return timingSafeEqual(candidate, parsed.derived);
  }

  private derive(password: string, salt: Buffer, params: ScryptParams): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      scrypt(password, salt, KEY_LENGTH, params, (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey as Buffer);
      });
    });
  }
}

function numberFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseStoredHash(storedHash: string): { params: ScryptParams; salt: Buffer; derived: Buffer } | undefined {
  const [prefix, paramsRaw, saltRaw, derivedRaw] = storedHash.split('$');
  if (prefix !== HASH_PREFIX || !paramsRaw || !saltRaw || !derivedRaw) return undefined;
  const values = Object.fromEntries(paramsRaw.split(',').map((part) => part.split('=')));
  const N = Number(values.N);
  const r = Number(values.r);
  const p = Number(values.p);
  if (![N, r, p].every((value) => Number.isFinite(value) && value > 0)) return undefined;
  const maxmem = Math.max(64 * 1024 * 1024, 128 * N * r * p + 64 * 1024 * 1024);
  return {
    params: { N, r, p, maxmem },
    salt: Buffer.from(saltRaw, 'base64'),
    derived: Buffer.from(derivedRaw, 'base64')
  };
}
