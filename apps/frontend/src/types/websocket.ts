import type { AssignmentStatus } from "./domain";

export const GENERATION_EVENTS = {
  STARTED: "generation_started",
  PROGRESS: "generation_progress",
  COMPLETED: "generation_completed",
  FAILED: "generation_failed",
} as const;

export type GenerationEventName =
  (typeof GENERATION_EVENTS)[keyof typeof GENERATION_EVENTS];

export const CLIENT_EVENTS = {
  SUBSCRIBE: "subscribe:assignment",
  UNSUBSCRIBE: "unsubscribe:assignment",
} as const;

export interface GenerationEventPayload {
  assignmentId: string;
  status: AssignmentStatus;
  progress: number;
  message: string;
}

export interface SubscribeAssignmentPayload {
  assignmentId: string;
}

export interface SubscribeAckPayload extends GenerationEventPayload {
  replayed?: boolean;
}
