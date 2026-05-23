import type { ConnectionOptions, JobsOptions } from 'bullmq';
import { env } from '../config/env';

export const parseRedisConnection = (redisUrl: string): ConnectionOptions => {
  const url = new URL(redisUrl);

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 6379,
    username: url.username || undefined,
    password: url.password || undefined,
    maxRetriesPerRequest: null,
  };
};

export const getQueueConnection = (): ConnectionOptions => {
  return parseRedisConnection(env.REDIS_URL);
};

export const DEFAULT_JOB_OPTIONS: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2_000,
  },
  removeOnComplete: {
    count: 100,
  },
  removeOnFail: {
    count: 200,
  },
};
