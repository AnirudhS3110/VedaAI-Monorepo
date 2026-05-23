"use client";

import { LandingSection } from "../landing-section";
import { GlowOrb, SectionLabel } from "../landing-visuals";
import { PipelineTimeline } from "./pipeline-timeline";

export function HowItWorksSection() {
  return (
    <LandingSection id="workflow" className="relative overflow-hidden">
      <GlowOrb className="left-1/2 top-0 size-80 -translate-x-1/2 opacity-40" />
      <div className="relative text-center sm:text-left">
        <SectionLabel>Distributed pipeline</SectionLabel>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          How the system works
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground sm:mx-0">
          From client upload to PDF delivery—a queue-driven architecture with
          validation, persistence, and realtime streaming.
        </p>
      </div>
      <div className="relative mt-14 rounded-3xl border border-border/60 bg-card/50 p-6 shadow-[0_8px_48px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:p-10">
        <PipelineTimeline />
      </div>
    </LandingSection>
  );
}
