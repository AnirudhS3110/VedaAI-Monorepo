import type { QuestionType } from '../../../types/domain.types';
import { logger } from '../../../utils/logger';

export interface ValidationFailureContext {
  validator: string;
  reason: string;
  question?: string;
  questionType?: QuestionType;
  sectionTitle?: string;
}

/** Structured warn log for debugging AI output vs validator rules */
export const logValidationFailure = (
  context: ValidationFailureContext,
): void => {
  logger.warn(
    {
      validator: context.validator,
      reason: context.reason,
      question: context.question,
      questionType: context.questionType,
      sectionTitle: context.sectionTitle,
    },
    'Assessment validation failed',
  );
};

export const failureMessage = (failure: ValidationFailureContext): string =>
  failure.reason;
