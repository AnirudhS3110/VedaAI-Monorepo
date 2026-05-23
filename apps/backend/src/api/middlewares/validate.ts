import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';

type ValidationTarget = 'body' | 'params' | 'query';

const parseTarget = <T>(
  schema: ZodType<T>,
  data: unknown,
): T => {
  return schema.parse(data);
};

export const validate = <T>(
  schema: ZodType<T>,
  target: ValidationTarget = 'body',
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = parseTarget(schema, req[target]);

      req.validated ??= {};
      req.validated[target] = parsed;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateBody = <T>(schema: ZodType<T>): RequestHandler =>
  validate(schema, 'body');

export const validateParams = <T>(schema: ZodType<T>): RequestHandler =>
  validate(schema, 'params');

export const validateQuery = <T>(schema: ZodType<T>): RequestHandler =>
  validate(schema, 'query');
