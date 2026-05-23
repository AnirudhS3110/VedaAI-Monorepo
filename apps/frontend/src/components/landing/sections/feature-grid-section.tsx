"use client";

import { motion } from "framer-motion";
import {
  Brain,
  FileUp,
  FileText,
  LayoutGrid,
  LogIn,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Wifi,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard, SectionLabel } from "../landing-visuals";
import { LandingSection } from "../landing-section";
import { staggerContainer, staggerItem, viewportOnce } from "../motion";

const features = [
  {
    icon: Brain,
    title: "AI Question Generation",
    body: "Gemini builds sections, questions, and model answers from syllabus context.",
    className: "sm:col-span-2 lg:col-span-2 lg:row-span-1",
    accent: true,
  },
  {
    icon: ShieldCheck,
    title: "Semantic Validation",
    body: "MCQs, blanks, and section types validated before persistence.",
    className: "lg:col-span-1",
    accent: false,
  },
  {
    icon: Wifi,
    title: "Realtime WebSocket Updates",
    body: "Socket.IO streams generation stages to the dashboard live.",
    className: "lg:col-span-1",
    accent: false,
  },
  {
    icon: Layers,
    title: "Queue-driven Workers",
    body: "BullMQ + Redis orchestrate async AI jobs at scale.",
    className: "lg:col-span-1",
    accent: false,
  },
  {
    icon: RefreshCw,
    title: "Retry-safe Generation",
    body: "Failed validations retry without breaking the user experience.",
    className: "lg:col-span-1",
    accent: false,
  },
  {
    icon: FileText,
    title: "PDF Generation",
    body: "Puppeteer renders print-ready papers matching on-screen layout.",
    className: "sm:col-span-2 lg:col-span-2",
    accent: true,
  },

  {
    icon: LayoutGrid,
    title: "Assignment Management",
    body: "Create, track, regenerate, and cascade-delete assignments.",
    className: "lg:col-span-1",
    accent: false,
  },
  {
    icon: FileUp,
    title: "Upload Extraction Pipeline",
    body: "Client-side PDF/text extraction feeds clean AI prompts.",
    className: "sm:col-span-2 lg:col-span-3",
    accent: true,
  },
] as const;

export function FeatureGridSection() {
  return (
    <LandingSection id="features">
      <div className="max-w-2xl">
        <SectionLabel>Platform capabilities</SectionLabel>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Infrastructure-grade features, educator-focused UX
        </h2>
        <p className="mt-3 text-muted-foreground">
          A bento layout mapping real subsystems—not marketing filler.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={viewportOnce}
        className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-fr"
      >
        {features.map(({ icon: Icon, title, body, className, accent }) => (
          <motion.article
            key={title}
            variants={staggerItem}
            className={cn(className)}
          >
            <GlassCard
              className={cn(
                "h-full",
                accent &&
                  "border-orange-200/30 bg-gradient-to-br from-card via-card to-orange-50/40 dark:to-orange-950/15",
              )}
            >
              <motion.span
                className="flex size-11 items-center justify-center rounded-xl bg-[#1a1a1a] text-white shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </motion.span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </GlassCard>
          </motion.article>
        ))}
      </motion.div>
    </LandingSection>
  );
}
