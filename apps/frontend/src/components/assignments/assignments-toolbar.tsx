"use client";

import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AssignmentsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  className?: string;
}

export function AssignmentsToolbar({
  searchQuery,
  onSearchChange,
  className,
}: AssignmentsToolbarProps) {
  return (
    <div className={cn("w-full min-w-0", className)}>
      {/* Mobile: filter + search on one row (Figma) */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <Button
          type="button"
          variant="outline"
          className="h-11 shrink-0 rounded-2xl border-border bg-card px-4 text-sm font-medium shadow-sm"
        >
          <Filter className="size-4 shrink-0" />
          <span className="whitespace-nowrap">Filter By</span>
        </Button>

        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Name"
            className="h-11 w-full min-w-0 rounded-full border border-border bg-card py-2 pl-11 pr-4 text-sm shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-fit shrink-0 rounded-2xl border-border bg-card px-4 text-sm font-medium shadow-sm"
        >
          <Filter className="size-4" />
          Filter By
        </Button>

        <div className="relative w-full sm:max-w-md lg:max-w-lg">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Assignment"
            className="h-11 w-full rounded-full border border-border bg-card py-2 pl-11 pr-4 text-sm shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
      </div>
    </div>
  );
}
