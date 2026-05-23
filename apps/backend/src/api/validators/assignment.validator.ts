import {
  assignmentIdParamsSchema,
  createAssignmentSchema,
  regenerateSectionSchema,
} from './schemas';
import { validateBody, validateParams } from '../middlewares/validate';

export const validateCreateAssignment = validateBody(createAssignmentSchema);

export const validateAssignmentIdParams = validateParams(
  assignmentIdParamsSchema,
);

export const validateRegenerateSection = validateBody(regenerateSectionSchema);
