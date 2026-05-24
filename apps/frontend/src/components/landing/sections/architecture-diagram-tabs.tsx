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
    alt: "VedaAI system architecture overview",
    summary:
      "End-to-end platform: Next.js, Express, MongoDB, BullMQ workers, and Socket.IO progress streaming.",
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
    alt: "Assignment generation pipeline",
    summary:
      "POST /assignments enqueues BullMQ; the worker calls Gemini, validates, persists, and streams Socket.IO events.",
    notes: [
      "Validation pipeline with retry on failure.",
      "Realtime UI: started, progress, completed, or failed.",
    ],
  },
  {
    id: "pdf",
    label: "PDF generation",
    src: "/pdf-generation-pipeline.png",
    alt: "PDF generation pipeline",
    summary:
      "On-demand PDF jobs; frontend polls until the file is ready, then downloads via HTTP.",
    notes: [
      "No Socket.IO for PDF completion.",
      "Puppeteer renders HTML to ./storage/pdfs/{id}.pdf.",
    ],
  },
] as const;

type DiagramId = (typeof diagrams)[number]["id"];

export function ArchitectureDiagramTabs() {
  const [active, setActive] = useState<DiagramId>("overview");
  const current = diagrams.find((d) => d.id === active) ?? diagrams[0];

  return (
    <div className="space-y-3 font-sans">
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
              "cursor-pointer rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm",
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
          className="min-w-0"
        >
          <GlassCard hover={false} className="overflow-hidden p-0">
            <div className="border-b border-border/60 bg-muted/30 px-3 py-2.5 sm:px-4">
              <p className="text-sm font-semibold text-foreground">
                {current.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {current.summary}
              </p>
            </div>
            <div className="flex max-h-[min(58vh,520px)] min-h-[200px] items-center justify-center overflow-auto bg-white p-2 sm:max-h-[min(62vh,560px)] sm:p-3 dark:bg-muted/15">
              <Image
                src={current.src}
                alt={current.alt}
                width={1600}
                height={900}
                className="h-auto w-full max-w-full object-contain object-center"
                sizes="(max-width: 1024px) 100vw, min(56vw, 720px)"
                priority={current.id === "overview"}
              />
            </div>
          </GlassCard>

          <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
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
