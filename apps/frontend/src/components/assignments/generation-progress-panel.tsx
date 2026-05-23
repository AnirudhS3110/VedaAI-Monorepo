"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActiveStageIndex, GENERATION_STAGES } from "@/constants/generation-stages";
import { GenerationProgressRing } from "./generation-progress-ring";
import { GenerationStageList } from "./generation-stage-list";

interface GenerationProgressPanelProps {
  progress: number;
  message: string;
  isConnected: boolean;
  error?: string | null;
}

export function GenerationProgressPanel({
  progress,
  message,
  isConnected,
  error,
}: GenerationProgressPanelProps) {
  const activeIndex = getActiveStageIndex(progress);
  const activeLabel = GENERATION_STAGES[activeIndex]?.label ?? "Processing";

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"
      >
        <p className="text-sm font-medium text-destructive">{error}</p>
        <Button asChild variant="outline" className="mt-6 rounded-xl">
          <Link href="/assignments">Back to Assignments</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="bg-[#1a1a1a] px-6 py-5 text-white">
        <div className="flex items-start gap-3">
          <motion.span
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10"
          >
            <Sparkles className="size-5" />
          </motion.span>
          <div>
            <p className="text-sm font-medium text-white/90">
              VedaAI is crafting your assessment
            </p>
            <motion.p
              key={message || activeLabel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-xs text-white/60"
            >
              {message || activeLabel}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 sm:px-8">
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>Overall progress</span>
          <span className="tabular-nums font-medium text-foreground">
            {progress}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-[#1a1a1a]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
      </div>

      <div className="grid gap-8 p-6 pt-6 sm:grid-cols-[1fr_auto] sm:p-8 sm:pt-6">
        <GenerationStageList progress={progress} />

        <div className="flex flex-col items-center justify-center sm:min-w-[160px]">
          <GenerationProgressRing progress={progress} />
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            {isConnected ? (
              <>
                <Wifi className="size-3.5 text-emerald-600" />
                Live updates
              </>
            ) : (
              <>
                <WifiOff className="size-3.5" />
                Reconnecting…
              </>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
