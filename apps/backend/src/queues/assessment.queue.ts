import { Queue } from 'bullmq';
import { env } from '../config/env';
import { isRedisConnected } from '../config/redis';
import { logger } from '../utils/logger';
import {
  QUEUE_NAMES,
  type AssessmentGenerationJobData,
  type AssessmentGenerationJobName,
} from '../types/queue.types';
import { DEFAULT_JOB_OPTIONS, getQueueConnection } from './queue.config';
import { attachQueueEventLogging } from './queue.events';

let assessmentQueue: Queue<
  AssessmentGenerationJobData,
  void,
  AssessmentGenerationJobName
> | null = null;

const assertRedisAvailable = (): void => {
  if (!env.ENABLE_REDIS) {
    throw new Error(
      'Redis is disabled. Set ENABLE_REDIS=true to use job queues.',
    );
  }

  if (!isRedisConnected()) {
    throw new Error('Redis is not connected. Cannot access job queues.');
  }
};

export const getAssessmentQueue = (): Queue<
  AssessmentGenerationJobData,
  void,
  AssessmentGenerationJobName
> => {
  assertRedisAvailable();

  if (!assessmentQueue) {
    assessmentQueue = new Queue<
      AssessmentGenerationJobData,
      void,
      AssessmentGenerationJobName
    >(QUEUE_NAMES.ASSESSMENT_GENERATION, {
      connection: getQueueConnection(),
      defaultJobOptions: DEFAULT_JOB_OPTIONS,
    });

    attachQueueEventLogging(assessmentQueue, QUEUE_NAMES.ASSESSMENT_GENERATION);
    logger.info(
      { queueName: QUEUE_NAMES.ASSESSMENT_GENERATION },
      'Assessment queue initialized',
    );
  }

  return assessmentQueue;
};

export const enqueueAssessmentGeneration = async (
  assignmentId: string,
): Promise<string> => {
  const queue = getAssessmentQueue();

  const job = await queue.add(
    'generate',
    { assignmentId },
    {
      jobId: `assessment-${assignmentId}`,
    },
  );

  if (!job.id) {
    throw new Error('Failed to enqueue assessment generation job');
  }

  logger.info(
    { assignmentId, jobId: job.id, queueName: QUEUE_NAMES.ASSESSMENT_GENERATION },
    'Assessment generation job enqueued',
  );

  return job.id;
};

export const closeAssessmentQueue = async (): Promise<void> => {
  if (!assessmentQueue) {
    return;
  }

  await assessmentQueue.close();
  assessmentQueue = null;
  logger.info(
    { queueName: QUEUE_NAMES.ASSESSMENT_GENERATION },
    'Assessment queue closed',
  );
};
