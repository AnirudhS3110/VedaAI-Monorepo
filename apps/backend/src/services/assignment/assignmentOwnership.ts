import type { AssignmentDocument } from '../../models/assignment.model';
import { ForbiddenError } from '../../types/errors';

export const assertAssignmentOwnership = (
  assignment: AssignmentDocument,
  userId: string,
): void => {
  // SECURITY FIX: Assignments with no userId are NOT accessible to anyone.
  // Previously, a missing userId silently bypassed the ownership check, allowing
  // any authenticated user to read/modify legacy or orphaned assignments.
  if (!assignment.userId) {
    throw new ForbiddenError('You do not have access to this assignment');
  }

  if (assignment.userId.toString() !== userId) {
    throw new ForbiddenError('You do not have access to this assignment');
  }
};
