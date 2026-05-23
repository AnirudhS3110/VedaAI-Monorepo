"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Dot grid + optional radial glow for landing sections */
export function LandingGridBackground({
  className,
  glow = false,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(0.85 0 0 / 0.35) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      {glow && (
        <div className="absolute -top-32 left-1/2 h-96 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
      )}
    </div>
  );
}

export function GlowOrb({
  className,
  color = "orange",
}: {
  className?: string;
  color?: "orange" | "neutral";
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl",
        color === "orange" ? "bg-orange-500/15" : "bg-foreground/5",
        className,
      )}
      aria-hidden
    />
  );
}

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-widest text-orange-600",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/70 p-5 shadow-[0_2px_24px_rgba(0,0,0,0.04)] backdrop-blur-md sm:p-6",
        "ring-1 ring-white/40 dark:ring-white/5",
        hover &&
          "transition-[transform,box-shadow,border-color] duration-300 lg:hover:-translate-y-0.5 lg:hover:border-orange-200/50 lg:hover:shadow-[0_12px_40px_rgba(249,115,22,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Animated pulse dot for live status */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-2", className)}>
      <motion.span
        className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75"
        animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
  );
}
