import { z } from "zod";
import { QUESTION_TYPES } from "@/types/domain";

const dueDatePattern = /^(\d{2})-(\d{2})-(\d{4})$/;

function parseDueDate(value: string): Date | null {
  const match = dueDatePattern.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }
  return date;
}

export const questionRowSchema = z.object({
  type: z.enum(QUESTION_TYPES),
  numQuestions: z
    .number()
    .int()
    .min(1, "At least 1 question")
    .max(50, "Maximum 50 questions per type"),
  marks: z
    .number()
    .int()
    .min(1, "At least 1 mark")
    .max(100, "Maximum 100 marks per question"),
});

export const createAssignmentFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  schoolName: z.string().trim().min(1, "School name is required").max(200),
  className: z.string().trim().min(1, "Class is required").max(50),
  subject: z.string().trim().min(1, "Subject is required").max(100),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((val) => parseDueDate(val) !== null, {
      message: "Use format DD-MM-YYYY",
    })
    .refine((val) => {
      const date = parseDueDate(val);
      if (!date) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, { message: "Due date must be today or later" }),
  questionRows: z
    .array(questionRowSchema)
    .min(1, "Add at least one question type"),
  instructions: z.string().max(5000).optional(),
});

export type CreateAssignmentFormValues = z.infer<
  typeof createAssignmentFormSchema
>;

export type QuestionRowValues = z.infer<typeof questionRowSchema>;

export function formatDueDateForApi(ddMmYyyy: string): string {
  const date = parseDueDate(ddMmYyyy);
  if (!date) throw new Error("Invalid due date");
  return date.toISOString();
}

export function aggregateFormValues(values: CreateAssignmentFormValues) {
  const questionTypes = [
    ...new Set(values.questionRows.map((r) => r.type)),
  ];
  const numQuestions = values.questionRows.reduce(
    (sum, r) => sum + r.numQuestions,
    0,
  );
  const totalMarks = values.questionRows.reduce(
    (sum, r) => sum + r.numQuestions * r.marks,
    0,
  );

  return {
    title: values.title,
    schoolName: values.schoolName,
    className: values.className,
    subject: values.subject,
    dueDate: formatDueDateForApi(values.dueDate),
    questionTypes,
    questionBlueprint: values.questionRows.map((row) => ({
      type: row.type,
      numQuestions: row.numQuestions,
      marksPerQuestion: row.marks,
    })),
    numQuestions,
    totalMarks,
    instructions: values.instructions ?? "",
  };
}
