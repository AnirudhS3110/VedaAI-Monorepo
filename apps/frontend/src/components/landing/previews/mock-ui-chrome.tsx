import { cn } from "@/lib/utils";

interface MockUiChromeProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

/** Mini browser / app frame for landing previews */
export function MockUiChrome({
  title = "VedaAI",
  children,
  className,
  compact = false,
}: MockUiChromeProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_8px_40px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b border-border/60 bg-muted/40 px-3",
          compact ? "py-2" : "py-2.5",
        )}
      >
        <span className="size-2 rounded-full bg-red-400/80" />
        <span className="size-2 rounded-full bg-amber-400/80" />
        <span className="size-2 rounded-full bg-emerald-400/80" />
        <span className="ml-2 truncate text-[10px] font-medium text-muted-foreground sm:text-xs">
          {title}
        </span>
      </div>
      <div className={cn("bg-workspace", compact ? "p-3" : "p-4")}>{children}</div>
    </div>
  );
}
