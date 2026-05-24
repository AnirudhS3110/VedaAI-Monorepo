"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormStepFooterProps {
  onNext: () => void;
  isSubmitting?: boolean;
}

export function FormStepFooter({ onNext, isSubmitting }: FormStepFooterProps) {
  return (
    <div
      className={cn(
        "mt-6 lg:mt-8",
        "lg:flex lg:items-center lg:justify-center lg:gap-4 lg:pb-4",
        /* Mobile: floating pill above bottom nav */
        "max-lg:pointer-events-none max-lg:fixed max-lg:inset-x-0 max-lg:z-20",
        "max-lg:bottom-[calc(4.75rem+env(safe-area-inset-bottom))]",
        "max-lg:flex max-lg:justify-center max-lg:px-4",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-md gap-2 rounded-2xl border border-border/50 bg-card/92 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-md",
          "sm:max-w-lg sm:gap-3",
        )}
      >
        <Button
          type="button"
          variant="outline"
          asChild
          disabled={isSubmitting}
          className="h-10 flex-1 cursor-pointer rounded-xl border-border/80 bg-background/90 text-sm font-medium shadow-none sm:h-11 sm:min-w-0"
        >
          <Link href="/assignments">
            <ArrowLeft className="size-4" />
            <span className="sr-only sm:not-sr-only">Previous</span>
          </Link>
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="h-10 flex-[1.35] cursor-pointer rounded-xl bg-[#1a1a1a] text-sm font-medium text-white hover:bg-[#2a2a2a] sm:h-11"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating…
            </>
          ) : (
            <>
              Next
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
