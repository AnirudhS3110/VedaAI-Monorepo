export const ASSIGNMENT_STATUSES = [
  'pending',
  'generating',
  'completed',
  'failed',
] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const QUESTION_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export type QuestionDifficulty = (typeof QUESTION_DIFFICULTIES)[number];

export const QUESTION_TYPES = [
  'mcq',
  'short',
  'long',
  'true_false',
  'fill_blank',
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export interface Question {
  text: string;
  difficulty: QuestionDifficulty;
  marks: number;
  type: QuestionType;
  /** Model answer for non-MCQ types; legacy MCQ fallback */
  answer?: string;
  /** MCQ option texts (typically 4) */
  options?: string[];
  /** MCQ — must match one entry in `options` */
  correctAnswer?: string;
}

export interface PaperSection {
  title: string;
  instruction: string;
  questions: Question[];
}
