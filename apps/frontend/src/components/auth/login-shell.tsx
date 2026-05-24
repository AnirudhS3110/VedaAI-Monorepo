"use client";

import { motion } from "framer-motion";
import { GlowOrb, LandingGridBackground } from "@/components/landing/landing-visuals";

interface LoginShellProps {
  children: React.ReactNode;
}

export function LoginShell({ children }: LoginShellProps) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-x-hidden bg-workspace px-4 py-10 sm:px-6">
      <LandingGridBackground glow className="opacity-80" />
      <GlowOrb className="left-1/2 top-1/3 size-80 -translate-x-1/2 opacity-40 sm:size-96" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-[400px]"
      >
        {children}
      </motion.div>
    </div>
  );
}
