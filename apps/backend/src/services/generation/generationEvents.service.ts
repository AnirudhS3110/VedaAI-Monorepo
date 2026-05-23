import {
  publishGenerationEvent,
  type PublishedGenerationEvent,
} from '../websocket/generation.publisher';
import {
  GENERATION_EVENTS,
  type GenerationEventName,
  type GenerationStatus,
} from '../../types/websocket.types';

const publish = async (
  event: GenerationEventName,
  assignmentId: string,
  status: GenerationStatus,
  progress: number,
  message: string,
): Promise<void> => {
  const published: PublishedGenerationEvent = {
    event,
    payload: { assignmentId, status, progress, message },
  };
  await publishGenerationEvent(published);
};

export const emitGenerationStarted = async (
  assignmentId: string,
  message: string = 'Generation started',
): Promise<void> => {
  await publish(
    GENERATION_EVENTS.STARTED,
    assignmentId,
    'generating',
    0,
    message,
  );
};

export const emitGenerationProgress = async (
  assignmentId: string,
  progress: number,
  message: string,
): Promise<void> => {
  await publish(
    GENERATION_EVENTS.PROGRESS,
    assignmentId,
    'generating',
    progress,
    message,
  );
};

export const emitGenerationCompleted = async (
  assignmentId: string,
  message: string = 'Generation completed',
): Promise<void> => {
  await publish(
    GENERATION_EVENTS.COMPLETED,
    assignmentId,
    'completed',
    100,
    message,
  );
};

export const emitGenerationFailed = async (
  assignmentId: string,
  message: string = 'Generation failed',
): Promise<void> => {
  await publish(
    GENERATION_EVENTS.FAILED,
    assignmentId,
    'failed',
    0,
    message,
  );
};
