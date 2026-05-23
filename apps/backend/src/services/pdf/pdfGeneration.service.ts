import { access, unlink } from 'node:fs/promises';
import path from 'node:path';
import { Assignment } from '../../models/assignment.model';
import { GeneratedPaper } from '../../models/generatedPaper.model';
import { AppError, NotFoundError } from '../../types/errors';
import { logger } from '../../utils/logger';
import { generateExamPaperPdf, getPdfOutputPath } from './pdf.service';

export const processPdfGeneration = async (
  assignmentId: string,
): Promise<string> => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new NotFoundError(`Assignment ${assignmentId} not found`);
  }

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

  const outputPath = await generateExamPaperPdf(assignment, paper);

  logger.info({ assignmentId, outputPath }, 'PDF generation job completed');

  return outputPath;
};

export const pdfFileExists = async (assignmentId: string): Promise<boolean> => {
  const filePath = getPdfOutputPath(assignmentId);
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const resolvePdfFilePath = (assignmentId: string): string => {
  return path.resolve(getPdfOutputPath(assignmentId));
};

/** Remove generated PDF if present; ignores missing files */
export const deletePdfIfExists = async (
  assignmentId: string,
): Promise<void> => {
  const filePath = resolvePdfFilePath(assignmentId);
  try {
    await unlink(filePath);
    logger.info({ assignmentId, filePath }, 'Deleted assignment PDF');
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return;
    }
    logger.warn({ err: error, assignmentId }, 'Failed to delete assignment PDF');
  }
};
