import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '../../config/env';
import { AppError } from '../../types/errors';
import type { ApiErrorResponse } from '../../types/api.types';
import { logger } from '../../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        statusCode: 400,
        details: err.flatten().fieldErrors as Record<
          string,
          string[] | undefined
        >,
      },
    };
    res.status(400).json(response);
    return;
  }

  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err }, 'Non-operational error');
    }

    const response: ApiErrorResponse = {
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  logger.error({ err }, 'Unhandled error');

  const response: ApiErrorResponse = {
    success: false,
    error: {
      message:
        env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
      statusCode: 500,
    },
  };

  res.status(500).json(response);
};
