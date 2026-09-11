import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

/** Admin JWT or API key (for import / service integrations). */
export function requireServiceAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.auth) {
    next(new UnauthorizedError('Authentication required'));
    return;
  }
  if (req.auth.type === 'api_key') {
    next();
    return;
  }
  if (req.auth.type === 'jwt' && req.auth.role === 'admin') {
    next();
    return;
  }
  next(new ForbiddenError('Insufficient permissions'));
}
