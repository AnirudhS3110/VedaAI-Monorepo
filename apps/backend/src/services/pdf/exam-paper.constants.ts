import type { QuestionDifficulty, QuestionType } from '../../types/domain.types';

/** Fallback when assignment metadata is missing (legacy records) */
export const EXAM_PAPER_ORGANIZATION = {
  defaultSchoolName: 'Delhi Public School',
  defaultClassName: '5th',
} as const;

export const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  easy: 'Easy',
  medium: 'Moderate',
  hard: 'Challenging',
};

export const SECTION_TYPE_HEADINGS: Record<QuestionType, string> = {
  mcq: 'Multiple Choice Questions',
  short: 'Short Answer Questions',
  long: 'Long Answer Questions',
  true_false: 'True / False Questions',
  fill_blank: 'Fill in the Blanks',
};
