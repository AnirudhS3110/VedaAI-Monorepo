import type { Question, QuestionDifficulty } from "@/types/domain";
import type { PaperSection } from "@/types/domain";

export const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  easy: "Easy",
  medium: "Moderate",
  hard: "Challenging",
};

export function isMcqWithOptions(
  question: Question,
): question is Question & { options: string[]; correctAnswer: string } {
  return (
    question.type === "mcq" &&
    Array.isArray(question.options) &&
    question.options.length >= 2 &&
    !!question.correctAnswer?.trim()
  );
}

export function flattenQuestions(
  sections: PaperSection[],
): { section: PaperSection; question: Question; number: number }[] {
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
}

export function estimateTimeAllowedMinutes(totalMarks: number): number {
  return Math.max(30, Math.min(180, Math.round(totalMarks * 1.5)));
}

export function getQuestionAnswer(question: Question): string {
  if (isMcqWithOptions(question)) {
    const idx = question.options.findIndex(
      (opt) => opt === question.correctAnswer,
    );
    const letter = idx >= 0 ? String.fromCharCode(65 + idx) : "";
    return letter
      ? `${letter}. ${question.correctAnswer}`
      : question.correctAnswer;
  }

  const answer = question.answer?.trim();
  if (answer) return answer;

  return "Model answer unavailable. Regenerate this assignment or section to produce an answer key.";
}

export const MCQ_OPTION_LABELS = ["A", "B", "C", "D", "E", "F"] as const;
