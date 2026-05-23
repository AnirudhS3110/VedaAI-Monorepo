import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CheckCircle2,
  FileCheck,
  Layers,
  Sparkles,
} from "lucide-react";

export interface GenerationStage {
  id: string;
  label: string;
  minProgress: number;
  icon: LucideIcon;
}

/** UI stages mapped to backend progress milestones (0 → 100). */
export const GENERATION_STAGES: GenerationStage[] = [
  {
    id: "analyze",
    label: "Analyzing content",
    minProgress: 0,
    icon: BookOpen,
  },
  {
    id: "questions",
    label: "Generating questions",
    minProgress: 15,
    icon: Sparkles,
  },
  {
    id: "structure",
    label: "Structuring sections",
    minProgress: 45,
    icon: Layers,
  },
  {
    id: "prepare",
    label: "Preparing paper",
    minProgress: 70,
    icon: FileCheck,
  },
  {
    id: "finalize",
    label: "Finalizing assessment",
    minProgress: 88,
    icon: CheckCircle2,
  },
];

export function getActiveStageIndex(progress: number): number {
  let index = 0;
  for (let i = 0; i < GENERATION_STAGES.length; i++) {
    if (progress >= GENERATION_STAGES[i].minProgress) {
      index = i;
    }
  }
  return index;
}

export type StageStatus = "done" | "active" | "pending";

export function getStageStatus(
  stageIndex: number,
  activeIndex: number,
  progress: number,
): StageStatus {
  if (stageIndex < activeIndex) return "done";
  if (stageIndex > activeIndex) return "pending";
  return progress >= 100 ? "done" : "active";
}
