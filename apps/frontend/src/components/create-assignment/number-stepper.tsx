"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  "aria-label"?: string;
}

export function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 100,
  className,
  "aria-label": ariaLabel,
}: NumberStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        "flex h-11 items-center rounded-full border border-border bg-background",
        className,
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="touch-manipulation tap-highlight-none flex size-11 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors active:bg-muted active:scale-95 lg:hover:bg-muted lg:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={`Decrease ${ariaLabel ?? "value"}`}
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-[2.5rem] flex-1 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="touch-manipulation tap-highlight-none flex size-11 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors active:bg-muted active:scale-95 lg:hover:bg-muted lg:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={`Increase ${ariaLabel ?? "value"}`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
