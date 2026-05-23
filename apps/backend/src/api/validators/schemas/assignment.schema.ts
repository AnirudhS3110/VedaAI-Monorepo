import { z } from 'zod';
import { ASSIGNMENT_STATUSES } from '../../../types/domain.types';
import { questionTypeSchema } from './question.schema';

export const assignmentStatusSchema = z.enum(ASSIGNMENT_STATUSES);

export const createAssignmentSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  schoolName: z.string().trim().min(1, 'School name is required').max(200),
  className: z.string().trim().min(1, 'Class is required').max(50),
  subject: z.string().trim().min(1, 'Subject is required').max(100),
  dueDate: z.coerce.date({ error: 'Invalid due date' }),
  questionTypes: z
    .array(questionTypeSchema)
    .min(1, 'At least one question type is required'),
  questionBlueprint: z
    .array(
      z.object({
        type: questionTypeSchema,
        numQuestions: z.number().int().min(1).max(50),
        marksPerQuestion: z.number().int().min(1).max(100),
      }),
    )
    .optional(),
  numQuestions: z
    .number()
    .int()
    .min(1, 'Number of questions must be at least 1')
    .max(100),
  totalMarks: z
    .number()
    .int()
    .min(1, 'Total marks must be at least 1')
    .max(500),
  instructions: z.string().max(5000).optional().default(''),
  uploadedContent: z.string().max(20000).optional().default(''),
});

export const regenerateSectionSchema = z.object({
  sectionTitle: z.string().trim().min(1, 'Section title is required'),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type RegenerateSectionInput = z.infer<typeof regenerateSectionSchema>;
