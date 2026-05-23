"use client";

import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { GlassCard, GlowOrb, SectionLabel } from "../landing-visuals";
import { LandingSection } from "../landing-section";
import { HeroDashboardPreview } from "../previews/hero-dashboard-preview";
import { MockMobileFrame } from "../previews/mock-mobile-frame";
import { fadeUp, viewportOnce } from "../motion";

export function MobileExperienceSection() {
  return (
    <LandingSection id="mobile" className="relative overflow-hidden">
      <GlowOrb className="right-0 top-1/3 size-72" />
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionLabel>Responsive product</SectionLabel>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Desktop power. Mobile polish.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Bottom navigation, assignment cards, adaptive create forms, and
            readable exam papers—redesigned for touch without sacrificing the
            engineering dashboard on large screens.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              "Bottom nav + floating create FAB",
              "Sticky form footers above safe areas",
              "Responsive paper typography & wrapping",
            ].map((item) => (
              <GlassCard key={item} className="!p-4" hover={false}>
                <p className="text-sm font-medium">{item}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[320px] items-end justify-center gap-4 sm:gap-8">
          <motion.div
            initial={fadeUp.initial}
            whileInView={fadeUp.whileInView}
            transition={fadeUp.transition}
            viewport={viewportOnce}
            className="hidden w-full max-w-md opacity-90 lg:block"
          >
            <HeroDashboardPreview />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.1 }}
            className="relative z-10 shrink-0"
          >
            <div className="absolute -inset-6 rounded-full bg-orange-500/15 blur-2xl" aria-hidden />
            <MockMobileFrame>
              <div className="space-y-2.5 p-3">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="size-3 text-orange-500" />
                  <p className="text-[10px] font-bold">Assignments</p>
                </div>
                {["Physics Unit Test", "Biology Midterm"].map((t) => (
                  <div
                    key={t}
                    className="rounded-lg border border-border/60 bg-card p-2.5 shadow-sm"
                  >
                    <p className="text-[9px] font-semibold underline decoration-orange-500/40 underline-offset-2">
                      {t}
                    </p>
                    <p className="mt-0.5 text-[8px] text-muted-foreground">
                      Tap to open paper
                    </p>
                  </div>
                ))}
                <div className="mt-3 flex justify-around rounded-full bg-[#1a1a1a] py-2 text-[7px] text-white/70">
                  {["Home", "Papers", "Lib", "AI"].map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
              </div>
            </MockMobileFrame>
          </motion.div>
        </div>
      </div>
    </LandingSection>
  );
}
