import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';
import { maskConnectionUri } from '../utils/maskUri';

let redisClient: Redis | null = null;

const attachRedisListeners = (client: Redis): void => {
  client.on('connect', () => {
    logger.info('Redis socket connected');
  });

  client.on('ready', () => {
    logger.info('Redis connection ready');
  });

  client.on('error', (error: Error) => {
    logger.error({ err: error }, 'Redis connection error');
  });

  client.on('close', () => {
    logger.warn('Redis connection closed');
  });

  client.on('reconnecting', (delay: number) => {
    logger.info({ delay }, 'Redis reconnecting');
  });
};

export const connectRedis = async (): Promise<void> => {
  if (!env.REDIS_URL) {
    throw new Error('REDIS_URL is required but not set');
  }

  if (redisClient?.status === 'ready') {
    logger.debug('Redis already connected');
    return;
  }

  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    connectTimeout: 5_000,
    retryStrategy: (times: number) => {
      if (times > 3) {
        return null;
      }
      return Math.min(times * 200, 2_000);
    },
  });

  attachRedisListeners(client);

  await client.ping();

  redisClient = client;

  logger.info(
    { url: maskConnectionUri(env.REDIS_URL) },
    'Redis connection established',
  );
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    throw new Error('Redis client is not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
  if (!redisClient) {
    return;
  }

  const client = redisClient;
  redisClient = null;

  await client.quit();
  logger.info('Redis connection closed');
};

export const isRedisConnected = (): boolean => {
  return redisClient?.status === 'ready';
};
