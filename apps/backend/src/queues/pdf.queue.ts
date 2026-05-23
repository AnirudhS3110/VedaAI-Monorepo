import { Queue } from 'bullmq';
import { env } from '../config/env';
import { isRedisConnected } from '../config/redis';
import { logger } from '../utils/logger';
import {
  QUEUE_NAMES,
  type PdfGenerationJobData,
  type PdfGenerationJobName,
} from '../types/queue.types';
import { DEFAULT_JOB_OPTIONS, getQueueConnection } from './queue.config';
import { attachQueueEventLogging } from './queue.events';

let pdfQueue: Queue<
  PdfGenerationJobData,
  void,
  PdfGenerationJobName
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

export const getPdfQueue = (): Queue<
  PdfGenerationJobData,
  void,
  PdfGenerationJobName
> => {
  assertRedisAvailable();

  if (!pdfQueue) {
    pdfQueue = new Queue<PdfGenerationJobData, void, PdfGenerationJobName>(
      QUEUE_NAMES.PDF_GENERATION,
      {
        connection: getQueueConnection(),
        defaultJobOptions: DEFAULT_JOB_OPTIONS,
      },
    );

    attachQueueEventLogging(pdfQueue, QUEUE_NAMES.PDF_GENERATION);
    logger.info(
      { queueName: QUEUE_NAMES.PDF_GENERATION },
      'PDF queue initialized',
    );
  }

  return pdfQueue;
};

export const enqueuePdfGeneration = async (
  assignmentId: string,
): Promise<string> => {
  const queue = getPdfQueue();

  const job = await queue.add(
    'generate-pdf',
    { assignmentId },
    {
      jobId: `pdf-${assignmentId}-${Date.now()}`,
    },
  );

  if (!job.id) {
    throw new Error('Failed to enqueue PDF generation job');
  }

  logger.info(
    { assignmentId, jobId: job.id, queueName: QUEUE_NAMES.PDF_GENERATION },
    'PDF generation job enqueued',
  );

  return job.id;
};

export const closePdfQueue = async (): Promise<void> => {
  if (!pdfQueue) {
    return;
  }

  await pdfQueue.close();
  pdfQueue = null;
  logger.info({ queueName: QUEUE_NAMES.PDF_GENERATION }, 'PDF queue closed');
};
