import type { CreateAssignmentFormValues } from "@/lib/validations/create-assignment";
import type { QuestionType } from "@/types/domain";

export interface AssignmentTemplate {
  id: string;
  name: string;
  description: string;
  suggestedTitle: string;
  instructions: string;
  questionRows: CreateAssignmentFormValues["questionRows"];
}

export const ASSIGNMENT_TEMPLATES: AssignmentTemplate[] = [
  {
    id: "unit-test",
    name: "Unit Test",
    description: "MCQs plus short answers for a single unit",
    suggestedTitle: "Unit Test",
    instructions:
      "Cover the latest unit. Balance recall and application. Align difficulty with class level.",
    questionRows: [
      { type: "mcq", numQuestions: 10, marks: 1 },
      { type: "short", numQuestions: 5, marks: 4 },
    ],
  },
  {
    id: "weekly-quiz",
    name: "Weekly Quiz",
    description: "Quick check-in assessment for the week",
    suggestedTitle: "Weekly Quiz",
    instructions: "Focus on topics taught this week. Keep questions concise.",
    questionRows: [
      { type: "mcq", numQuestions: 8, marks: 1 },
      { type: "true_false", numQuestions: 5, marks: 1 },
    ],
  },
  {
    id: "midterm-exam",
    name: "Midterm Exam",
    description: "Mixed sections for a formal midterm paper",
    suggestedTitle: "Midterm Examination",
    instructions:
      "Comprehensive midterm covering units 1–3. Include clear section instructions.",
    questionRows: [
      { type: "mcq", numQuestions: 15, marks: 1 },
      { type: "short", numQuestions: 6, marks: 3 },
      { type: "long", numQuestions: 2, marks: 8 },
    ],
  },
  {
    id: "mcq-practice",
    name: "MCQ Practice",
    description: "Multiple-choice practice set",
    suggestedTitle: "MCQ Practice Set",
    instructions: "Objective-style MCQs for revision and drill practice.",
    questionRows: [{ type: "mcq", numQuestions: 20, marks: 1 }],
  },
  {
    id: "short-answer",
    name: "Short Answer",
    description: "Written short-answer assessment",
    suggestedTitle: "Short Answer Assessment",
    instructions:
      "Emphasize clear, concise answers. Avoid overlap between questions.",
    questionRows: [
      { type: "short", numQuestions: 8, marks: 4 },
      { type: "fill_blank", numQuestions: 5, marks: 2 },
    ],
  },
];

export function getTemplateById(id: string): AssignmentTemplate | undefined {
  return ASSIGNMENT_TEMPLATES.find((t) => t.id === id);
}

export function buildCreateUrlFromTemplate(templateId: string): string {
  return `/assignments/create?template=${encodeURIComponent(templateId)}`;
}
