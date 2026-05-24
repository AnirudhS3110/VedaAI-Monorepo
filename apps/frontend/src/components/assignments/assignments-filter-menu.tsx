"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ASSIGNMENT_SORT_OPTIONS,
  ASSIGNMENT_STATUS_FILTER_OPTIONS,
  countActiveFilters,
  getActiveFilterLabel,
  type AssignmentSort,
  type AssignmentStatusFilter,
} from "@/lib/assignments-filter";
import { cn } from "@/lib/utils";

interface AssignmentsFilterMenuProps {
  statusFilter: AssignmentStatusFilter;
  sort: AssignmentSort;
  onStatusChange: (value: AssignmentStatusFilter) => void;
  onSortChange: (value: AssignmentSort) => void;
  className?: string;
}

export function AssignmentsFilterMenu({
  statusFilter,
  sort,
  onStatusChange,
  onSortChange,
  className,
}: AssignmentsFilterMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeCount = countActiveFilters(statusFilter, sort);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const label = getActiveFilterLabel(statusFilter, sort);

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <Button
        type="button"
        variant="outline"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "h-11 cursor-pointer rounded-2xl border-border bg-card px-4 text-sm font-medium shadow-sm",
          activeCount > 0 && "border-orange-200/80 ring-1 ring-orange-500/20",
        )}
      >
        <Filter className="size-4 shrink-0" />
        <span className="max-w-[9rem] truncate whitespace-nowrap sm:max-w-none">
          {label}
        </span>
        {activeCount > 0 && (
          <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Filter assignments"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(100vw-2rem,18rem)] rounded-2xl border border-border/80 bg-card p-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:left-0"
        >
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </p>
          <ul className="space-y-0.5" role="listbox" aria-label="Status filter">
            {ASSIGNMENT_STATUS_FILTER_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={statusFilter === opt.value}
                  onClick={() => onStatusChange(opt.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    statusFilter === opt.value
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {opt.label}
                  {statusFilter === opt.value && (
                    <Check className="size-4 shrink-0 text-orange-600" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-3 border-t border-border/60 px-2 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sort
          </p>
          <ul className="space-y-0.5" role="listbox" aria-label="Sort order">
            {ASSIGNMENT_SORT_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={sort === opt.value}
                  onClick={() => onSortChange(opt.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    sort === opt.value
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {opt.label}
                  {sort === opt.value && (
                    <Check className="size-4 shrink-0 text-orange-600" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => {
              onStatusChange("all");
              onSortChange("newest");
              setOpen(false);
            }}
            className="mt-3 w-full rounded-xl py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
