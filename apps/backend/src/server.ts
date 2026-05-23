import 'dotenv/config';
import { createServer } from 'http';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/db';
import { connectRedis, disconnectRedis } from './config/redis';
import { closeQueues, initializeQueues } from './queues';
import { createApp } from './app';
import {
  closeGenerationSubscriber,
  subscribeToGenerationEvents,
} from './services/websocket/generation.subscriber';
import { socketService } from './services/websocket/socket.service';
import { logger } from './utils/logger';

const app = createApp();
const httpServer = createServer(app);

let isShuttingDown = false;

const startHttpServer = (): void => {
  httpServer.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, env: env.NODE_ENV },
      'VedaAI API server started',
    );
  });
};

const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  logger.info({ signal }, 'Shutting down gracefully');

  await new Promise<void>((resolve, reject) => {
    httpServer.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  await socketService.close();

  if (env.ENABLE_MONGODB) {
    await disconnectDatabase();
  }

  if (env.ENABLE_REDIS) {
    await closeGenerationSubscriber();
    await closeQueues();
    await disconnectRedis();
  }

  logger.info('Shutdown complete');
  process.exit(0);
};

const bootstrap = async (): Promise<void> => {
  try {
    if (env.ENABLE_MONGODB) {
      logger.info('Connecting to MongoDB...');
      await connectDatabase();
    } else {
      logger.info('MongoDB connection skipped (ENABLE_MONGODB=false)');
    }

    if (env.ENABLE_REDIS) {
      logger.info('Connecting to Redis...');
      await connectRedis();
      initializeQueues();
      subscribeToGenerationEvents((event) => {
        socketService.dispatchGenerationEvent(event);
      });
    } else {
      logger.info('Redis connection skipped (ENABLE_REDIS=false)');
    }

    socketService.initialize(httpServer);
    startHttpServer();
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to initialize application');
    process.exit(1);
  }
};

httpServer.on('error', (error: Error) => {
  logger.fatal({ err: error }, 'Failed to start HTTP server');
  process.exit(1);
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

void bootstrap();
