import { Worker, type Job } from 'bullmq';
import { getQueueConnection } from '../queues/queue.config';
import { processAssessmentGeneration } from '../services/generation/assessmentGeneration.service';
import { logger } from '../utils/logger';
import {
  QUEUE_NAMES,
  type AssessmentGenerationJobData,
  type AssessmentGenerationJobName,
} from '../types/queue.types';

let assessmentWorker: Worker<
  AssessmentGenerationJobData,
  void,
  AssessmentGenerationJobName
> | null = null;

export const createAssessmentWorker = (): Worker<
  AssessmentGenerationJobData,
  void,
  AssessmentGenerationJobName
> => {
  if (assessmentWorker) {
    return assessmentWorker;
  }

  assessmentWorker = new Worker<
    AssessmentGenerationJobData,
    void,
    AssessmentGenerationJobName
  >(
    QUEUE_NAMES.ASSESSMENT_GENERATION,
    async (job: Job<AssessmentGenerationJobData, void, AssessmentGenerationJobName>) => {
      const { assignmentId } = job.data;
      logger.info(
        { jobId: job.id, assignmentId, attempt: job.attemptsMade + 1 },
        'Processing assessment generation job',
      );
      const maxAttempts = job.opts.attempts ?? 3;
      const attemptNumber = job.attemptsMade + 1;

      await processAssessmentGeneration(assignmentId, {
        attemptNumber,
        maxAttempts,
        isLastAttempt: attemptNumber >= maxAttempts,
      });
    },
    {
      connection: getQueueConnection(),
      concurrency: 2,
    },
  );

  assessmentWorker.on('ready', () => {
    logger.info(
      { queueName: QUEUE_NAMES.ASSESSMENT_GENERATION },
      'Assessment worker ready',
    );
  });

  assessmentWorker.on('active', (job) => {
    logger.info(
      { jobId: job.id, assignmentId: job.data.assignmentId },
      'Assessment job active',
    );
  });

  assessmentWorker.on('completed', (job) => {
    logger.info(
      { jobId: job.id, assignmentId: job.data.assignmentId },
      'Assessment job completed',
    );
  });

  assessmentWorker.on('failed', (job, error) => {
    logger.error(
      {
        err: error,
        jobId: job?.id,
        assignmentId: job?.data.assignmentId,
      },
      'Assessment job failed',
    );
  });

  assessmentWorker.on('error', (error) => {
    logger.error({ err: error }, 'Assessment worker error');
  });

  logger.info(
    { queueName: QUEUE_NAMES.ASSESSMENT_GENERATION },
    'Assessment worker created',
  );

  return assessmentWorker;
};

export const closeAssessmentWorker = async (): Promise<void> => {
  if (!assessmentWorker) {
    return;
  }

  await assessmentWorker.close();
  assessmentWorker = null;
  logger.info('Assessment worker closed');
};
