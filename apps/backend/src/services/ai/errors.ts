import { ZodError } from 'zod';

/** Validation, parsing, and AI output errors are retried by BullMQ */
export const isRetryableGenerationError = (error: unknown): boolean =>
  error instanceof AiGenerationError;

export class AiGenerationError extends Error {
  public readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'AiGenerationError';
    this.cause = cause;
    Object.setPrototypeOf(this, AiGenerationError.prototype);
  }
}

export class AiParseError extends AiGenerationError {
  public readonly zodError?: ZodError;

  constructor(message: string, zodError?: ZodError) {
    super(message, zodError);
    this.name = 'AiParseError';
    this.zodError = zodError;
    Object.setPrototypeOf(this, AiParseError.prototype);
  }
}
