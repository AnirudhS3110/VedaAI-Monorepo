import type { Request } from 'express';

export const getValidatedBody = <T>(req: Request): T => {
  if (req.validated?.body === undefined) {
    throw new Error('Request body has not been validated');
  }
  return req.validated.body as T;
};

export const getValidatedParams = <T>(req: Request): T => {
  if (req.validated?.params === undefined) {
    throw new Error('Request params have not been validated');
  }
  return req.validated.params as T;
};

export const getValidatedQuery = <T>(req: Request): T => {
  if (req.validated?.query === undefined) {
    throw new Error('Request query has not been validated');
  }
  return req.validated.query as T;
};
