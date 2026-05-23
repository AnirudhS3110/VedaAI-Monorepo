"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard, SectionLabel } from "../landing-visuals";
import { LandingSection } from "../landing-section";
import { staggerContainer, staggerItem, viewportOnce } from "../motion";

const problems = [
  "Manual paper creation takes hours every week",
  "Inconsistent question quality across sections",
  "Repetitive formatting and layout work",
  "No realtime feedback during generation",
  "Difficult print-ready PDF workflows",
] as const;

const solutions = [
  "AI section generation with structured blueprints",
  "Validation pipelines reject malformed outputs",
  "Live WebSocket progress across every stage",
  "Retry-safe orchestration on worker failures",
  "Export-ready papers via Puppeteer pipeline",
] as const;

export function ProblemSolutionSection() {
  return (
    <LandingSection>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel>Workflow contrast</SectionLabel>
          <h2 className="mt-2 max-w-lg text-2xl font-bold tracking-tight sm:text-3xl">
            Traditional chaos vs. orchestrated delivery
          </h2>
        </div>
        
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={viewportOnce}
        className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8"
      >
        <motion.div variants={staggerItem} className="lg:translate-y-6">
          <GlassCard
            className={cn(
              "border-dashed bg-muted/20",
              "lg:border-muted-foreground/20",
            )}
            hover={false}
          >
            <p className="text-sm font-semibold text-muted-foreground">
              The traditional workflow
            </p>
            <ul className="mt-6 space-y-4">
              {problems.map((text) => (
                <li
                  key={text}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <XCircle className="mt-0.5 size-4 shrink-0 opacity-50" />
                  {text}
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br from-orange-500/20 to-transparent opacity-60 blur-sm"
              aria-hidden
            />
            <GlassCard className="relative border-orange-200/40 bg-gradient-to-br from-card to-orange-50/30 dark:to-orange-950/10">
              <p className="text-sm font-semibold text-foreground">
                The VedaAI workflow
              </p>
              <ul className="mt-6 space-y-4">
                {solutions.map((text) => (
                  <li
                    key={text}
                    className="flex gap-3 text-sm leading-relaxed text-foreground/90"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    {text}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </motion.div>
      </motion.div>
    </LandingSection>
  );
}
