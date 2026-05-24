"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, ExternalLink, FileDown, Loader2 } from "lucide-react";
import type { ExportedPdfItem } from "@/hooks/use-recent-exported-pdfs";
import { downloadAssignmentPdf } from "@/lib/api/assignment-actions";
import { getErrorMessage } from "@/lib/api/errors";
import { HomeSection } from "./home-section";

interface HomeExportedPdfsProps {
  exported: ExportedPdfItem[];
  isChecking: boolean;
}

export function HomeExportedPdfs({
  exported,
  isChecking,
}: HomeExportedPdfsProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (id: string) => {
    setLoadingId(id);
    setError(null);
    try {
      await downloadAssignmentPdf(id);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <HomeSection
      title="Recently exported PDFs"
      description="Papers ready to download from your workspace."
    >
      {isChecking && exported.length === 0 ? (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Checking for exported papers…
        </div>
      ) : exported.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Complete an assignment and export a PDF to see it here.
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card">
            {exported.map(({ assignment }) => (
              <li
                key={assignment.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                    <FileDown className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {assignment.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.subject} · PDF ready
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/assignments/${assignment.id}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-medium hover:bg-muted"
                  >
                    <ExternalLink className="size-3.5" />
                    Open
                  </Link>
                  <button
                    type="button"
                    disabled={loadingId === assignment.id}
                    onClick={() => void handleDownload(assignment.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#1a1a1a] px-3 text-xs font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60"
                  >
                    {loadingId === assignment.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Download className="size-3.5" />
                    )}
                    Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {error && (
            <p className="mt-2 text-xs text-destructive">{error}</p>
          )}
        </>
      )}
    </HomeSection>
  );
}
