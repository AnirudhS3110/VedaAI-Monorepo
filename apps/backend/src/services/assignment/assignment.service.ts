import { Types } from 'mongoose';
import { Assignment, type AssignmentDocument } from '../../models/assignment.model';
import {
  GeneratedPaper,
  type GeneratedPaperDocument,
} from '../../models/generatedPaper.model';
import { enqueueAssessmentGeneration, enqueuePdfGeneration } from '../../queues';
import { regenerateAssignmentSection } from '../generation/sectionRegeneration.service';
import {
  deletePdfIfExists,
  pdfFileExists,
  resolvePdfFilePath,
} from '../pdf/pdfGeneration.service';
import { logger } from '../../utils/logger';
import type { CreateAssignmentInput } from '../../api/validators/schemas';
import type { AssignmentIdParams } from '../../api/validators/schemas';
import type { RegenerateSectionInput } from '../../api/validators/schemas';
import { AppError, NotFoundError } from '../../types/errors';
import type {
  AssignmentDetailResponse,
  AssignmentListItemResponse,
  AssignmentResponse,
  CreateAssignmentResponse,
  GeneratedPaperResponse,
  PdfGenerationResponse,
  RegenerateSectionResponse,
} from '../../types/assignment.types';
import {
  assertMongoAvailable,
  assertRedisAvailable,
} from '../../utils/infrastructure';
import { assertAssignmentOwnership } from './assignmentOwnership';

const toAssignmentResponse = (
  document: AssignmentDocument,
): AssignmentResponse => ({
  id: document._id.toString(),
  title: document.title,
  schoolName: document.schoolName ?? 'Delhi Public School',
  className: document.className ?? '5th',
  subject: document.subject,
  dueDate: document.dueDate.toISOString(),
  questionTypes: document.questionTypes,
  numQuestions: document.numQuestions,
  totalMarks: document.totalMarks,
  instructions: document.instructions,
  uploadedContent: document.uploadedContent,
  status: document.status,
  createdAt: document.createdAt.toISOString(),
  updatedAt: document.updatedAt.toISOString(),
});

const toGeneratedPaperResponse = (
  document: GeneratedPaperDocument,
): GeneratedPaperResponse => ({
  id: document._id.toString(),
  assignmentId: document.assignmentId.toString(),
  sections: document.sections,
  createdAt: document.createdAt.toISOString(),
  updatedAt: document.updatedAt.toISOString(),
});

const toListItem = (document: AssignmentDocument): AssignmentListItemResponse => ({
  id: document._id.toString(),
  title: document.title,
  subject: document.subject,
  dueDate: document.dueDate.toISOString(),
  status: document.status,
  createdAt: document.createdAt.toISOString(),
});

const findOwnedAssignment = async (
  assignmentId: string,
  userId: string,
): Promise<AssignmentDocument> => {
  if (!Types.ObjectId.isValid(assignmentId)) {
    throw new NotFoundError('Assignment not found');
  }

  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new NotFoundError('Assignment not found');
  }

  assertAssignmentOwnership(assignment, userId);
  return assignment;
};

export const listAssignmentsForUser = async (
  userId: string,
): Promise<AssignmentListItemResponse[]> => {
  assertMongoAvailable();

  const assignments = await Assignment.find({
    userId: new Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .lean(false);

  return assignments.map(toListItem);
};

export const createAssignment = async (
  input: CreateAssignmentInput,
  userId: string,
): Promise<CreateAssignmentResponse> => {
  assertMongoAvailable();
  assertRedisAvailable();

  const assignment = await Assignment.create({
    userId: new Types.ObjectId(userId),
    title: input.title,
    schoolName: input.schoolName,
    className: input.className,
    subject: input.subject,
    dueDate: input.dueDate,
    questionTypes: input.questionTypes,
    questionBlueprint: input.questionBlueprint,
    numQuestions: input.numQuestions,
    totalMarks: input.totalMarks,
    instructions: input.instructions,
    uploadedContent: input.uploadedContent,
    status: 'pending',
  });

  const assignmentId = assignment._id.toString();

  let jobId: string;
  try {
    jobId = await enqueueAssessmentGeneration(assignmentId);
  } catch (error) {
    await Assignment.findByIdAndDelete(assignmentId);
    throw error;
  }

  return { assignmentId, jobId };
};

export const getAssignmentById = async (
  params: AssignmentIdParams,
  userId: string,
): Promise<AssignmentDetailResponse> => {
  assertMongoAvailable();

  const assignment = await findOwnedAssignment(params.id, userId);

  const generatedPaper = await GeneratedPaper.findOne({
    assignmentId: assignment._id,
  });

  return {
    assignment: toAssignmentResponse(assignment),
    generatedPaper: generatedPaper
      ? toGeneratedPaperResponse(generatedPaper)
      : null,
    status: assignment.status,
  };
};

export const regenerateSection = async (
  params: AssignmentIdParams,
  input: RegenerateSectionInput,
  userId: string,
): Promise<RegenerateSectionResponse> => {
  assertMongoAvailable();

  await findOwnedAssignment(params.id, userId);

  const section = await regenerateAssignmentSection(params, input);

  return {
    assignmentId: params.id,
    section,
  };
};

export const requestPdfGeneration = async (
  params: AssignmentIdParams,
  userId: string,
): Promise<PdfGenerationResponse> => {
  assertMongoAvailable();
  assertRedisAvailable();

  const assignment = await findOwnedAssignment(params.id, userId);

  if (assignment.status !== 'completed') {
    throw new AppError(
      'Assignment must be completed before generating a PDF',
      400,
    );
  }

  const paper = await GeneratedPaper.findOne({
    assignmentId: assignment._id,
  });

  if (!paper) {
    throw new NotFoundError('Generated paper not found for this assignment');
  }

  const jobId = await enqueuePdfGeneration(params.id);

  return { assignmentId: params.id, jobId };
};

export const deleteAssignment = async (
  params: AssignmentIdParams,
  userId: string,
): Promise<void> => {
  assertMongoAvailable();

  const assignment = await findOwnedAssignment(params.id, userId);
  const assignmentId = assignment._id.toString();

  await deletePdfIfExists(assignmentId);

  await GeneratedPaper.deleteOne({ assignmentId: assignment._id });
  await Assignment.deleteOne({ _id: assignment._id });

  logger.info({ assignmentId, userId }, 'Assignment deleted');
};

export const getAssignmentPdfPath = async (
  params: AssignmentIdParams,
  userId: string,
): Promise<string> => {
  assertMongoAvailable();

  await findOwnedAssignment(params.id, userId);

  const exists = await pdfFileExists(params.id);

  if (!exists) {
    throw new NotFoundError(
      'PDF not found. Generate it first using POST /api/assignments/:id/generate-pdf',
    );
  }

  return resolvePdfFilePath(params.id);
};
