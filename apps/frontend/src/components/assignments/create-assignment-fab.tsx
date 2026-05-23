"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreateAssignmentFab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35 }}
      className="sticky bottom-4 z-10 hidden justify-center pt-8 sm:bottom-6 sm:pt-10 lg:flex"
    >
      <Button
        asChild
        className="h-12 gap-2 rounded-2xl bg-[#1a1a1a] px-5 text-sm font-medium text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:bg-[#2a2a2a]"
      >
        <Link href="/assignments/create">
          <Plus className="size-4" />
          Create Assignment
          <Sparkles className="size-3.5 opacity-80" />
        </Link>
      </Button>
    </motion.div>
  );
}
