import type { Question, QuestionType } from '../../types/domain.types';

const PROMPT_PREFIX_PATTERN =
  /^(?:prompt|section|part|module|unit|chapter|topic)\s*\d+\s*[:\.\-\)]\s*/i;

const normalizeWhitespace = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

export const normalizeQuestionText = (text: string): string => {
  let cleaned = normalizeWhitespace(text);
  let previous = '';

  while (cleaned !== previous) {
    previous = cleaned;
    cleaned = normalizeWhitespace(cleaned.replace(PROMPT_PREFIX_PATTERN, ''));
  }

  cleaned = cleaned.replace(/\?{2,}/g, '?');
  return cleaned;
};

export const normalizeMarks = (marks: unknown): number => {
  const numeric =
    typeof marks === 'number'
      ? marks
      : typeof marks === 'string'
        ? Number.parseFloat(marks)
        : Number.NaN;

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 1;
  }

  return Math.max(1, Math.round(numeric));
};

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? normalizeWhitespace(item) : ''))
    .filter((item) => item.length > 0);
};

const letterToIndex = (letter: string): number => {
  const code = letter.toUpperCase().charCodeAt(0);
  if (code < 65 || code > 90) {
    return -1;
  }
  return code - 65;
};

const resolveMcqCorrectAnswer = (
  correctAnswer: unknown,
  answer: unknown,
  options: string[],
): string | null => {
  const direct =
    typeof correctAnswer === 'string' ? normalizeWhitespace(correctAnswer) : '';

  if (direct && options.includes(direct)) {
    return direct;
  }

  if (direct && options.length > 0) {
    const byLetter = letterToIndex(direct.charAt(0));
    if (byLetter >= 0 && byLetter < options.length) {
      return options[byLetter];
    }
  }

  const legacyAnswer =
    typeof answer === 'string' ? normalizeWhitespace(answer) : '';

  if (!legacyAnswer) {
    return direct || null;
  }

  const letterMatch = legacyAnswer.match(/^([A-F])\)\s*(.+)$/i);
  if (letterMatch) {
    const idx = letterToIndex(letterMatch[1]);
    const optionText = normalizeWhitespace(letterMatch[2]);
    if (idx >= 0 && idx < options.length) {
      return options[idx];
    }
    if (options.includes(optionText)) {
      return optionText;
    }
  }

  if (options.includes(legacyAnswer)) {
    return legacyAnswer;
  }

  return direct || null;
};

export const normalizeRawQuestion = (
  raw: Record<string, unknown>,
): Record<string, unknown> => {
  const type = raw.type as QuestionType;
  const text = normalizeQuestionText(String(raw.text ?? ''));
  const marks = normalizeMarks(raw.marks);
  const difficulty = raw.difficulty;

  if (type === 'mcq') {
    const options = normalizeStringArray(raw.options);
    const correctAnswer = resolveMcqCorrectAnswer(
      raw.correctAnswer,
      raw.answer,
      options,
    );

    return {
      text,
      difficulty,
      marks,
      type: 'mcq',
      options,
      correctAnswer: correctAnswer ?? undefined,
    };
  }

  const answer =
    typeof raw.answer === 'string'
      ? normalizeWhitespace(raw.answer)
      : typeof raw.correctAnswer === 'string'
        ? normalizeWhitespace(raw.correctAnswer)
        : '';

  return {
    text,
    difficulty,
    marks,
    type,
    answer,
  };
};

const normalizeSection = (section: Record<string, unknown>): Record<string, unknown> => {
  const questions = Array.isArray(section.questions)
    ? section.questions
        .filter((q): q is Record<string, unknown> => !!q && typeof q === 'object')
        .map((q) => normalizeRawQuestion(q))
    : [];

  return {
    ...section,
    title:
      typeof section.title === 'string'
        ? normalizeWhitespace(section.title)
        : section.title,
    instruction:
      typeof section.instruction === 'string'
        ? normalizeWhitespace(section.instruction)
        : section.instruction,
    questions,
  };
};

export const normalizeGeneratedPaperPayload = (
  parsed: unknown,
): unknown => {
  if (!parsed || typeof parsed !== 'object') {
    return parsed;
  }

  const root = parsed as Record<string, unknown>;

  if (Array.isArray(root.sections)) {
    return {
      ...root,
      sections: root.sections
        .filter((s): s is Record<string, unknown> => !!s && typeof s === 'object')
        .map((s) => normalizeSection(s)),
    };
  }

  if (Array.isArray(root.questions)) {
    return normalizeSection(root);
  }

  return parsed;
};

/** Ensure stored MCQ rows include answer-key text for legacy consumers */
export const finalizeQuestionForStorage = (question: Question): Question => {
  if (
    question.type === 'mcq' &&
    question.options &&
    question.options.length >= 2 &&
    question.correctAnswer
  ) {
    const idx = question.options.indexOf(question.correctAnswer);
    const letter = idx >= 0 ? String.fromCharCode(65 + idx) : '';
    const answerKey = letter
      ? `${letter}. ${question.correctAnswer}`
      : question.correctAnswer;

    return {
      ...question,
      answer: answerKey,
    };
  }

  return question;
};

export const finalizeSectionsForStorage = (
  sections: Array<{ title: string; instruction: string; questions: Question[] }>,
): Array<{ title: string; instruction: string; questions: Question[] }> =>
  sections.map((section) => ({
    ...section,
    questions: section.questions.map(finalizeQuestionForStorage),
  }));
