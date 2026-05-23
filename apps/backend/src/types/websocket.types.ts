export const GENERATION_EVENTS = {
  STARTED: 'generation_started',
  PROGRESS: 'generation_progress',
  COMPLETED: 'generation_completed',
  FAILED: 'generation_failed',
} as const;

export type GenerationEventName =
  (typeof GENERATION_EVENTS)[keyof typeof GENERATION_EVENTS];

export type GenerationStatus =
  | 'pending'
  | 'generating'
  | 'completed'
  | 'failed';

export interface GenerationEventPayload {
  assignmentId: string;
  status: GenerationStatus;
  progress: number;
  message: string;
}

export interface SubscribeAssignmentPayload {
  assignmentId: string;
}
