import { parse, parseISO } from "date-fns";
import type { AssignmentListItem } from "@/stores/assignments-store";
import type { AssignmentStatus } from "@/types/domain";

export type AssignmentStatusFilter = "all" | AssignmentStatus | "in_progress";

export type AssignmentSort = "newest" | "oldest" | "due_soon";

export const ASSIGNMENT_STATUS_FILTER_OPTIONS: {
  value: AssignmentStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "in_progress", label: "In progress" },
  { value: "generating", label: "Generating" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

export const ASSIGNMENT_SORT_OPTIONS: {
  value: AssignmentSort;
  label: string;
}[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "due_soon", label: "Due date (soonest)" },
];

export function getActiveFilterLabel(
  status: AssignmentStatusFilter,
  sort: AssignmentSort,
): string {
  const statusLabel =
    ASSIGNMENT_STATUS_FILTER_OPTIONS.find((o) => o.value === status)?.label ??
    "All";
  const sortLabel =
    sort === "newest"
      ? ""
      : ` · ${ASSIGNMENT_SORT_OPTIONS.find((o) => o.value === sort)?.label}`;
  return status === "all" && sort === "newest"
    ? "Filter By"
    : `${statusLabel}${sortLabel}`;
}

function matchesStatus(
  item: AssignmentListItem,
  filter: AssignmentStatusFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "in_progress") {
    return item.status === "pending" || item.status === "generating";
  }
  return item.status === filter;
}

function parseCreatedAt(iso: string): number {
  try {
    return parseISO(iso).getTime();
  } catch {
    return 0;
  }
}

/** Display dates are stored as dd-MM-yyyy; parse explicitly for sorting. */
function parseDueDate(display: string): number {
  try {
    return parse(display, "dd-MM-yyyy", new Date()).getTime();
  } catch {
    return 0;
  }
}

export function filterAssignments(
  items: AssignmentListItem[],
  searchQuery: string,
  statusFilter: AssignmentStatusFilter,
  sort: AssignmentSort,
): AssignmentListItem[] {
  const q = searchQuery.trim().toLowerCase();

  let result = items.filter((item) => {
    if (!matchesStatus(item, statusFilter)) return false;
    if (!q) return true;
    const haystack = `${item.title} ${item.subject}`.toLowerCase();
    return haystack.includes(q);
  });

  result = [...result].sort((a, b) => {
    if (sort === "due_soon") {
      return parseDueDate(a.dueDate) - parseDueDate(b.dueDate);
    }
    const aTime = parseCreatedAt(a.createdAt);
    const bTime = parseCreatedAt(b.createdAt);
    return sort === "newest" ? bTime - aTime : aTime - bTime;
  });

  return result;
}

export function countActiveFilters(
  statusFilter: AssignmentStatusFilter,
  sort: AssignmentSort,
): number {
  let n = 0;
  if (statusFilter !== "all") n += 1;
  if (sort !== "newest") n += 1;
  return n;
}
