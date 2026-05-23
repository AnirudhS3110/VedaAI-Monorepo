import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';
import { maskConnectionUri } from '../utils/maskUri';

const registerConnectionListeners = (): void => {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected');
  });

  mongoose.connection.on('error', (error: Error) => {
    logger.error({ err: error }, 'MongoDB connection error');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
};

export const connectDatabase = async (): Promise<void> => {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required but not set');
  }

  if (mongoose.connection.readyState === 1) {
    logger.debug('MongoDB already connected');
    return;
  }

  registerConnectionListeners();

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5_000,
  });

  logger.info(
    { uri: maskConnectionUri(env.MONGODB_URI) },
    'MongoDB connection established',
  );
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  logger.info('MongoDB connection closed');
};

export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
