import { logger } from '../utils/logger';
import { closeAssessmentQueue, getAssessmentQueue } from './assessment.queue';
import { closePdfQueue, getPdfQueue } from './pdf.queue';

export {
  enqueueAssessmentGeneration,
  getAssessmentQueue,
  closeAssessmentQueue,
} from './assessment.queue';
export { enqueuePdfGeneration, getPdfQueue, closePdfQueue } from './pdf.queue';
export { DEFAULT_JOB_OPTIONS, getQueueConnection } from './queue.config';

export const initializeQueues = (): void => {
  getAssessmentQueue();
  getPdfQueue();
  logger.info('BullMQ queues initialized');
};

export const closeQueues = async (): Promise<void> => {
  await Promise.all([closeAssessmentQueue(), closePdfQueue()]);
  logger.info('All BullMQ queues closed');
};
