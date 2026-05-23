import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface VedaLogoProps {
  className?: string;
  href?: string;
  showWordmark?: boolean;
  onNavigate?: () => void;
  /** Slightly smaller mark for compact mobile topbar */
  compact?: boolean;
}

export function VedaLogo({
  className,
  href = "/assignments",
  showWordmark = true,
  onNavigate,
  compact = false,
}: VedaLogoProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2",
        compact ? "gap-2" : "gap-2.5",
        className,
      )}
    >
      <Image
        src="/vedaai-logo.svg"
        alt="VedaAI"
        width={36}
        height={36}
        className={cn("shrink-0", compact ? "size-8" : "size-9")}
        priority
      />
      {showWordmark && (
        <span
          className={cn(
            "font-bold tracking-tight text-foreground",
            compact ? "text-base" : "text-lg",
          )}
        >
          VedaAI
        </span>
      )}
    </Link>
  );
}
