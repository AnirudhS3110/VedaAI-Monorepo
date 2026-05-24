import type { AssignmentListItem } from "@/stores/assignments-store";
import type { AssignmentStatus } from "@/types/domain";

const ACTIVE_STATUSES: AssignmentStatus[] = ["pending", "generating"];

export function sortByUpdatedDesc(items: AssignmentListItem[]): AssignmentListItem[] {
  return [...items].sort(
    (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
  );
}

export function getContinueWorkingItems(
  items: AssignmentListItem[],
  limit = 6,
): AssignmentListItem[] {
  return sortByUpdatedDesc(items).slice(0, limit);
}

export function getStudyMaterialItems(
  items: AssignmentListItem[],
  limit = 5,
): AssignmentListItem[] {
  return sortByUpdatedDesc(items.filter((a) => a.hasStudyMaterial)).slice(0, limit);
}

export function getCompletedForExportCheck(
  items: AssignmentListItem[],
  limit = 8,
): AssignmentListItem[] {
  return sortByUpdatedDesc(
    items.filter((a) => a.status === "completed"),
  ).slice(0, limit);
}

export function getAssignmentHref(
  id: string,
  status: AssignmentStatus,
): string {
  if (status === "pending" || status === "generating") {
    return `/assignments/${id}/generating`;
  }
  return `/assignments/${id}`;
}

export function statusLabel(status: AssignmentStatus): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "generating":
      return "Generating";
    case "pending":
      return "Queued";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

export function isInProgress(status: AssignmentStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}
