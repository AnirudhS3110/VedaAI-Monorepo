import 'dotenv/config';
import { connectDatabase, disconnectDatabase } from './config/db';
import { connectRedis, disconnectRedis } from './config/redis';
import { closeGenerationPublisher } from './services/websocket/generation.publisher';
import { logger } from './utils/logger';
import {
  closeAssessmentWorker,
  createAssessmentWorker,
} from './workers/assessment.worker';
import { closePdfWorker, createPdfWorker } from './workers/pdf.worker';

let isShuttingDown = false;

const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  logger.info({ signal }, 'Worker shutting down');

  await closeAssessmentWorker();
  await closePdfWorker();
  await closeGenerationPublisher();
  await disconnectDatabase();
  await disconnectRedis();

  logger.info('Worker shutdown complete');
  process.exit(0);
};


console.log(process.env.GEMINI_API_KEY);

const bootstrap = async (): Promise<void> => {
  if (!true) {
    logger.fatal('Worker requires ENABLE_MONGODB=true');
    process.exit(1);
  }

  if (!true) {
    logger.fatal('Worker requires ENABLE_REDIS=true');
    process.exit(1);
  }

  try {
    logger.info('Starting worker process...');
    await connectDatabase();
    await connectRedis();
    createAssessmentWorker();
    createPdfWorker();
    logger.info('Worker process running (assessment + PDF)');
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start worker process');
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

void bootstrap();
