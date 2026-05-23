import type { QuestionType } from '../../../types/domain.types';

/** Reject meta-instructions and legacy placeholder answer copy */
const VAGUE_ANSWER_PATTERNS = [
  /student should/i,
  /students should/i,
  /correct option should be identified/i,
  /identify the correct option/i,
  /concise answer addressing all parts/i,
  /provide the appropriate term/i,
  /state true or false with a brief justification/i,
  /detailed response covering definitions/i,
  /answer addressing all parts of the question with clear reasoning/i,
  /based on the concepts covered in the question/i,
] as const;

const ANSWER_MIN_LENGTH: Record<Exclude<QuestionType, 'mcq'>, number> = {
  fill_blank: 1,
  true_false: 8,
  short: 25,
  long: 40,
};

const ANSWER_MAX_LENGTH: Record<Exclude<QuestionType, 'mcq'>, number> = {
  fill_blank: 300,
  true_false: 2000,
  short: 4000,
  long: 8000,
};

const MIN_LENGTH_MESSAGES: Record<Exclude<QuestionType, 'mcq'>, string> = {
  fill_blank: 'Fill-in-the-blank answer must provide the exact term(s)',
  true_false:
    'True/False answer must state True or False with a brief justification',
  short: 'Short-answer responses must be a substantive model answer',
  long: 'Long-answer responses must be a detailed model answer',
};

export const isVagueAnswer = (value: string): boolean =>
  VAGUE_ANSWER_PATTERNS.some((pattern) => pattern.test(value));

export const validateMcqFields = (
  options: string[] | undefined,
  correctAnswer: string | undefined,
): string | null => {
  if (!options || options.length < 4) {
    return 'MCQ questions must include at least 4 options';
  }

  if (options.length !== 4) {
    return 'MCQ questions must have exactly 4 options';
  }

  const unique = new Set(options.map((o) => o.toLowerCase()));
  if (unique.size !== options.length) {
    return 'MCQ options must be unique';
  }

  const correct = correctAnswer?.trim();
  if (!correct) {
    return 'MCQ questions must include correctAnswer matching one option';
  }

  if (!options.includes(correct)) {
    return 'correctAnswer must exactly match one of the options array values';
  }

  return null;
};

export const validateAnswerForType = (
  type: QuestionType,
  answer: string,
): string | null => {
  if (type === 'mcq') {
    return 'MCQ questions use options and correctAnswer instead of answer';
  }

  const trimmed = answer.trim();
  const min = ANSWER_MIN_LENGTH[type];
  const max = ANSWER_MAX_LENGTH[type];

  if (trimmed.length < min) {
    return MIN_LENGTH_MESSAGES[type];
  }

  if (trimmed.length > max) {
    return `Answer exceeds maximum length (${max} characters) for ${type} questions`;
  }

  if (isVagueAnswer(trimmed)) {
    return 'Answer must be a precise solved response, not placeholder guidance';
  }

  return null;
};

export const validateQuestionText = (text: string): string | null => {
  const trimmed = text.trim();

  if (trimmed.length < 10) {
    return 'Question text is too short';
  }

  if (/^prompt\s*\d+/i.test(trimmed)) {
    return 'Question text must not copy source headings like "Prompt 1"';
  }

  if (/provide to the user\??$/i.test(trimmed)) {
    return 'Question text must be a proper exam question, not a source instruction';
  }

  return null;
};
