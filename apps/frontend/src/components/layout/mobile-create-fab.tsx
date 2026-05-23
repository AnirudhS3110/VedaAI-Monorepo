"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Floating create button — assignments list on mobile (Figma) */
export function MobileCreateFab() {
  const pathname = usePathname();

  const showFab =
    pathname === "/assignments" ||
    pathname === "/home";

  if (!showFab) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-4 z-50 lg:hidden",
      )}
    >
      <Link
        href="/assignments/create"
        className="touch-manipulation tap-highlight-none flex size-14 items-center justify-center rounded-full border border-border/60 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-transform active:scale-90"
        aria-label="Create assignment"
      >
        <Plus className="size-7 text-orange-500" strokeWidth={2.5} />
      </Link>
    </motion.div>
  );
}
