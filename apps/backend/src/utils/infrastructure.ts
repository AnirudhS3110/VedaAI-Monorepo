import { env } from '../config/env';
import { isDatabaseConnected } from '../config/db';
import { AppError } from '../types/errors';

export const assertMongoAvailable = (): void => {
  if (!env.ENABLE_MONGODB) {
    throw new AppError(
      'Database is not available. Set ENABLE_MONGODB=true.',
      503,
    );
  }

  if (!isDatabaseConnected()) {
    throw new AppError('Database is not connected.', 503);
  }
};

export const assertRedisAvailable = (): void => {
  if (!env.ENABLE_REDIS) {
    throw new AppError(
      'Job queue is not available. Set ENABLE_REDIS=true.',
      503,
    );
  }
};
