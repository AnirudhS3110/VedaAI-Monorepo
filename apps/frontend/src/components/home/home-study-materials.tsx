"use client";

import Link from "next/link";
import { FileText, FileType } from "lucide-react";
import { formatAssignedDate } from "@/lib/format-date";
import type { AssignmentListItem } from "@/stores/assignments-store";
import { HomeSection } from "./home-section";

interface HomeStudyMaterialsProps {
  items: AssignmentListItem[];
  isLoading: boolean;
}

function materialLabel(item: AssignmentListItem): string {
  return `${item.title} · ${item.subject}`;
}

export function HomeStudyMaterials({
  items,
  isLoading,
}: HomeStudyMaterialsProps) {
  return (
    <HomeSection
      title="Recent study materials"
      description="Assignments that included uploaded reference content."
    >
      {isLoading ? (
        <ul className="space-y-2">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="h-14 animate-pulse rounded-xl bg-muted/60"
            />
          ))}
        </ul>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Upload a PDF or text file when creating an assignment to build your
            material library here.
          </p>
          <Link
            href="/assignments/create"
            className="mt-3 inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Add study material
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/assignments/${item.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 sm:px-5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <FileText className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {materialLabel(item)}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileType className="size-3 shrink-0" />
                    Reference content
                    <span aria-hidden>·</span>
                    Used {formatAssignedDate(item.updatedAt)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  );
}
