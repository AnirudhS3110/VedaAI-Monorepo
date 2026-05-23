"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowOrb, SectionLabel } from "../landing-visuals";
import { LandingSection } from "../landing-section";
import { MockCreatePreview } from "../previews/mock-create-preview";
import { MockGenerationPreview } from "../previews/mock-generation-preview";
import { MockPaperPreview } from "../previews/mock-paper-preview";
import { MockMobileFrame } from "../previews/mock-mobile-frame";

const tabs = [
  { id: "create", label: "Create Assignment", Preview: MockCreatePreview },
  { id: "generating", label: "Generating", Preview: MockGenerationPreview },
  { id: "paper", label: "Final Paper", Preview: MockPaperPreview },
  { id: "mobile", label: "Mobile UI", Preview: MobileTabPreview },
] as const;

function MobileTabPreview() {
  return (
    <MockMobileFrame className="mx-auto">
      <div className="space-y-2 p-3">
        <p className="text-[10px] font-bold">Assignments</p>
        <div className="rounded-lg border border-border/70 bg-card p-2 shadow-sm">
          <p className="text-[9px] font-semibold">Biology Midterm</p>
          <div className="mt-1 h-1 rounded-full bg-orange-100">
            <div className="h-full w-2/3 rounded-full bg-orange-500" />
          </div>
        </div>
        <div className="flex justify-around border-t border-border/50 pt-2 text-[7px] text-muted-foreground">
          {["Home", "Papers", "Lib", "AI"].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </MockMobileFrame>
  );
}

export function ProductPreviewSection() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("create");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  const Preview = current.Preview;

  return (
    <LandingSection id="preview" className="relative overflow-hidden">
      <GlowOrb className="left-0 bottom-0 size-64 opacity-30" />
      <div className="relative mx-auto max-w-2xl text-center">
        <SectionLabel>Product demo</SectionLabel>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Every stage of the workflow
        </h2>
      </div>

      <div className="relative mt-10 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              active === tab.id
                ? "bg-[#1a1a1a] text-white shadow-md"
                : "border border-border/60 bg-card/60 text-muted-foreground backdrop-blur-sm hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-10 max-w-lg">
        <div
          className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-b from-orange-500/10 to-transparent blur-xl"
          aria-hidden
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Preview />
          </motion.div>
        </AnimatePresence>
      </div>
    </LandingSection>
  );
}
