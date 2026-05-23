import { z } from 'zod';

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid resource ID');

export const assignmentIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type AssignmentIdParams = z.infer<typeof assignmentIdParamsSchema>;
