import type { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { getUserById } from '../../services/user/user.service';
import { UnauthorizedError } from '../../types/errors';

export const requireUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.header('x-user-id')?.trim();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      next(new UnauthorizedError('Missing or invalid user identity'));
      return;
    }

    const user = await getUserById(userId);

    if (!user) {
      next(new UnauthorizedError('User not found'));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
