import type { Question, QuestionType } from '../../types/domain.types';
import type { PaperSection } from '../../types/domain.types';
import { SECTION_TYPE_HEADINGS } from './exam-paper.constants';

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const formatDueDateDisplay = (date: Date): string => {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

export const estimateTimeAllowedMinutes = (totalMarks: number): number =>
  Math.max(30, Math.min(180, Math.round(totalMarks * 1.5)));

export const flattenQuestions = (
  sections: PaperSection[],
): { section: PaperSection; question: Question; number: number }[] => {
  const items: { section: PaperSection; question: Question; number: number }[] =
    [];
  let n = 1;
  for (const section of sections) {
    for (const question of section.questions) {
      items.push({ section, question, number: n });
      n += 1;
    }
  }
  return items;
};

export const sectionTypeHeading = (questions: Question[]): string => {
  const type: QuestionType = questions[0]?.type ?? 'short';
  return SECTION_TYPE_HEADINGS[type];
};

export const isMcqWithOptions = (
  question: Question,
): question is Question & { options: string[]; correctAnswer: string } =>
  question.type === 'mcq' &&
  Array.isArray(question.options) &&
  question.options.length >= 2 &&
  !!question.correctAnswer?.trim();

const MCQ_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const buildMcqOptionsHtml = (question: Question): string => {
  if (!isMcqWithOptions(question)) {
    return '';
  }

  const items = question.options
    .map((option, index) => {
      const label = MCQ_LABELS[index] ?? String(index + 1);
      return `<li class="mcq-option"><span class="mcq-label">${label}.</span> ${escapeHtml(option)}</li>`;
    })
    .join('');

  return `<ol class="mcq-options">${items}</ol>`;
};

/** Model answer from stored question; fallback for legacy papers without answers */
export const getQuestionAnswer = (question: Question): string => {
  if (isMcqWithOptions(question)) {
    const idx = question.options.indexOf(question.correctAnswer);
    const letter = idx >= 0 ? MCQ_LABELS[idx] : '';
    return letter
      ? `${letter}. ${question.correctAnswer}`
      : question.correctAnswer;
  }

  const answer = question.answer?.trim();
  if (answer) return answer;
  return 'Model answer unavailable. Regenerate this assignment or section to produce an answer key.';
};
