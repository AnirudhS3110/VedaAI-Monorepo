import Redis from 'ioredis';
import { Types } from 'mongoose';
import { Assignment } from '../../models/assignment.model';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import {
  GENERATION_EVENTS,
  type GenerationEventName,
  type GenerationEventPayload,
  type GenerationStatus,
} from '../../types/websocket.types';
import type { PublishedGenerationEvent } from './generation.publisher';

const STATE_KEY_PREFIX = 'vedaai:generation-state:';
const STATE_TTL_SECONDS = 3600;

let redisClient: Redis | null = null;

const getRedis = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
  }
  return redisClient;
};

const stateKey = (assignmentId: string): string =>
  `${STATE_KEY_PREFIX}${assignmentId}`;

export const cacheGenerationState = async (
  published: PublishedGenerationEvent,
): Promise<void> => {
  try {
    const redis = getRedis();
    await redis.setex(
      stateKey(published.payload.assignmentId),
      STATE_TTL_SECONDS,
      JSON.stringify(published),
    );
  } catch (error) {
    logger.warn(
      { err: error, assignmentId: published.payload.assignmentId },
      'Failed to cache generation state',
    );
  }
};

export const getCachedGenerationState = async (
  assignmentId: string,
): Promise<PublishedGenerationEvent | null> => {
  try {
    const redis = getRedis();
    const raw = await redis.get(stateKey(assignmentId));
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as PublishedGenerationEvent;
  } catch (error) {
    logger.warn({ err: error, assignmentId }, 'Failed to read cached generation state');
    return null;
  }
};

const buildSyntheticEvent = (
  assignmentId: string,
  event: GenerationEventName,
  status: GenerationStatus,
  progress: number,
  message: string,
): PublishedGenerationEvent => ({
  event,
  payload: { assignmentId, status, progress, message },
});

/** Fallback when Redis cache is empty (e.g. client subscribed late). */
export const getGenerationStateFromAssignment = async (
  assignmentId: string,
): Promise<PublishedGenerationEvent | null> => {
  if (!Types.ObjectId.isValid(assignmentId)) {
    return null;
  }

  const assignment = await Assignment.findById(assignmentId).lean();
  if (!assignment) {
    return null;
  }

  switch (assignment.status) {
    case 'pending':
      return buildSyntheticEvent(
        assignmentId,
        GENERATION_EVENTS.PROGRESS,
        'generating',
        5,
        'Queued for generation…',
      );
    case 'generating':
      return buildSyntheticEvent(
        assignmentId,
        GENERATION_EVENTS.PROGRESS,
        'generating',
        25,
        'AI is generating your question paper…',
      );
    case 'completed':
      return buildSyntheticEvent(
        assignmentId,
        GENERATION_EVENTS.COMPLETED,
        'completed',
        100,
        'Generation completed',
      );
    case 'failed':
      return buildSyntheticEvent(
        assignmentId,
        GENERATION_EVENTS.FAILED,
        'failed',
        0,
        'Generation failed',
      );
    default:
      return null;
  }
};

export const resolveReplayGenerationState = async (
  assignmentId: string,
): Promise<PublishedGenerationEvent | null> => {
  const cached = await getCachedGenerationState(assignmentId);
  if (cached) {
    return cached;
  }
  return getGenerationStateFromAssignment(assignmentId);
};

export type SubscribeAckPayload = GenerationEventPayload & {
  replayed: boolean;
};

export const toSubscribeAck = (
  published: PublishedGenerationEvent,
  replayed: boolean,
): SubscribeAckPayload => ({
  ...published.payload,
  replayed,
});
