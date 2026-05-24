import type { AssignmentDetail } from "@/types/assignment";
import type { AssignmentStatus } from "@/types/domain";
import type { GenerationEventPayload } from "@/types/websocket";

/** Map assignment API status to progress when socket events were missed. */
export function statusToGenerationPayload(
  detail: AssignmentDetail,
): GenerationEventPayload | null {
  const { assignment, status } = detail;

  switch (status) {
    case "pending":
      return {
        assignmentId: assignment.id,
        status: "generating",
        progress: 5,
        message: "Queued for generation…",
      };
    case "generating":
      return {
        assignmentId: assignment.id,
        status: "generating",
        progress: 30,
        message: "AI is generating your question paper…",
      };
    case "completed":
      return {
        assignmentId: assignment.id,
        status: "completed",
        progress: 100,
        message: "Generation completed",
      };
    case "failed":
      return {
        assignmentId: assignment.id,
        status: "failed",
        progress: 0,
        message: "Generation failed",
      };
    default:
      return null;
  }
}

export function generationPayloadKey(payload: GenerationEventPayload): string {
  return `${payload.assignmentId}:${payload.status}:${payload.progress}:${payload.message}`;
}

/**
 * Reject terminal replay (completed/failed) when MongoDB says the job is still active.
 * Prevents Brave reconnect / Redis cache from flashing stale 100% progress.
 */
export function isStaleTerminalReplay(
  payload: GenerationEventPayload,
  apiStatus: AssignmentStatus,
  replayed?: boolean,
): boolean {
  if (!replayed) return false;
  if (payload.status !== "completed" && payload.status !== "failed") {
    return false;
  }
  return apiStatus === "pending" || apiStatus === "generating";
}
