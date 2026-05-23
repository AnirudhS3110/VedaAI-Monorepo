"use client";

import { motion } from "framer-motion";

interface FormProgressProps {
  step?: number;
  totalSteps?: number;
}

export function FormProgress({ step = 1, totalSteps = 2 }: FormProgressProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted sm:mt-6">
      <motion.div
        className="h-full rounded-full bg-[#1a1a1a]"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}
