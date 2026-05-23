"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ToastBannerProps {
  message: string;
  variant?: "success" | "error";
  onDismiss: () => void;
  durationMs?: number;
}

export function ToastBanner({
  message,
  variant = "success",
  onDismiss,
  durationMs = 4000,
}: ToastBannerProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onDismiss]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-lg",
        variant === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-900",
        variant === "error" && "border-red-200 bg-red-50 text-red-800",
      )}
      role="status"
    >
      {message}
    </div>
  );
}
