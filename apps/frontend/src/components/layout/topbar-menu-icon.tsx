import { cn } from "@/lib/utils";

/** Two-line menu icon matching mobile Figma */
export function TopbarMenuIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn("flex w-5 flex-col justify-center gap-1.5", className)}
      aria-hidden
    >
      <span className="h-0.5 w-full rounded-full bg-current" />
      <span className="h-0.5 w-4 rounded-full bg-current" />
    </span>
  );
}
