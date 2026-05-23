"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlassCard } from "../landing-visuals";

const diagrams = [
  {
    id: "overview",
    label: "System overview",
    src: "/overall-architectture-diagram.png",
    alt: "VedaAI system architecture: Next.js frontend, Express API, MongoDB, Redis BullMQ queues, assignment and PDF workers, Gemini, and local PDF storage",
    summary:
      "End-to-end platform: the Next.js app talks to Express over REST, enqueues background jobs on BullMQ (Redis), and receives live assessment updates over Socket.IO.",
    notes: [
      "Two workers: assessment generation (AI) and PDF export (Puppeteer).",
      "MongoDB stores assignments and generated paper content.",
      "PDF files live on server disk under ./storage/pdfs.",
    ],
  },
  {
    id: "assignment",
    label: "Assignment generation",
    src: "/assignment-generation-pipeline.png",
    alt: "Assignment generation pipeline from POST /assignments through BullMQ, Gemini, validation, MongoDB, and Socket.IO progress events",
    summary:
      "When a teacher creates an assignment, the API enqueues a job immediately. The worker calls Gemini, validates output, persists to MongoDB, and streams progress to the UI via Socket.IO.",
    notes: [
      "HTTP POST → BullMQ assessment_generation_queue → worker.",
      "Validation pipeline: schema, semantics, normalization, retry on failure.",
      "Realtime UI: generation_started, progress, completed, or failed events.",
    ],
  },
  {
    id: "pdf",
    label: "PDF generation",
    src: "/pdf-generation-pipeline.png",
    alt: "PDF generation pipeline: on-demand enqueue, BullMQ pdf worker, Puppeteer render, local filesystem storage, frontend polling for download",
    summary:
      "PDF export is on-demand—not automatic after generation. The frontend requests generation, the PDF worker writes to disk, and the client polls until the file is ready, then downloads via GET /assignments/:id/pdf.",
    notes: [
      "No Socket.IO for PDF completion—frontend polls every ~2s.",
      "POST /assignments/:id/generate-pdf → pdf_generation_queue.",
      "Worker: MongoDB → HTML template → Puppeteer → ./storage/pdfs/{id}.pdf.",
    ],
  },
] as const;

type DiagramId = (typeof diagrams)[number]["id"];

export function ArchitectureDiagramTabs() {
  const [active, setActive] = useState<DiagramId>("overview");
  const current = diagrams.find((d) => d.id === active) ?? diagrams[0];

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Architecture diagrams"
      >
        {diagrams.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium cursor-pointer transition-colors",
              active === tab.id
                ? "bg-[#1a1a1a] text-white"
                : "border border-border/80 bg-card/80 text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          role="tabpanel"
        >
          <GlassCard hover={false} className="overflow-hidden p-0">
            <div className="border-b border-border/60 bg-muted/30 px-4 py-2.5">
              <p className="text-sm font-medium text-foreground">{current.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {current.summary}
              </p>
            </div>
            <div className="relative bg-white p-2 sm:p-4 dark:bg-muted/20">
              <Image
                src={current.src}
                alt={current.alt}
                width={1600}
                height={900}
                className="h-auto w-full max-w-3xl rounded-lg border border-border/40"
                
                priority={current.id === "overview"}
              />
            </div>
          </GlassCard>

          <ul className="mt-4 space-y-2">
            {current.notes.map((note) => (
              <li
                key={note}
                className="flex gap-2 text-xs leading-relaxed text-muted-foreground sm:text-sm"
              >
                <span className="shrink-0 text-orange-500" aria-hidden>
                  ▸
                </span>
                {note}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
