import { generateValidatedSection } from '../ai/gemini.service';
import { Assignment } from '../../models/assignment.model';
import { GeneratedPaper } from '../../models/generatedPaper.model';
import type { RegenerateSectionInput } from '../../api/validators/schemas';
import type { AssignmentIdParams } from '../../api/validators/schemas';
import { AppError, NotFoundError } from '../../types/errors';
import type { PaperSection } from '../../types/domain.types';
import { logger } from '../../utils/logger';
import {
  emitGenerationCompleted,
  emitGenerationFailed,
  emitGenerationProgress,
  emitGenerationStarted,
} from './generationEvents.service';

const findSectionIndex = (
  sections: PaperSection[],
  sectionTitle: string,
): number => {
  const normalized = sectionTitle.trim().toLowerCase();
  return sections.findIndex(
    (section) => section.title.trim().toLowerCase() === normalized,
  );
};

export const regenerateAssignmentSection = async (
  params: AssignmentIdParams,
  input: RegenerateSectionInput,
): Promise<PaperSection> => {
  const assignmentId = params.id;

  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new NotFoundError('Assignment not found');
  }

  if (assignment.status !== 'completed') {
    throw new AppError(
      'Assignment must be completed before regenerating a section',
      400,
    );
  }

  const paper = await GeneratedPaper.findOne({
    assignmentId: assignment._id,
  });

  if (!paper) {
    throw new NotFoundError('Generated paper not found for this assignment');
  }

  const sectionIndex = findSectionIndex(paper.sections, input.sectionTitle);

  if (sectionIndex === -1) {
    throw new NotFoundError(`Section "${input.sectionTitle}" not found`);
  }

  try {
    await emitGenerationStarted(
      assignmentId,
      `Regenerating section: ${input.sectionTitle}`,
    );

    await emitGenerationProgress(
      assignmentId,
      30,
      'Generating new section content',
    );

    const existingSection = paper.sections[sectionIndex];
    const expectedType =
      existingSection.questions[0]?.type ??
      undefined;

    const regeneratedSection = await generateValidatedSection(
      assignment,
      input.sectionTitle,
      paper.sections,
      expectedType,
    );

    await emitGenerationProgress(
      assignmentId,
      70,
      'Validating regenerated section',
    );

    paper.sections[sectionIndex] = regeneratedSection;
    await paper.save();

    await emitGenerationProgress(assignmentId, 90, 'Saving updated section');
    await emitGenerationCompleted(
      assignmentId,
      `Section "${input.sectionTitle}" regenerated`,
    );

    logger.info(
      { assignmentId, sectionTitle: input.sectionTitle },
      'Section regeneration completed',
    );

    return regeneratedSection;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Section regeneration failed';
    await emitGenerationFailed(assignmentId, message);

    logger.error(
      { err: error, assignmentId, sectionTitle: input.sectionTitle },
      'Section regeneration failed',
    );
    throw error;
  }
};
