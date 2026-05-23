"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import {
  GENERATION_STAGES,
  getActiveStageIndex,
  getStageStatus,
} from "@/constants/generation-stages";
import { cn } from "@/lib/utils";

interface GenerationStageListProps {
  progress: number;
}

export function GenerationStageList({ progress }: GenerationStageListProps) {
  const activeIndex = getActiveStageIndex(progress);

  return (
    <ul className="space-y-3">
      {GENERATION_STAGES.map((stage, index) => {
        const status = getStageStatus(index, activeIndex, progress);
        const Icon = stage.icon;

        return (
          <motion.li
            key={stage.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
              status === "active" && "bg-muted/80",
              status === "pending" && "opacity-50",
            )}
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full border",
                status === "done" &&
                  "border-emerald-200 bg-emerald-50 text-emerald-600",
                status === "active" &&
                  "border-foreground/10 bg-[#1a1a1a] text-white",
                status === "pending" &&
                  "border-border bg-muted text-muted-foreground",
              )}
            >
              {status === "done" ? (
                <Check className="size-4" strokeWidth={2.5} />
              ) : status === "active" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Icon className="size-4" />
              )}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                status === "active"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {stage.label}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
