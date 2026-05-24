"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, ExternalLink, Loader2, Pencil } from "lucide-react";
import type { AssignmentListItem } from "@/stores/assignments-store";
import { downloadAssignmentPdf } from "@/lib/api/assignment-actions";
import { getErrorMessage } from "@/lib/api/errors";
import {
  getAssignmentHref,
  isInProgress,
  statusLabel,
} from "@/lib/home-workspace";
import { mobileUi } from "@/lib/mobile-ui";
import { cn } from "@/lib/utils";

interface HomeContinueCardProps {
  assignment: AssignmentListItem;
}

export function HomeContinueCard({ assignment }: HomeContinueCardProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const href = getAssignmentHref(assignment.id, assignment.status);
  const inProgress = isInProgress(assignment.status);

  const handleDownload = async () => {
    setPdfLoading(true);
    setPdfError(null);
    try {
      await downloadAssignmentPdf(assignment.id);
    } catch (err) {
      setPdfError(getErrorMessage(err));
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <article
      className={cn(
        "flex min-w-[16.5rem] max-w-full shrink-0 flex-col rounded-2xl border border-border/70 bg-card p-4",
        "shadow-[0_2px_12px_rgba(0,0,0,0.05)] sm:min-w-[18rem]",
        mobileUi.elevatedCard,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              inProgress && "bg-orange-500/10 text-orange-700",
              assignment.status === "completed" && "bg-emerald-500/10 text-emerald-700",
              assignment.status === "failed" && "bg-red-500/10 text-red-700",
            )}
          >
            {statusLabel(assignment.status)}
          </span>
          <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {assignment.title}
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {assignment.subject}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Due {assignment.dueDate}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={href}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted"
        >
          <ExternalLink className="size-3.5" />
          Open
        </Link>
        {assignment.status === "completed" && (
          <>
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={pdfLoading}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-60"
            >
              {pdfLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              PDF
            </button>
            <Link
              href={href}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#1a1a1a] px-3 text-xs font-medium text-white transition-colors hover:bg-[#2a2a2a]"
            >
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </>
        )}
        {inProgress && (
          <Link
            href={href}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#1a1a1a] px-3 text-xs font-medium text-white transition-colors hover:bg-[#2a2a2a]"
          >
            Continue
          </Link>
        )}
      </div>
      {pdfError && (
        <p className="mt-2 text-[10px] text-destructive">{pdfError}</p>
      )}
    </article>
  );
}
