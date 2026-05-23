import {
  CLIENT_EVENTS,
  GENERATION_EVENTS,
  type GenerationEventName,
  type GenerationEventPayload,
  type SubscribeAckPayload,
  type SubscribeAssignmentPayload,
} from "@/types/websocket";
import { getSocket } from "./client";

export { CLIENT_EVENTS, GENERATION_EVENTS };

export function subscribeToAssignment(
  assignmentId: string,
  onAck?: (ack: SubscribeAckPayload) => void,
): void {
  const payload: SubscribeAssignmentPayload = { assignmentId };
  getSocket().emit(CLIENT_EVENTS.SUBSCRIBE, payload, (ack: SubscribeAckPayload) => {
    if (ack?.assignmentId) {
      onAck?.(ack);
    }
  });
}

export function unsubscribeFromAssignment(assignmentId: string): void {
  const payload: SubscribeAssignmentPayload = { assignmentId };
  getSocket().emit(CLIENT_EVENTS.UNSUBSCRIBE, payload);
}

export function onGenerationEvent(
  event: GenerationEventName,
  handler: (payload: GenerationEventPayload) => void,
): () => void {
  const socket = getSocket();
  socket.on(event, handler);
  return () => {
    socket.off(event, handler);
  };
}
