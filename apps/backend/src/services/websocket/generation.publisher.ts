import Redis from 'ioredis';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import type {
  GenerationEventName,
  GenerationEventPayload,
} from '../../types/websocket.types';
import { cacheGenerationState } from './generationState.cache';

export const GENERATION_EVENTS_CHANNEL = 'vedaai:generation-events';

export interface PublishedGenerationEvent {
  event: GenerationEventName;
  payload: GenerationEventPayload;
}

let publisherClient: Redis | null = null;

const getPublisherClient = (): Redis => {
  if (!publisherClient) {
    publisherClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
  }
  return publisherClient;
};

export const publishGenerationEvent = async (
  event: PublishedGenerationEvent,
): Promise<void> => {
  const client = getPublisherClient();
  await cacheGenerationState(event);
  await client.publish(GENERATION_EVENTS_CHANNEL, JSON.stringify(event));
  logger.debug(
    { event: event.event, assignmentId: event.payload.assignmentId },
    'Generation event published',
  );
};

export const closeGenerationPublisher = async (): Promise<void> => {
  if (!publisherClient) {
    return;
  }
  await publisherClient.quit();
  publisherClient = null;
};
