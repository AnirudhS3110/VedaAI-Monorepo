"use client";

import { useEffect, useRef } from "react";
import { assignmentsApi } from "@/lib/api/assignments";
import {
  generationPayloadKey,
  isStaleTerminalReplay,
} from "@/lib/generation-sync";
import { connectSocket, getSocket, reconnectSocket } from "@/lib/socket/client";
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
  /** When false, only wire socket without resetting store (e.g. output page) */
  resetOnMount?: boolean;
  onCompleted?: () => void;
  onFailed?: (message: string) => void;
}

function applyPayload(
  event: GenerationEventName,
  payload: GenerationEventPayload,
  updateFromEvent: ReturnType<typeof useGenerationStore.getState>["updateFromEvent"],
  onCompletedRef: { current: (() => void) | undefined },
  onFailedRef: { current: ((message: string) => void) | undefined },
  source: "live" | "replay" | "poll",
): void {
  updateFromEvent(payload, { source });

  if (event === GENERATION_EVENTS.COMPLETED || payload.status === "completed") {
    onCompletedRef.current?.();
  }
  if (event === GENERATION_EVENTS.FAILED || payload.status === "failed") {
    onFailedRef.current?.(payload.message);
  }
}

function ackToEvent(ack: SubscribeAckPayload): GenerationEventName {
  if (ack.status === "completed") return GENERATION_EVENTS.COMPLETED;
  if (ack.status === "failed") return GENERATION_EVENTS.FAILED;
  if (ack.progress === 0) return GENERATION_EVENTS.STARTED;
  return GENERATION_EVENTS.PROGRESS;
}

/**
 * Connects to Socket.IO, joins the assignment room, and syncs events to Zustand.
 * Re-subscribes on reconnect; validates replayed state against API (Brave/stale cache).
 */
export function useAssignmentGenerationSocket({
  assignmentId,
  resetOnMount = true,
  onCompleted,
  onFailed,
}: UseAssignmentGenerationSocketOptions): void {
  const setAssignmentId = useGenerationStore((s) => s.setAssignmentId);
  const setConnected = useGenerationStore((s) => s.setConnected);
  const updateFromEvent = useGenerationStore((s) => s.updateFromEvent);
  const reset = useGenerationStore((s) => s.reset);

  const onCompletedRef = useRef(onCompleted);
  const onFailedRef = useRef(onFailed);
  const lastPayloadKeyRef = useRef<string>("");
  const assignmentIdRef = useRef(assignmentId);

  useEffect(() => {
    onCompletedRef.current = onCompleted;
    onFailedRef.current = onFailed;
  }, [onCompleted, onFailed]);

  useEffect(() => {
    assignmentIdRef.current = assignmentId;
    let cancelled = false;
    const socket = getSocket();

    if (resetOnMount) {
      reset();
    }

    setAssignmentId(assignmentId);
    updateFromEvent(
      {
        assignmentId,
        status: "generating",
        progress: 0,
        message: "Connecting to live updates…",
      },
      { source: "reset" },
    );
    lastPayloadKeyRef.current = "";

    const shouldApply = (payload: GenerationEventPayload): boolean => {
      if (payload.assignmentId !== assignmentIdRef.current) return false;
      const key = generationPayloadKey(payload);
      if (key === lastPayloadKeyRef.current) return false;
      lastPayloadKeyRef.current = key;
      return true;
    };

    const handlePayload = async (
      event: GenerationEventName,
      payload: GenerationEventPayload,
      source: "live" | "replay",
      replayed?: boolean,
    ) => {
      if (payload.assignmentId !== assignmentIdRef.current) return;

      if (
        replayed &&
        (payload.status === "completed" || payload.status === "failed")
      ) {
        try {
          const detail = await assignmentsApi.getById(assignmentIdRef.current);
          if (cancelled) return;
          if (isStaleTerminalReplay(payload, detail.status, true)) {
            const sync = detail.status;
            if (sync === "generating" || sync === "pending") {
              updateFromEvent(
                {
                  assignmentId: assignmentIdRef.current,
                  status: "generating",
                  progress: Math.max(
                    useGenerationStore.getState().progress,
                    sync === "pending" ? 5 : 25,
                  ),
                  message:
                    sync === "pending"
                      ? "Queued for generation…"
                      : "AI is generating your question paper…",
                },
                { source: "poll" },
              );
            }
            return;
          }
        } catch {
          if (source === "replay") return;
        }
      }

      if (!shouldApply(payload)) return;

      applyPayload(
        event,
        payload,
        updateFromEvent,
        onCompletedRef,
        onFailedRef,
        source,
      );
    };

    const handlers = ALL_GENERATION_EVENTS.map((event) => {
      const handler = (payload: GenerationEventPayload) => {
        void handlePayload(event, payload, "live");
      };
      socket.on(event, handler);
      return { event, handler };
    });

    const resubscribe = () => {
      if (cancelled) return;
      lastPayloadKeyRef.current = "";
      subscribeToAssignment(assignmentIdRef.current, (ack) => {
        if (cancelled || ack.assignmentId !== assignmentIdRef.current) return;
        const event = ackToEvent(ack);
        void handlePayload(event, ack, "replay", ack.replayed);
      });
      setConnected(true);
    };

    const onDisconnect = () => {
      if (!cancelled) setConnected(false);
    };

    const onConnect = () => {
      if (!cancelled) resubscribe();
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    const onVisibility = () => {
      if (document.visibilityState !== "visible" || cancelled) return;
      const s = getSocket();
      if (!s.connected) {
        void connectSocket().catch(() => setConnected(false));
      } else {
        resubscribe();
      }
    };

    const onOnline = () => {
      if (cancelled) return;
      reconnectSocket();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", onOnline);

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
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      for (const { event, handler } of handlers) {
        socket.off(event, handler);
      }
      unsubscribeFromAssignment(assignmentIdRef.current);
    };
  }, [assignmentId, resetOnMount, reset, setAssignmentId, setConnected, updateFromEvent]);
}
