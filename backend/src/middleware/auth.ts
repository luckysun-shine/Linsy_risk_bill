import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { verifyAccessToken, authenticateApiKey } from '../services/authService';
import { UnauthorizedError } from '../utils/errors';
import { JwtPayload } from '../types';

export interface AuthContext {
  type: 'jwt' | 'api_key';
  userId?: string;
  username?: string;
  role?: string;
  apiKeyId?: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await attachAuth(req);
    next();
  } catch {
    next();
  }
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await attachAuth(req);
    if (!req.auth) {
      throw new UnauthorizedError('Authentication required');
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.auth || req.auth.type !== 'jwt' || req.auth.role !== 'admin') {
    next(new UnauthorizedError('Admin access required'));
    return;
  }
  next();
}

async function attachAuth(req: Request): Promise<void> {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;

  if (bearer) {
    const payload: JwtPayload = verifyAccessToken(bearer);
    req.auth = {
      type: 'jwt',
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
    return;
  }

  const apiKeyHeader = req.headers[env.API_KEY_HEADER.toLowerCase()] as string | undefined;
  const apiKey =
    apiKeyHeader ||
    (typeof req.query.api_key === 'string' ? req.query.api_key : undefined);

  if (apiKey) {
    const ctx = await authenticateApiKey(apiKey);
    req.auth = {
      type: 'api_key',
      apiKeyId: ctx.apiKeyId,
      userId: ctx.userId ?? undefined,
    };
  }
}
