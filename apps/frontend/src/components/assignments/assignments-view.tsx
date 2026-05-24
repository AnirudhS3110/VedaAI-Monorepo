"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ContentArea } from "@/components/layout/content-area";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import {
  filterAssignments,
  type AssignmentSort,
  type AssignmentStatusFilter,
} from "@/lib/assignments-filter";
import { useAssignmentsList } from "@/hooks/use-assignments-list";
import { AssignmentsEmptyState } from "./assignments-empty-state";
import { AssignmentsGrid } from "./assignments-grid";
import { AssignmentsToolbar } from "./assignments-toolbar";
import { CreateAssignmentFab } from "./create-assignment-fab";

interface AssignmentsViewProps {
  /** Pass `?empty=1` to preview the empty state UI */
  showEmpty?: boolean;
}

export function AssignmentsView({ showEmpty = false }: AssignmentsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AssignmentStatusFilter>("all");
  const [sort, setSort] = useState<AssignmentSort>("newest");
  const { items, isLoading, error } = useAssignmentsList();

  const source = showEmpty ? [] : items;

  const filtered = useMemo(
    () => filterAssignments(source, searchQuery, statusFilter, sort),
    [searchQuery, source, statusFilter, sort],
  );

  const isEmpty = !isLoading && source.length === 0;
  const hasNoResults = !isEmpty && filtered.length === 0;

  return (
    <PageTransition>
      <ContentArea className="min-w-0 pb-4 pt-3 sm:pt-4 lg:pb-8 lg:pt-8">
        {!isEmpty && (
          <PageHeader
            title="Assignments"
            description="Manage and create assignments for your classes."
            className="hidden lg:flex"
          />
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground sm:py-24">
            <Loader2 className="size-8 animate-spin" />
            <p className="mt-4 text-sm">Loading your assignments…</p>
          </div>
        ) : error ? (
          <p className="py-16 text-center text-sm text-destructive">{error}</p>
        ) : isEmpty ? (
          <AssignmentsEmptyState />
        ) : (
          <div className="space-y-4 lg:space-y-6">
            <AssignmentsToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              sort={sort}
              onStatusFilterChange={setStatusFilter}
              onSortChange={setSort}
            />

            <AnimatePresence mode="wait">
              {hasNoResults ? (
                <motion.p
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center text-sm text-muted-foreground sm:py-16"
                >
                  No assignments match your search or filters.
                </motion.p>
              ) : (
                <motion.div
                  key={`grid-${statusFilter}-${sort}-${searchQuery}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AssignmentsGrid assignments={filtered} />
                </motion.div>
              )}
            </AnimatePresence>

            <CreateAssignmentFab />
          </div>
        )}
      </ContentArea>
    </PageTransition>
  );
}
