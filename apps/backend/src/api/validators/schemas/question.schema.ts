import { z } from 'zod';
import {
  QUESTION_DIFFICULTIES,
  QUESTION_TYPES,
} from '../../../types/domain.types';
import {
  validateAnswerForType,
  validateMcqFields,
  validateQuestionText,
} from './answer-validation';
import { validateQuestionSemantics } from './question-semantics.validation';
import { logValidationFailure, failureMessage } from './validation-logger';

export const questionTypeSchema = z.enum(QUESTION_TYPES);

export const questionDifficultySchema = z.enum(QUESTION_DIFFICULTIES);

export const marksSchema = z
  .union([z.number(), z.string()])
  .transform((value) => {
    const numeric =
      typeof value === 'number' ? value : Number.parseFloat(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return 1;
    }
    return Math.max(1, Math.round(numeric));
  })
  .pipe(z.number().int().positive('Marks must be at least 1'));

const questionBaseSchema = z.object({
  text: z.string().trim().min(1, 'Question text is required'),
  difficulty: questionDifficultySchema,
  marks: marksSchema,
  type: questionTypeSchema,
  answer: z.string().trim().optional(),
  options: z.array(z.string().trim().min(1)).optional(),
  correctAnswer: z.string().trim().optional(),
});

const logAndIssue = (
  ctx: z.RefinementCtx,
  path: (string | number)[],
  failure: {
    validator: string;
    reason: string;
    question?: string;
    questionType?: (typeof QUESTION_TYPES)[number];
  },
): void => {
  logValidationFailure(failure);
  ctx.addIssue({
    code: 'custom',
    path,
    message: failureMessage(failure),
  });
};

export const questionSchema = questionBaseSchema.superRefine((data, ctx) => {
  const textError = validateQuestionText(data.text);
  if (textError) {
    logAndIssue(ctx, ['text'], {
      validator: 'questionTextQualityRule',
      reason: textError,
      question: data.text,
      questionType: data.type,
    });
  }

  const semanticFailure = validateQuestionSemantics(
    data.type,
    data.text,
    data.options,
  );
  if (semanticFailure) {
    logAndIssue(ctx, ['text'], semanticFailure);
  }

  if (data.type === 'mcq') {
    if (data.options && data.options.length !== 4) {
      logAndIssue(ctx, ['options'], {
        validator: 'mcqOptionCountRule',
        reason: 'MCQ questions must have exactly 4 options',
        question: data.text,
        questionType: data.type,
      });
    }

    const mcqError = validateMcqFields(data.options, data.correctAnswer);
    if (mcqError) {
      logAndIssue(ctx, ['options'], {
        validator: 'mcqFieldsRule',
        reason: mcqError,
        question: data.text,
        questionType: data.type,
      });
    }
    return;
  }

  if (data.options && data.options.length > 0) {
    logAndIssue(ctx, ['options'], {
      validator: 'nonMcqOptionsRule',
      reason: `Options are only allowed for MCQ questions, not ${data.type}`,
      question: data.text,
      questionType: data.type,
    });
  }

  const answer = data.answer?.trim() ?? '';
  if (!answer) {
    logAndIssue(ctx, ['answer'], {
      validator: 'missingAnswerRule',
      reason: 'Answer is required for this question type',
      question: data.text,
      questionType: data.type,
    });
    return;
  }

  const answerError = validateAnswerForType(data.type, answer);
  if (answerError) {
    logAndIssue(ctx, ['answer'], {
      validator: 'answerForTypeRule',
      reason: answerError,
      question: data.text,
      questionType: data.type,
    });
  }
});

export type QuestionInput = z.infer<typeof questionSchema>;
