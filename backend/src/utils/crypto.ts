import crypto from 'crypto';

const API_KEY_PREFIX = 'zb_';

export function generateApiKey(): { rawKey: string; prefix: string; hash: string } {
  const random = crypto.randomBytes(24).toString('base64url');
  const rawKey = `${API_KEY_PREFIX}${random}`;
  const prefix = rawKey.slice(0, 12);
  const hash = hashApiKey(rawKey);
  return { rawKey, prefix, hash };
}

export function hashApiKey(rawKey: string): string {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

export function generateBillToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function tokenPrefix(token: string): string {
  return token.slice(0, 8);
}
