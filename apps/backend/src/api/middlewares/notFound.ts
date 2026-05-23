import type { Request, Response } from 'express';
import type { ApiErrorResponse } from '../../types/api.types';

export const notFoundHandler = (_req: Request, res: Response): void => {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  };

  res.status(404).json(response);
};
