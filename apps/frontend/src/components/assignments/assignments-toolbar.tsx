"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssignmentSort, AssignmentStatusFilter } from "@/lib/assignments-filter";
import { AssignmentsFilterMenu } from "./assignments-filter-menu";

interface AssignmentsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: AssignmentStatusFilter;
  sort: AssignmentSort;
  onStatusFilterChange: (value: AssignmentStatusFilter) => void;
  onSortChange: (value: AssignmentSort) => void;
  className?: string;
}

export function AssignmentsToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  sort,
  onStatusFilterChange,
  onSortChange,
  className,
}: AssignmentsToolbarProps) {
  return (
    <div className={cn("w-full min-w-0", className)}>
      <div className="flex items-center gap-2.5 lg:hidden ">
        <AssignmentsFilterMenu
          statusFilter={statusFilter}
          sort={sort}
          onStatusChange={onStatusFilterChange}
          onSortChange={onSortChange}
          
        />

        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Name"
            aria-label="Search assignments"
            className="h-11 w-full min-w-0 rounded-full border border-border bg-card py-2 pl-11 pr-4 text-sm shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
      </div>

      <div className="hidden flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex">
        <AssignmentsFilterMenu
          statusFilter={statusFilter}
          sort={sort}
          onStatusChange={onStatusFilterChange}
          onSortChange={onSortChange}
        />

        <div className="relative w-full sm:max-w-md lg:max-w-lg">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Assignment"
            aria-label="Search assignments"
            className="h-11 w-full rounded-full border border-border bg-card py-2 pl-11 pr-4 text-sm shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
      </div>
    </div>
  );
}
