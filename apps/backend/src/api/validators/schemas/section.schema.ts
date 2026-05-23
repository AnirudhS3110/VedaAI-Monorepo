import { z } from 'zod';
import { questionSchema } from './question.schema';
import {
  logValidationFailure,
  failureMessage,
} from './validation-logger';
import { validateSectionHomogeneity } from './question-semantics.validation';

export const sectionSchema = z
  .object({
    title: z.string().trim().min(1, 'Section title is required'),
    instruction: z.string().trim().min(1, 'Section instruction is required'),
    questions: z
      .array(questionSchema)
      .min(1, 'Each section must have at least one question'),
  })
  .superRefine((section, ctx) => {
    const types = section.questions.map((q) => q.type);
    const homogeneityFailure = validateSectionHomogeneity(types, section.title);
    if (homogeneityFailure) {
      logValidationFailure(homogeneityFailure);
      ctx.addIssue({
        code: 'custom',
        path: ['questions'],
        message: failureMessage(homogeneityFailure),
      });
    }
  });

export type SectionInput = z.infer<typeof sectionSchema>;
