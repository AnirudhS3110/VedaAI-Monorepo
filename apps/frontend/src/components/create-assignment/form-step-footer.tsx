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
        "max-lg:sticky max-lg:bottom-[calc(5.25rem+env(safe-area-inset-bottom))] max-lg:z-20",
        "max-lg:-mx-4 max-lg:border-t max-lg:border-border/60 max-lg:bg-card/95 max-lg:px-4 max-lg:py-3 max-lg:backdrop-blur-md",
        "sm:max-lg:-mx-6",
      )}
    >
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
        <Button
          type="button"
          variant="outline"
          asChild
          disabled={isSubmitting}
          className="h-11 w-full cursor-pointer rounded-2xl bg-card shadow-sm sm:min-w-[140px] sm:w-auto"
        >
          <Link href="/assignments">
            <ArrowLeft className="size-4" />
            Previous
          </Link>
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="h-11 w-full cursor-pointer rounded-2xl bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] sm:min-w-[140px] sm:w-auto"
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
