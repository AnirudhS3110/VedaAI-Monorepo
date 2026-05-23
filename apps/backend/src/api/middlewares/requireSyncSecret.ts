import type { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { UnauthorizedError } from '../../types/errors';

export const requireSyncSecret = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const secret = req.header('x-auth-sync-secret');

  if (env.NODE_ENV === 'development' && !env.AUTH_SYNC_SECRET) {
    next();
    return;
  }

  if (!env.AUTH_SYNC_SECRET || secret !== env.AUTH_SYNC_SECRET) {
    next(new UnauthorizedError('Invalid sync credentials'));
    return;
  }

  next();
};
