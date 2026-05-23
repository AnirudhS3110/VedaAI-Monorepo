import type { QuestionType } from "@/types/domain";

export const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] =
  [
    { value: "mcq", label: "Multiple Choice Questions" },
    { value: "short", label: "Short Questions" },
    { value: "long", label: "Long Answer Questions" },
    { value: "true_false", label: "True / False" },
    { value: "fill_blank", label: "Fill in the Blanks" },
  ];

export function getQuestionTypeLabel(type: QuestionType): string {
  return (
    QUESTION_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type
  );
}
