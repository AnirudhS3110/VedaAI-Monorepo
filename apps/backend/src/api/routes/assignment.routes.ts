import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireUser } from '../middlewares/requireUser';
import {
  createAssignmentHandler,
  deleteAssignmentHandler,
  downloadPdfHandler,
  generatePdfHandler,
  getAssignmentHandler,
  listAssignmentsHandler,
  regenerateSectionHandler,
} from '../controllers/assignment.controller';
import {
  validateAssignmentIdParams,
  validateCreateAssignment,
  validateRegenerateSection,
} from '../validators';

const assignmentRouter = Router();

assignmentRouter.use(requireUser);
assignmentRouter.get('/', asyncHandler(listAssignmentsHandler));
assignmentRouter.post('/', validateCreateAssignment, asyncHandler(createAssignmentHandler));

assignmentRouter.get(
  '/:id',
  validateAssignmentIdParams,
  asyncHandler(getAssignmentHandler),
);

assignmentRouter.delete(
  '/:id',
  validateAssignmentIdParams,
  asyncHandler(deleteAssignmentHandler),
);

assignmentRouter.post(
  '/:id/regenerate-section',
  validateAssignmentIdParams,
  validateRegenerateSection,
  asyncHandler(regenerateSectionHandler),
);

assignmentRouter.post(
  '/:id/generate-pdf',
  validateAssignmentIdParams,
  asyncHandler(generatePdfHandler),
);

assignmentRouter.get(
  '/:id/pdf',
  validateAssignmentIdParams,
  asyncHandler(downloadPdfHandler),
);

export { assignmentRouter };
