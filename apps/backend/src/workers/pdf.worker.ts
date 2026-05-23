import { Worker, type Job } from 'bullmq';
import { getQueueConnection } from '../queues/queue.config';
import { processPdfGeneration } from '../services/pdf/pdfGeneration.service';
import { logger } from '../utils/logger';
import {
  QUEUE_NAMES,
  type PdfGenerationJobData,
  type PdfGenerationJobName,
} from '../types/queue.types';

let pdfWorker: Worker<
  PdfGenerationJobData,
  void,
  PdfGenerationJobName
> | null = null;

export const createPdfWorker = (): Worker<
  PdfGenerationJobData,
  void,
  PdfGenerationJobName
> => {
  if (pdfWorker) {
    return pdfWorker;
  }

  pdfWorker = new Worker<PdfGenerationJobData, void, PdfGenerationJobName>(
    QUEUE_NAMES.PDF_GENERATION,
    async (job: Job<PdfGenerationJobData, void, PdfGenerationJobName>) => {
      const { assignmentId } = job.data;
      logger.info(
        { jobId: job.id, assignmentId, attempt: job.attemptsMade + 1 },
        'Processing PDF generation job',
      );
      await processPdfGeneration(assignmentId);
    },
    {
      connection: getQueueConnection(),
      concurrency: 1,
    },
  );

  pdfWorker.on('ready', () => {
    logger.info({ queueName: QUEUE_NAMES.PDF_GENERATION }, 'PDF worker ready');
  });

  pdfWorker.on('active', (job) => {
    logger.info(
      { jobId: job.id, assignmentId: job.data.assignmentId },
      'PDF job active',
    );
  });

  pdfWorker.on('completed', (job) => {
    logger.info(
      { jobId: job.id, assignmentId: job.data.assignmentId },
      'PDF job completed',
    );
  });

  pdfWorker.on('failed', (job, error) => {
    logger.error(
      {
        err: error,
        jobId: job?.id,
        assignmentId: job?.data.assignmentId,
      },
      'PDF job failed',
    );
  });

  pdfWorker.on('error', (error) => {
    logger.error({ err: error }, 'PDF worker error');
  });

  logger.info({ queueName: QUEUE_NAMES.PDF_GENERATION }, 'PDF worker created');

  return pdfWorker;
};

export const closePdfWorker = async (): Promise<void> => {
  if (!pdfWorker) {
    return;
  }

  await pdfWorker.close();
  pdfWorker = null;
  logger.info('PDF worker closed');
};
