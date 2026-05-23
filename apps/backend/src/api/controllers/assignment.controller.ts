import type { Request, Response } from 'express';
import {
  createAssignment,
  deleteAssignment,
  getAssignmentById,
  getAssignmentPdfPath,
  listAssignmentsForUser,
  regenerateSection,
  requestPdfGeneration,
} from '../../services/assignment/assignment.service';
import type { ApiSuccessResponse } from '../../types/api.types';
import type {
  AssignmentDetailResponse,
  AssignmentListItemResponse,
  CreateAssignmentResponse,
  PdfGenerationResponse,
  RegenerateSectionResponse,
} from '../../types/assignment.types';
import type { AssignmentIdParams } from '../validators/schemas';
import type { CreateAssignmentInput } from '../validators/schemas';
import type { RegenerateSectionInput } from '../validators/schemas';
import { getValidatedBody, getValidatedParams } from '../../utils/validation';
import { UnauthorizedError } from '../../types/errors';

const requireRequestUserId = (req: Request): string => {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  return req.user._id.toString();
};

export const listAssignmentsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = requireRequestUserId(req);
  const result = await listAssignmentsForUser(userId);

  const response: ApiSuccessResponse<AssignmentListItemResponse[]> = {
    success: true,
    data: result,
  };

  res.status(200).json(response);
};

export const createAssignmentHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const body = getValidatedBody<CreateAssignmentInput>(req);
  const userId = requireRequestUserId(req);
  const result = await createAssignment(body, userId);

  const response: ApiSuccessResponse<CreateAssignmentResponse> = {
    success: true,
    data: result,
  };

  res.status(201).json(response);
};

export const getAssignmentHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const params = getValidatedParams<AssignmentIdParams>(req);
  const userId = requireRequestUserId(req);
  const result = await getAssignmentById(params, userId);

  const response: ApiSuccessResponse<AssignmentDetailResponse> = {
    success: true,
    data: result,
  };

  res.status(200).json(response);
};

export const regenerateSectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const params = getValidatedParams<AssignmentIdParams>(req);
  const body = getValidatedBody<RegenerateSectionInput>(req);
  const userId = requireRequestUserId(req);
  const result = await regenerateSection(params, body, userId);

  const response: ApiSuccessResponse<RegenerateSectionResponse> = {
    success: true,
    data: result,
  };

  res.status(200).json(response);
};

export const generatePdfHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const params = getValidatedParams<AssignmentIdParams>(req);
  const userId = requireRequestUserId(req);
  const result = await requestPdfGeneration(params, userId);

  const response: ApiSuccessResponse<PdfGenerationResponse> = {
    success: true,
    data: result,
  };

  res.status(202).json(response);
};

export const deleteAssignmentHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const params = getValidatedParams<AssignmentIdParams>(req);
  const userId = requireRequestUserId(req);
  await deleteAssignment(params, userId);

  const response: ApiSuccessResponse<{ deleted: true; id: string }> = {
    success: true,
    data: { deleted: true, id: params.id },
  };

  res.status(200).json(response);
};

export const downloadPdfHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const params = getValidatedParams<AssignmentIdParams>(req);
  const userId = requireRequestUserId(req);
  const filePath = await getAssignmentPdfPath(params, userId);

  res.download(filePath, `assignment-${params.id}.pdf`);
};
