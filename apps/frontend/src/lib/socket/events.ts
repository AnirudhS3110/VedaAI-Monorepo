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

const SUBSCRIBE_ACK_TIMEOUT_MS = 10_000;

export function subscribeToAssignment(
  assignmentId: string,
  onAck?: (ack: SubscribeAckPayload) => void,
): void {
  const payload: SubscribeAssignmentPayload = { assignmentId };
  const socket = getSocket();

  let settled = false;
  const finish = (ack: SubscribeAckPayload) => {
    if (settled) return;
    settled = true;
    window.clearTimeout(timer);
    if (ack?.assignmentId) {
      onAck?.(ack);
    }
  };

  const timer = window.setTimeout(() => {
    finish({
      assignmentId,
      status: "generating",
      progress: 0,
      message: "Still connecting to live updates…",
      replayed: false,
    });
  }, SUBSCRIBE_ACK_TIMEOUT_MS);

  socket.emit(CLIENT_EVENTS.SUBSCRIBE, payload, (ack: SubscribeAckPayload) => {
    finish(
      ack?.assignmentId
        ? ack
        : {
            assignmentId,
            status: "generating",
            progress: 0,
            message: "Waiting for generation to start…",
            replayed: false,
          },
    );
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
