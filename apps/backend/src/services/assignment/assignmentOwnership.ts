import type { AssignmentDocument } from '../../models/assignment.model';
import { ForbiddenError } from '../../types/errors';

export const assertAssignmentOwnership = (
  assignment: AssignmentDocument,
  userId: string,
): void => {
  if (!assignment.userId) {
    return;
  }

  if (assignment.userId.toString() !== userId) {
    throw new ForbiddenError('You do not have access to this assignment');
  }
};
