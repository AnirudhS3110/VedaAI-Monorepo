import Redis from 'ioredis';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import {
  GENERATION_EVENTS_CHANNEL,
  type PublishedGenerationEvent,
} from './generation.publisher';

let subscriberClient: Redis | null = null;

export const subscribeToGenerationEvents = (
  handler: (event: PublishedGenerationEvent) => void,
): void => {
  subscriberClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });

  void subscriberClient.subscribe(GENERATION_EVENTS_CHANNEL);

  subscriberClient.on('message', (_channel: string, message: string) => {
    try {
      const parsed = JSON.parse(message) as PublishedGenerationEvent;
      handler(parsed);
    } catch (error) {
      logger.error({ err: error, message }, 'Failed to parse generation event');
    }
  });

  logger.info('Subscribed to generation events channel');
};

export const closeGenerationSubscriber = async (): Promise<void> => {
  if (!subscriberClient) {
    return;
  }
  await subscriberClient.quit();
  subscriberClient = null;
  logger.info('Generation events subscriber closed');
};
