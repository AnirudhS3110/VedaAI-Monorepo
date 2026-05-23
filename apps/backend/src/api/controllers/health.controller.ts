import type { Request, Response } from 'express';
import { env } from '../../config/env';
import { isDatabaseConnected } from '../../config/db';
import { isRedisConnected } from '../../config/redis';
import type { ApiSuccessResponse } from '../../types/api.types';

interface ServiceHealth {
  enabled: boolean;
  connected: boolean;
}

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  services: {
    mongodb: ServiceHealth;
    redis: ServiceHealth;
    websocket: boolean;
  };
}

const isServiceHealthy = (enabled: boolean, connected: boolean): boolean =>
  !enabled || connected;

export const getHealth = (_req: Request, res: Response): void => {
  const mongodbConnected = isDatabaseConnected();
  const redisConnected = isRedisConnected();

  const mongodbHealthy = isServiceHealthy(
    env.ENABLE_MONGODB,
    mongodbConnected,
  );
  const redisHealthy = isServiceHealthy(env.ENABLE_REDIS, redisConnected);
  const allHealthy = mongodbHealthy && redisHealthy;

  const response: ApiSuccessResponse<HealthData> = {
    success: true,
    data: {
      status: allHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        mongodb: {
          enabled: env.ENABLE_MONGODB,
          connected: mongodbConnected,
        },
        redis: {
          enabled: env.ENABLE_REDIS,
          connected: redisConnected,
        },
        websocket: true,
      },
    },
  };

  res.status(allHealthy ? 200 : 503).json(response);
};
