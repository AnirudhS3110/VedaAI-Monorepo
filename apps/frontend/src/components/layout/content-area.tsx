import { responsiveLayout } from "@/lib/responsive-layout";
import { cn } from "@/lib/utils";

interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentArea({ children, className }: ContentAreaProps) {
  return (
    <div
      className={cn(
        responsiveLayout.pageContainer,
        responsiveLayout.pageX,
        responsiveLayout.pageY,
        className,
      )}
    >
      {children}
    </div>
  );
}
