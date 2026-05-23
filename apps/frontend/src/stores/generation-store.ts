import { create } from "zustand";
import type { GenerationEventPayload } from "@/types/websocket";

interface GenerationState {
  assignmentId: string | null;
  progress: number;
  message: string;
  status: GenerationEventPayload["status"] | null;
  isConnected: boolean;
  setAssignmentId: (id: string | null) => void;
  setConnected: (connected: boolean) => void;
  updateFromEvent: (payload: GenerationEventPayload) => void;
  reset: () => void;
}

const initialState = {
  assignmentId: null,
  progress: 0,
  message: "",
  status: null,
  isConnected: false,
} as const;

/** Realtime generation state — populated in Phase 5. */
export const useGenerationStore = create<GenerationState>((set) => ({
  ...initialState,
  setAssignmentId: (assignmentId) => set({ assignmentId }),
  setConnected: (isConnected) => set({ isConnected }),
  updateFromEvent: (payload) =>
    set((state) => {
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
