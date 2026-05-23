import { logger } from '../../utils/logger';
import { AiParseError } from './errors';
import { normalizeGeneratedPaperPayload } from './question-normalizer';
import { regeneratedSectionOutputSchema } from '../../api/validators/schemas/sectionOutput.schema';
import {
  validatePaperCoherence,
  type QuestionBlueprintItem,
} from '../../api/validators/schemas/question-semantics.validation';
import {
  failureMessage,
  logValidationFailure,
} from '../../api/validators/schemas/validation-logger';
import {
  generatedPaperOutputSchema,
  type GeneratedPaperOutput,
} from './schema';
import type { PaperSection, QuestionType } from '../../types/domain.types';

export interface ParsePaperOptions {
  questionBlueprint?: QuestionBlueprintItem[];
}

export const stripMarkdownJson = (raw: string): string => {
  let text = raw.trim();

  const fencedBlock = text.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  if (fencedBlock) {
    return fencedBlock[1].trim();
  }

  const inlineFence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (inlineFence) {
    return inlineFence[1].trim();
  }

  return text;
};

const extractJsonObject = (text: string): string => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new AiParseError('No JSON object found in AI response');
  }

  return text.slice(start, end + 1);
};

export const parseGeneratedPaperResponse = (
  rawResponse: string,
  options?: ParsePaperOptions,
): GeneratedPaperOutput => {
  const cleaned = stripMarkdownJson(rawResponse);

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned) as unknown;
  } catch {
    try {
      const extracted = extractJsonObject(cleaned);
      parsed = JSON.parse(extracted) as unknown;
    } catch (error) {
      logger.error({ err: error }, 'Failed to parse AI JSON response');
      throw new AiParseError('AI response is not valid JSON');
    }
  }

  const normalized = normalizeGeneratedPaperPayload(parsed);
  const validation = generatedPaperOutputSchema.safeParse(normalized);

  if (!validation.success) {
    logger.error(
      {
        errors: validation.error.flatten(),
        issues: validation.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      'AI output failed schema validation',
    );
    throw new AiParseError(
      'AI output failed validation',
      validation.error,
    );
  }

  const coherenceFailure = validatePaperCoherence(
    validation.data.sections,
    options?.questionBlueprint,
  );
  if (coherenceFailure) {
    logValidationFailure(coherenceFailure);
    throw new AiParseError(failureMessage(coherenceFailure));
  }

  return validation.data;
};

export const parseRegeneratedSectionResponse = (
  rawResponse: string,
  expectedType?: QuestionType,
): PaperSection => {
  const cleaned = stripMarkdownJson(rawResponse);

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned) as unknown;
  } catch {
    try {
      const extracted = extractJsonObject(cleaned);
      parsed = JSON.parse(extracted) as unknown;
    } catch (error) {
      logger.error({ err: error }, 'Failed to parse section JSON response');
      throw new AiParseError('AI section response is not valid JSON');
    }
  }

  const normalized = normalizeGeneratedPaperPayload(parsed);
  const validation = regeneratedSectionOutputSchema.safeParse(normalized);

  if (!validation.success) {
    logger.error(
  {
    errors: validation.error.flatten(),
    parsed,
  },
  'Regenerated section failed schema validation',
);
    throw new AiParseError(
      'Regenerated section failed validation',
      validation.error,
    );
  }

  const coherenceFailure = validatePaperCoherence(
    [validation.data],
    expectedType ? [{ type: expectedType, numQuestions: 1, marksPerQuestion: 1 }] : undefined,
  );
  if (coherenceFailure) {
    logValidationFailure(coherenceFailure);
    throw new AiParseError(failureMessage(coherenceFailure));
  }

  return validation.data;
};
