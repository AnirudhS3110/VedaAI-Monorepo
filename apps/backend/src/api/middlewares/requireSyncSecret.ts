import type { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { UnauthorizedError } from '../../types/errors';
import { logger } from '../../utils/logger';

export const requireSyncSecret = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const secret = req.header('x-auth-sync-secret');

  // In development, if no AUTH_SYNC_SECRET is configured, allow the request through
  // but emit a warning. This lets local dev work without secrets, but the pattern
  // is explicit — the env var must be ABSENT, not simply wrong.
  if (env.NODE_ENV === 'development' && !env.AUTH_SYNC_SECRET) {
    logger.warn(
      'AUTH_SYNC_SECRET is not set. Sync endpoint is unprotected. Set AUTH_SYNC_SECRET in production.',
    );
    next();
    return;
  }

  // In all other cases (production, staging, or dev with secret configured),
  // the secret must match exactly.
  if (!env.AUTH_SYNC_SECRET || secret !== env.AUTH_SYNC_SECRET) {
    next(new UnauthorizedError('Invalid sync credentials'));
    return;
  }

  next();
};
