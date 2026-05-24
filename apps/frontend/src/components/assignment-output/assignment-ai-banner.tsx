"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AssignmentAiBannerProps {
  message: string;
  onDownloadPdf?: () => void;
  isDownloading?: boolean;
  downloadStatus?: string | null;
}

export function AssignmentAiBanner({
  message,
  onDownloadPdf,
  isDownloading = false,
  downloadStatus,
}: AssignmentAiBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "relative w-full min-w-0 rounded-2xl bg-[#1a1a1a] text-white shadow-md",
        "px-4 pb-16 pt-4 sm:px-6 sm:pb-5 sm:pt-5",
        "max-lg:shadow-[0_6px_28px_rgba(0,0,0,0.2)]",
      )}
    >
      <p className="text-sm leading-relaxed text-white/90 sm:max-w-[92%]">
        {message}
      </p>
      {downloadStatus && (
        <p className="mt-2 text-xs text-white/60">{downloadStatus}</p>
      )}

      <Button
        type="button"
        variant="outline"
        disabled={isDownloading || !onDownloadPdf}
        onClick={onDownloadPdf}
        className={cn(
          "touch-manipulation cursor-pointer tap-highlight-none rounded-xl border-white/20 bg-white text-[#1a1a1a] active:scale-95 lg:hover:bg-white/90 disabled:opacity-70",
          "absolute bottom-3 left-3 size-11 p-0 sm:static sm:mt-4 sm:h-10 sm:w-auto sm:px-4",
        )}
        aria-label={isDownloading ? "Preparing PDF" : "Download as PDF"}
      >
        {isDownloading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Image
            src="/downlloadpdficon.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden
            className="size-5 shrink-0 sm:mr-2"
          />
        )}
        <span className="hidden sm:inline">
          {isDownloading ? "Preparing PDF…" : "Download as PDF"}
        </span>
      </Button>
    </motion.div>
  );
}
