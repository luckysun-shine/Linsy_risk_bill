import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload, User, UserRole } from '../types';
import { findUserByUsername } from '../models/users';
import { findApiKeyByHash, touchApiKeyLastUsed } from '../models/apiKeys';
import { findUserByApiKeyHash } from '../models/users';
import { hashApiKey } from '../utils/crypto';
import { verifyPassword } from '../utils/password';
import { UnauthorizedError } from '../utils/errors';

export function signAccessToken(user: Pick<User, 'id' | 'username' | 'role'>): string {
  const payload: JwtPayload = {
    sub: user.id,
    username: user.username,
    role: user.role,
    type: 'access',
  };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (decoded.type !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }
    return decoded;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export async function loginAdmin(username: string, password: string): Promise<{
  token: string;
  user: User;
}> {
  const user = await findUserByUsername(username);
  if (!user || !user.is_active || user.role !== 'admin') {
    throw new UnauthorizedError('Invalid credentials');
  }
  if (!user.password_hash) {
    throw new UnauthorizedError('Invalid credentials');
  }
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    throw new UnauthorizedError('Invalid credentials');
  }
  const { password_hash: _p, api_key_hash: _a, ...safeUser } = user;
  return {
    token: signAccessToken(safeUser),
    user: safeUser,
  };
}

export async function authenticateApiKey(rawKey: string): Promise<{
  type: 'api_key';
  apiKeyId: string;
  userId: string | null;
}> {
  const keyHash = hashApiKey(rawKey);

  const apiKey = await findApiKeyByHash(keyHash);
  if (apiKey) {
    await touchApiKeyLastUsed(apiKey.id);
    return { type: 'api_key', apiKeyId: apiKey.id, userId: apiKey.user_id };
  }

  const user = await findUserByApiKeyHash(keyHash);
  if (user) {
    return { type: 'api_key', apiKeyId: user.id, userId: user.id };
  }

  throw new UnauthorizedError('Invalid API key');
}

export function assertAdmin(role: UserRole): void {
  if (role !== 'admin') {
    throw new UnauthorizedError('Admin access required');
  }
}
