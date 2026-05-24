import { create } from "zustand";
import type { GenerationEventPayload } from "@/types/websocket";

export type GenerationUpdateSource = "live" | "replay" | "poll" | "reset";

interface GenerationState {
  assignmentId: string | null;
  progress: number;
  message: string;
  status: GenerationEventPayload["status"] | null;
  isConnected: boolean;
  setAssignmentId: (id: string | null) => void;
  setConnected: (connected: boolean) => void;
  updateFromEvent: (
    payload: GenerationEventPayload,
    meta?: { source?: GenerationUpdateSource },
  ) => void;
  reset: () => void;
}

const initialState = {
  assignmentId: null,
  progress: 0,
  message: "",
  status: null,
  isConnected: false,
} as const;

/** Realtime generation state — synced from Socket.IO and API fallback. */
export const useGenerationStore = create<GenerationState>((set) => ({
  ...initialState,
  setAssignmentId: (assignmentId) => set({ assignmentId }),
  setConnected: (isConnected) => set({ isConnected }),
  updateFromEvent: (payload, meta) =>
    set((state) => {
      if (
        state.assignmentId &&
        payload.assignmentId !== state.assignmentId
      ) {
        return state;
      }

      const source = meta?.source ?? "live";

      // During an active run, ignore stale terminal replay (handled in hook too)
      if (
        source === "replay" &&
        (payload.status === "completed" || payload.status === "failed") &&
        state.status === "generating"
      ) {
        return state;
      }

      const progress =
        payload.status === "completed"
          ? 100
          : payload.status === "failed"
            ? state.progress
            : Math.max(state.progress, payload.progress);

      return {
        assignmentId: payload.assignmentId,
        progress,
        message: payload.message || state.message,
        status: payload.status,
      };
    }),
  reset: () => set({ ...initialState }),
}));
