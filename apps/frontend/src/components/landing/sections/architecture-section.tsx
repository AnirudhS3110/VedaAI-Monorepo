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
      technical
      animate={false}
      className="relative overflow-hidden bg-gradient-to-b from-muted/40 via-workspace to-workspace"
      containerClassName="max-w-6xl"
    >
      <GlowOrb className="right-0 top-1/4 size-96 opacity-50" color="orange" />

      <div className="max-w-3xl">
        <SectionLabel>Engineering deep dive</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.45 }}
          className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
        >
          Production architecture, documented
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="mt-4 leading-relaxed text-muted-foreground"
        >
          VedaAI separates interactive API traffic from long-running work. AI
          assessment generation uses queues, validation, and WebSockets. PDF
          export uses a dedicated worker and filesystem storage with polling on
          the client when a teacher downloads.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-12 md:mt-6"
      >
        <ArchitectureDiagramTabs />
      </motion.div>
    </LandingSection>
  );
}
