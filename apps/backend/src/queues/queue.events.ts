import type { Queue } from 'bullmq';
import { logger } from '../utils/logger';
import type { QueueName } from '../types/queue.types';

export const attachQueueEventLogging = (
  queue: Queue,
  queueName: QueueName,
): void => {
  queue.on('error', (error: Error) => {
    logger.error({ err: error, queueName }, 'Queue error');
  });

  queue.on('waiting', (job) => {
    logger.debug(
      { queueName, jobId: job.id, jobName: job.name },
      'Job waiting',
    );
  });
};
