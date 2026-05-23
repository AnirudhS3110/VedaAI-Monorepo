"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, viewportOnce } from "./motion";

interface LandingSectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  /** Use Inter for technical sections */
  technical?: boolean;
  animate?: boolean;
}

export function LandingSection({
  id,
  children,
  className,
  containerClassName,
  technical = false,
  animate = true,
}: LandingSectionProps) {
  const Wrapper = animate ? motion.section : "section";

  const wrapperProps = animate
    ? {
        initial: fadeUp.initial,
        whileInView: fadeUp.whileInView,
        transition: fadeUp.transition,
        viewport: viewportOnce,
        id,
      }
    : { id };

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24",
        technical && "font-[family-name:var(--font-document)]",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto w-full min-w-0 max-w-6xl",
          containerClassName,
        )}
      >
        {children}
      </div>
    </Wrapper>
  );
}
