import type { QuestionType } from '../../../types/domain.types';
import type { ValidationFailureContext } from './validation-logger';

const BLANK_PLACEHOLDER_PATTERN = /_{2,}|\.{3,}|\[\s*blank\s*\]/i;
const FILL_BLANK_HINT_PATTERN = /fill\s+in\s+the\s+blank/i;

/** True/False mislabeled as essay-style prompts (structural mismatch only) */
const TRUE_FALSE_ESSAY_PROMPT =
  /^(explain|describe|discuss|analyze|analyse)\b/i;

export type SemanticValidationFailure = ValidationFailureContext;

export const inferSectionQuestionType = (
  title: string,
  instruction: string,
): QuestionType | null => {
  const combined = `${title} ${instruction}`.toLowerCase();

  if (
    /\b(mcq|multiple[\s-]?choice|objective)\b/.test(combined) ||
    /choose the correct/.test(combined)
  ) {
    return 'mcq';
  }
  if (/\b(true[\s/-]?false|t\/f)\b/.test(combined)) {
    return 'true_false';
  }
  if (/\b(fill[\s-]?in[\s-]?the[\s-]?blank|fill[\s-]?in[\s-]?blanks?)\b/.test(combined)) {
    return 'fill_blank';
  }
  if (/\b(short[\s-]?answer|brief[\s-]?answer)\b/.test(combined)) {
    return 'short';
  }
  if (/\b(long[\s-]?answer|essay|detailed[\s-]?answer)\b/.test(combined)) {
    return 'long';
  }

  return null;
};

export const hasBlankPlaceholder = (text: string): boolean =>
  BLANK_PLACEHOLDER_PATTERN.test(text) || FILL_BLANK_HINT_PATTERN.test(text);

/**
 * Structural / cross-type checks only — does not police academic phrasing.
 * Rejects obviously broken outputs, not natural LLM wording.
 */
export const validateQuestionSemantics = (
  type: QuestionType,
  text: string,
  options?: string[],
): SemanticValidationFailure | null => {
  const trimmed = text.trim();

  switch (type) {
    case 'mcq': {
      if (hasBlankPlaceholder(trimmed)) {
        return {
          validator: 'mcqBlankPlaceholderRule',
          reason: 'MCQ questions must not contain fill-in-the-blank placeholders',
          question: trimmed,
          questionType: type,
        };
      }
      if (FILL_BLANK_HINT_PATTERN.test(trimmed)) {
        return {
          validator: 'mcqFillBlankPhraseRule',
          reason: 'MCQ questions must not use fill-in-the-blank phrasing',
          question: trimmed,
          questionType: type,
        };
      }
      return null;
    }
    case 'true_false': {
      if (options && options.length > 0) {
        return {
          validator: 'trueFalseOptionsRule',
          reason: 'True/False questions must not include options',
          question: trimmed,
          questionType: type,
        };
      }
      if (hasBlankPlaceholder(trimmed)) {
        return {
          validator: 'trueFalseBlankRule',
          reason: 'True/False questions must not use blanks',
          question: trimmed,
          questionType: type,
        };
      }
      if (TRUE_FALSE_ESSAY_PROMPT.test(trimmed)) {
        return {
          validator: 'trueFalseEssayPromptRule',
          reason:
            'True/False question appears to be an essay-style prompt (Explain/Describe/Discuss…)',
          question: trimmed,
          questionType: type,
        };
      }
      return null;
    }
    case 'fill_blank': {
      if (options && options.length > 0) {
        return {
          validator: 'fillBlankOptionsRule',
          reason: 'Fill-in-the-blank questions must not include options',
          question: trimmed,
          questionType: type,
        };
      }
      if (!hasBlankPlaceholder(trimmed)) {
        return {
          validator: 'fillBlankMissingTokenRule',
          reason: 'Fill-in-the-blank questions must include a blank placeholder (e.g. ___)',
          question: trimmed,
          questionType: type,
        };
      }
      return null;
    }
    case 'short':
    case 'long': {
      if (options && options.length > 0) {
        return {
          validator: 'writtenQuestionOptionsRule',
          reason: `${type} questions must not include options`,
          question: trimmed,
          questionType: type,
        };
      }
      if (hasBlankPlaceholder(trimmed)) {
        return {
          validator: 'writtenQuestionBlankRule',
          reason: `${type} questions must not use fill-in-the-blank placeholders`,
          question: trimmed,
          questionType: type,
        };
      }
      return null;
    }
    default:
      return null;
  }
};

export const validateSectionHomogeneity = (
  types: QuestionType[],
  sectionTitle?: string,
): SemanticValidationFailure | null => {
  if (types.length === 0) {
    return {
      validator: 'sectionEmptyRule',
      reason: 'Section must contain at least one question',
      sectionTitle,
    };
  }

  const unique = new Set(types);
  if (unique.size > 1) {
    return {
      validator: 'sectionHomogeneityRule',
      reason: `Section mixes question types (${[...unique].join(', ')}). Use one type per section.`,
      sectionTitle,
      questionType: types[0],
    };
  }

  return null;
};

export interface QuestionBlueprintItem {
  type: QuestionType;
  numQuestions: number;
  marksPerQuestion: number;
}

export const validatePaperCoherence = (
  sections: Array<{
    title: string;
    instruction: string;
    questions: Array<{ type: QuestionType; text?: string }>;
  }>,
  blueprint?: QuestionBlueprintItem[],
): SemanticValidationFailure | null => {
  for (const section of sections) {
    const types = section.questions.map((q) => q.type);
    const homogeneityError = validateSectionHomogeneity(types, section.title);
    if (homogeneityError) {
      return homogeneityError;
    }

    const inferred = inferSectionQuestionType(section.title, section.instruction);
    const sectionType = types[0];
    if (inferred && sectionType && inferred !== sectionType) {
      return {
        validator: 'sectionTitleTypeMismatchRule',
        reason: `Section is labeled as ${inferred} but contains ${sectionType} questions`,
        sectionTitle: section.title,
        questionType: sectionType,
      };
    }
  }

  if (!blueprint || blueprint.length === 0) {
    return null;
  }

  if (sections.length !== blueprint.length) {
    return {
      validator: 'sectionBlueprintCountRule',
      reason: `Expected ${blueprint.length} sections (one per question type), got ${sections.length}`,
    };
  }

  for (let i = 0; i < blueprint.length; i += 1) {
    const expected = blueprint[i].type;
    const section = sections[i];
    const sectionTypes = new Set(section.questions.map((q) => q.type));

    if (sectionTypes.size !== 1 || !sectionTypes.has(expected)) {
      return {
        validator: 'sectionBlueprintTypeRule',
        reason: `Section must contain only "${expected}" questions`,
        sectionTitle: section.title,
        questionType: [...sectionTypes][0],
      };
    }
  }

  return null;
};
