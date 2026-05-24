"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  FileText,
  LayoutTemplate,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASSIGNMENT_TEMPLATES } from "@/lib/home-templates";
import { cn } from "@/lib/utils";
import { GlassCard, SectionLabel } from "../landing-visuals";
import { LandingSection } from "../landing-section";
import { staggerContainer, staggerItem, viewportOnce } from "../motion";

const steps = [
  {
    icon: LayoutTemplate,
    title: "Pick a template",
    body: "Unit test, midterm, MCQ practice, or short-answer — pre-filled sections and marks.",
  },
  {
    icon: Sparkles,
    title: "Generate with AI",
    body: "Upload syllabus context or instructions; validated sections are built in the background.",
  },
  {
    icon: Download,
    title: "Export PDF",
    body: "One-click print-ready papers from completed assignments — same layout teachers preview on screen.",
  },
] as const;

export function TemplatesSection() {
  return (
    <LandingSection id="templates" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
        aria-hidden
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
        <div className="max-w-xl">
          <SectionLabel>Templates</SectionLabel>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Start from a template, finish with a PDF
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Teachers skip blank forms. Each template ships with the right question
            mix, section structure, and marking scheme — then VedaAI generates the
            paper and Puppeteer renders a download-ready PDF when you are done.
          </p>

          <motion.ol
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={viewportOnce}
            className="mt-8 space-y-4"
          >
            {steps.map(({ icon: Icon, title, body }, index) => (
              <motion.li
                key={title}
                variants={staggerItem}
                className="flex gap-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1a1a1a] text-sm font-semibold text-white shadow-md">
                  {index + 1}
                </span>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon className="size-4 text-orange-600" strokeWidth={1.75} />
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>

          <Button
            asChild
            className="mt-8 h-11 rounded-xl bg-[#1a1a1a] px-5 text-white hover:bg-[#2a2a2a]"
          >
            <Link href="/login">
              Try templates in the app
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportOnce}
          className="grid gap-3 sm:grid-cols-2"
        >
          {ASSIGNMENT_TEMPLATES.map((template) => (
            <motion.article key={template.id} variants={staggerItem}>
              <GlassCard
                className={cn(
                  "h-full transition-[border-color,box-shadow]",
                  "hover:border-orange-200/40 hover:shadow-[0_8px_30px_rgba(249,115,22,0.08)]",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm">
                    <LayoutTemplate className="size-4" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <FileText className="size-3" />
                    PDF ready
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {template.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {template.description}
                </p>
                <ul className="mt-3 space-y-1 border-t border-border/60 pt-3">
                  {template.questionRows.map((row) => (
                    <li
                      key={`${template.id}-${row.type}`}
                      className="flex justify-between text-[11px] text-muted-foreground"
                    >
                      <span className="capitalize">
                        {row.type.replace("_", " ")}
                      </span>
                      <span>
                        {row.numQuestions}×{row.marks} marks
                      </span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </LandingSection>
  );
}
