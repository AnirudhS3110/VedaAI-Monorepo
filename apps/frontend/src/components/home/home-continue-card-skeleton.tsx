import { cn } from "@/lib/utils";

export function HomeContinueCardSkeleton({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "flex min-w-[16.5rem] max-w-full shrink-0 flex-col rounded-2xl border border-border/70 bg-card p-4",
        "shadow-[0_2px_12px_rgba(0,0,0,0.05)] sm:min-w-[18rem]",
        className,
      )}
      aria-hidden
    >
      <div className="h-5 w-20 animate-pulse rounded-full bg-muted/80" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full animate-pulse rounded-md bg-muted/70" />
        <div className="h-4 w-4/5 animate-pulse rounded-md bg-muted/60" />
      </div>
      <div className="mt-2 h-3 w-24 animate-pulse rounded-md bg-muted/50" />
      <div className="mt-3 h-3 w-28 animate-pulse rounded-md bg-muted/50" />
      <div className="mt-4 flex gap-2">
        <div className="h-9 w-[4.5rem] animate-pulse rounded-xl bg-muted/70" />
        <div className="h-9 w-14 animate-pulse rounded-xl bg-muted/60" />
        <div className="h-9 w-14 animate-pulse rounded-xl bg-muted/60" />
      </div>
    </article>
  );
}
