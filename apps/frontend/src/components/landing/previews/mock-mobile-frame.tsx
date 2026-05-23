import { cn } from "@/lib/utils";

interface MockMobileFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function MockMobileFrame({ children, className }: MockMobileFrameProps) {
  return (
    <div
      className={cn(
        "mx-auto w-[200px] overflow-hidden rounded-[1.75rem] border-[6px] border-[#1a1a1a] bg-[#1a1a1a] shadow-xl sm:w-[220px]",
        className,
      )}
    >
      <div className="flex justify-center bg-[#1a1a1a] py-1">
        <span className="h-1 w-12 rounded-full bg-white/20" />
      </div>
      <div className="overflow-hidden rounded-b-[1.25rem] bg-workspace">{children}</div>
    </div>
  );
}
