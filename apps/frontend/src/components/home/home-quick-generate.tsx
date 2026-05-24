import Link from "next/link";
import { ArrowRight, FileUp, Sparkles } from "lucide-react";
import { mobileUi } from "@/lib/mobile-ui";
import { cn } from "@/lib/utils";

export function HomeQuickGenerate() {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/70 bg-card",
        "p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] sm:p-6",
        mobileUi.elevatedCard,
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-orange-500/10 blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
            <Sparkles className="size-5" />
          </div>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
            Quick generate
          </h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
            Upload a syllabus or notes, configure question types, and let VedaAI
            build a structured paper in minutes.
          </p>
        </div>

        <Link
          href="/assignments/create"
          className={cn(
            "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-medium text-white",
            "bg-[#1a1a1a] shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all",
            "hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
            "active:scale-[0.99] sm:self-end",
          )}
        >
          <FileUp className="size-4" />
          Upload & generate
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
