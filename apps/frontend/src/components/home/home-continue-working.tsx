"use client";

import Link from "next/link";
import type { AssignmentListItem } from "@/stores/assignments-store";
import { HomeContinueCard } from "./home-continue-card";
import { HomeSection } from "./home-section";

interface HomeContinueWorkingProps {
  items: AssignmentListItem[];
  isLoading: boolean;
}

export function HomeContinueWorking({ items, isLoading }: HomeContinueWorkingProps) {
  return (
    <HomeSection
      title="Continue working"
      description="Recently updated assignments, drafts, and completed papers."
      action={
        <Link
          href="/assignments"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
        </Link>
      }
    >
      {isLoading ? (
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 min-w-[16.5rem] animate-pulse rounded-2xl bg-muted/60"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No assignments yet. Create your first paper to see it here.
          </p>
          <Link
            href="/assignments/create"
            className="mt-4 inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create assignment
          </Link>
        </div>
      ) : (
        <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto overflow-y-hidden pb-1 px-1 snap-x snap-mandatory">
          {items.map((assignment) => (
            <div key={assignment.id} className="snap-start">
              <HomeContinueCard assignment={assignment} />
            </div>
          ))}
        </div>
      )}
    </HomeSection>
  );
}
