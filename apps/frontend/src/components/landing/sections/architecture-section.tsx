"use client";

import { motion } from "framer-motion";
import { LandingSection } from "../landing-section";
import { GlowOrb, SectionLabel } from "../landing-visuals";
import { staggerContainer, staggerItem, viewportOnce } from "../motion";
import { ArchitectureDiagramTabs } from "./architecture-diagram-tabs";

const concepts = [
  "Assessment jobs: API enqueues → BullMQ worker → Gemini → validation → MongoDB",
  "Realtime UX: Socket.IO streams generation progress to the dashboard",
  "PDF export: on-demand queue job → Puppeteer → local disk → HTTP download",
  "PDF readiness: frontend polls GET /assignments/:id/pdf (no PDF websocket events)",
  "Retry-safe generation when semantic or schema validation fails",
] as const;

const stack = [
  "Next.js",
  "Express",
  "BullMQ",
  "Redis",
  "Socket.IO",
  "Gemini",
  "MongoDB",
  "Puppeteer",
] as const;

export function ArchitectureSection() {
  return (
    <LandingSection
      id="architecture"
      animate={false}
      className="relative overflow-hidden bg-gradient-to-b from-muted/40 via-workspace to-workspace"
      containerClassName="max-w-6xl"
    >
      <GlowOrb className="right-0 top-1/4 size-96 opacity-50" color="orange" />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-12">
        <div className="min-w-0 font-sans">
          <SectionLabel>Engineering deep dive</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.45 }}
            className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Production architecture, documented
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            VedaAI separates interactive API traffic from long-running work. AI
            assessment generation uses queues, validation, and WebSockets. PDF
            export uses a dedicated worker and filesystem storage with polling on
            the client when a teacher downloads.
          </motion.p>

          <motion.ul
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={viewportOnce}
            className="mt-6 hidden space-y-2 lg:block"
          >
            {concepts.map((line) => (
              <motion.li
                key={line}
                variants={staggerItem}
                className="flex gap-2 text-sm leading-relaxed text-foreground/90"
              >
                <span className="shrink-0 text-orange-500" aria-hidden>
                  ▸
                </span>
                {line}
              </motion.li>
            ))}
          </motion.ul>

          <motion.ul
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={viewportOnce}
            className="mt-6 flex flex-wrap gap-2"
          >
            {stack.map((tag) => (
              <motion.li
                key={tag}
                variants={staggerItem}
                className="rounded-lg border border-border/70 bg-card/80 px-3 py-1.5 font-[family-name:var(--font-document)] text-xs font-medium text-foreground backdrop-blur-sm"
              >
                {tag}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="min-w-0"
        >
          <ArchitectureDiagramTabs />
        </motion.div>
      </div>

      <motion.ul
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={viewportOnce}
        className="mt-8 space-y-2 lg:hidden"
      >
        {concepts.map((line) => (
          <motion.li
            key={line}
            variants={staggerItem}
            className="flex gap-2 rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-sm text-foreground/90"
          >
            <span className="shrink-0 text-orange-500" aria-hidden>
              ▸
            </span>
            {line}
          </motion.li>
        ))}
      </motion.ul>
    </LandingSection>
  );
}
