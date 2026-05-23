import { generateValidatedPaper } from '../ai/gemini.service';
import { isRetryableGenerationError } from '../ai/errors';
import { finalizeSectionsForStorage } from '../ai/question-normalizer';
import { Assignment, type IAssignment } from '../../models/assignment.model';
import { GeneratedPaper } from '../../models/generatedPaper.model';
import { NotFoundError } from '../../types/errors';
import { logger } from '../../utils/logger';
import {
  emitGenerationCompleted,
  emitGenerationFailed,
  emitGenerationProgress,
  emitGenerationStarted,
} from './generationEvents.service';
import type { GenerationAttemptContext } from './generationAttempt.types';

const GEMINI_HEARTBEAT_MS = 2500;
const GEMINI_HEARTBEAT_MAX_PROGRESS = 48;

const updateAssignmentStatus = async (
  assignmentId: string,
  status: IAssignment['status'],
): Promise<void> => {
  await Assignment.findByIdAndUpdate(assignmentId, { status });
};

export const processAssessmentGeneration = async (
  assignmentId: string,
  attempt: GenerationAttemptContext = {
    attemptNumber: 1,
    maxAttempts: 1,
    isLastAttempt: true,
  },
): Promise<void> => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new NotFoundError(`Assignment ${assignmentId} not found`);
  }

  let heartbeatProgress = 12;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  const startGeminiHeartbeat = (): void => {
    heartbeatTimer = setInterval(() => {
      heartbeatProgress = Math.min(
        heartbeatProgress + 4,
        GEMINI_HEARTBEAT_MAX_PROGRESS,
      );
      void emitGenerationProgress(
        assignmentId,
        heartbeatProgress,
        'Generating questions with AI…',
      );
    }, GEMINI_HEARTBEAT_MS);
  };

  const stopGeminiHeartbeat = (): void => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  };

  try {
    if (attempt.attemptNumber === 1) {
      await updateAssignmentStatus(assignmentId, 'generating');
      await emitGenerationStarted(assignmentId, 'Analyzing content');
    } else {
      await emitGenerationProgress(
        assignmentId,
        Math.min(20 + attempt.attemptNumber * 8, 40),
        `Refining question paper (attempt ${attempt.attemptNumber} of ${attempt.maxAttempts})…`,
      );
    }

    await emitGenerationProgress(
      assignmentId,
      10,
      'Preparing your assessment',
    );

    await emitGenerationProgress(
      assignmentId,
      20,
      'Generating questions',
    );

    startGeminiHeartbeat();
    const validatedPaper = await generateValidatedPaper(assignment);
    stopGeminiHeartbeat();

    const sections = finalizeSectionsForStorage(validatedPaper.sections);

    await emitGenerationProgress(
      assignmentId,
      55,
      'Structuring sections',
    );

    await emitGenerationProgress(
      assignmentId,
      72,
      'Validating output',
    );

    await GeneratedPaper.findOneAndUpdate(
      { assignmentId: assignment._id },
      { sections },
      { upsert: true, new: true },
    );

    await emitGenerationProgress(assignmentId, 90, 'Saving results');

    await updateAssignmentStatus(assignmentId, 'completed');
    await emitGenerationCompleted(assignmentId);

    logger.info({ assignmentId }, 'Assessment generation completed');
  } catch (error) {
    stopGeminiHeartbeat();

    const message =
      error instanceof Error ? error.message : 'Unknown generation error';

    const retryable =
      !attempt.isLastAttempt && isRetryableGenerationError(error);

    if (retryable) {
      logger.warn(
        {
          assignmentId,
          attempt: attempt.attemptNumber,
          maxAttempts: attempt.maxAttempts,
          err: error,
        },
        'Generation attempt failed — will retry',
      );

      await updateAssignmentStatus(assignmentId, 'generating');
      await emitGenerationProgress(
        assignmentId,
        Math.min(35 + attempt.attemptNumber * 10, 50),
        `Adjusting questions and retrying (${attempt.attemptNumber + 1}/${attempt.maxAttempts})…`,
      );

      throw error;
    }

    await updateAssignmentStatus(assignmentId, 'failed');
    await emitGenerationFailed(assignmentId, message);

    logger.error({ err: error, assignmentId }, 'Assessment generation failed');
    throw error;
  }
};
