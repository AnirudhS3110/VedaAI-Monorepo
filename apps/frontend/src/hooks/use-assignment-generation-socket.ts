"use client";

import { useEffect, useRef } from "react";
import { connectSocket, getSocket } from "@/lib/socket/client";
import {
  GENERATION_EVENTS,
  subscribeToAssignment,
  unsubscribeFromAssignment,
} from "@/lib/socket/events";
import { useGenerationStore } from "@/stores/generation-store";
import type {
  GenerationEventName,
  GenerationEventPayload,
  SubscribeAckPayload,
} from "@/types/websocket";

const ALL_GENERATION_EVENTS: GenerationEventName[] = [
  GENERATION_EVENTS.STARTED,
  GENERATION_EVENTS.PROGRESS,
  GENERATION_EVENTS.COMPLETED,
  GENERATION_EVENTS.FAILED,
];

interface UseAssignmentGenerationSocketOptions {
  assignmentId: string;
  onCompleted?: () => void;
  onFailed?: (message: string) => void;
}

function applyPayload(
  event: GenerationEventName,
  payload: GenerationEventPayload,
  updateFromEvent: (p: GenerationEventPayload) => void,
  onCompletedRef: { current: (() => void) | undefined },
  onFailedRef: { current: ((message: string) => void) | undefined },
): void {
  updateFromEvent(payload);

  if (event === GENERATION_EVENTS.COMPLETED || payload.status === "completed") {
    onCompletedRef.current?.();
  }
  if (event === GENERATION_EVENTS.FAILED || payload.status === "failed") {
    onFailedRef.current?.(payload.message);
  }
}

/**
 * Connects to Socket.IO, joins the assignment room, and syncs events to Zustand.
 * Re-subscribes on reconnect. Replays latest state via subscribe ack (backend).
 */
export function useAssignmentGenerationSocket({
  assignmentId,
  onCompleted,
  onFailed,
}: UseAssignmentGenerationSocketOptions): void {
  const setAssignmentId = useGenerationStore((s) => s.setAssignmentId);
  const setConnected = useGenerationStore((s) => s.setConnected);
  const updateFromEvent = useGenerationStore((s) => s.updateFromEvent);

  const onCompletedRef = useRef(onCompleted);
  const onFailedRef = useRef(onFailed);

  useEffect(() => {
    onCompletedRef.current = onCompleted;
    onFailedRef.current = onFailed;
  }, [onCompleted, onFailed]);

  useEffect(() => {
    let cancelled = false;
    const socket = getSocket();

    setAssignmentId(assignmentId);
    updateFromEvent({
      assignmentId,
      status: "generating",
      progress: 0,
      message: "Connecting to live updates…",
    });

    const handlePayload = (
      event: GenerationEventName,
      payload: GenerationEventPayload,
    ) => {
      if (payload.assignmentId !== assignmentId) return;
      applyPayload(event, payload, updateFromEvent, onCompletedRef, onFailedRef);
    };

    const handlers = ALL_GENERATION_EVENTS.map((event) => {
      const handler = (payload: GenerationEventPayload) =>
        handlePayload(event, payload);
      socket.on(event, handler);
      return { event, handler };
    });

    const resubscribe = () => {
      subscribeToAssignment(assignmentId, (ack: SubscribeAckPayload) => {
        if (cancelled || ack.assignmentId !== assignmentId) return;
        const event =
          ack.status === "completed"
            ? GENERATION_EVENTS.COMPLETED
            : ack.status === "failed"
              ? GENERATION_EVENTS.FAILED
              : ack.progress === 0
                ? GENERATION_EVENTS.STARTED
                : GENERATION_EVENTS.PROGRESS;
        handlePayload(event, ack);
      });
      setConnected(true);
    };

    const onDisconnect = () => setConnected(false);

    socket.on("connect", resubscribe);
    socket.on("disconnect", onDisconnect);

    void (async () => {
      try {
        await connectSocket();
        if (cancelled) return;
        resubscribe();
      } catch {
        if (!cancelled) setConnected(false);
      }
    })();

    return () => {
      cancelled = true;
      socket.off("connect", resubscribe);
      socket.off("disconnect", onDisconnect);
      for (const { event, handler } of handlers) {
        socket.off(event, handler);
      }
      unsubscribeFromAssignment(assignmentId);
    };
  }, [assignmentId, setAssignmentId, setConnected, updateFromEvent]);
}
