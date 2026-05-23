"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  Wifi,
} from "lucide-react";
import { floatY } from "../motion";
import { LiveDot } from "../landing-visuals";
import { MockUiChrome } from "./mock-ui-chrome";

const wsEvents = [
  "generation_progress · 68%",
  "section_validated · MCQ",
  "queue_job_active · worker-1",
] as const;

export function HeroDashboardPreview() {
  return (
    <div className="relative">
      <GlowBehind />
      <motion.div {...floatY} className="relative mx-auto w-full max-w-lg lg:max-w-none">
        <MockUiChrome title="vedaai.app · dashboard">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-foreground sm:text-sm">
                  Assignments
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <LiveDot />
                  <p className="text-[10px] text-muted-foreground sm:text-xs">
                    1 job in queue · WS connected
                  </p>
                </div>
              </div>
              <span className="rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] px-2.5 py-1 text-[10px] font-medium text-white shadow-sm sm:text-xs">
                + Create
              </span>
            </div>

            <motion.div
              className="relative overflow-hidden rounded-xl border border-orange-200/60 bg-gradient-to-br from-orange-50/80 to-card p-3 dark:from-orange-950/30"
              animate={{ boxShadow: ["0 0 0 rgba(249,115,22,0)", "0 0 24px rgba(249,115,22,0.12)", "0 0 0 rgba(249,115,22,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-orange-500" />
                  <p className="text-[10px] font-medium sm:text-xs">
                    Biology Midterm — generating
                  </p>
                </div>
                <span className="rounded-md bg-orange-500/15 px-1.5 py-0.5 text-[9px] font-medium text-orange-700">
                  BullMQ
                </span>
              </div>
              <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-orange-100/80">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                  animate={{ width: ["18%", "72%", "78%"] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
              <p className="mt-2 text-[9px] text-muted-foreground">
                Semantic validation · section 2 of 3
              </p>
            </motion.div>

            <div className="rounded-lg border border-border/60 bg-card/80 p-2 font-mono text-[8px] text-muted-foreground sm:text-[9px]">
              {wsEvents.map((evt, i) => (
                <motion.p
                  key={evt}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: [0.4, 1, 0.4], x: 0 }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }}
                  className="truncate"
                >
                  <span className="text-orange-500">→</span> {evt}
                </motion.p>
              ))}
            </div>

            {[
              { title: "Physics Unit Test", meta: "PDF ready", badge: "Exported" },
              { title: "Chemistry Quiz", meta: "20 questions", badge: "Validated" },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.12 }}
                className="flex items-start justify-between gap-2 rounded-xl border border-border/60 bg-card/90 p-3 shadow-sm backdrop-blur-sm"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{card.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{card.meta}</p>
                </div>
                <span className="shrink-0 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">
                  {card.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </MockUiChrome>

        <FloatingPill
          className="-left-3 top-8 hidden sm:flex lg:-left-8"
          icon={Layers}
          title="3 sections"
          sub="Structured output"
          delay={0.5}
        />
        <FloatingPill
          className="-right-2 bottom-20 hidden sm:flex lg:-right-6"
          icon={CheckCircle2}
          title="Validation pass"
          sub="MCQ · 4 options"
          delay={0.65}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute -bottom-5 left-4 flex items-center gap-2 rounded-xl border border-border/70 bg-card/95 px-3 py-2 shadow-lg backdrop-blur-md sm:left-0"
        >
          <FileText className="size-4 text-emerald-600" />
          <div>
            <p className="text-[10px] font-semibold">PDF exported</p>
            <p className="text-[9px] text-muted-foreground">Puppeteer pipeline</p>
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-3 right-4 flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 shadow-md sm:right-0"
        >
          <Wifi className="size-3 text-orange-500" />
          <span className="text-[9px] font-medium">Live</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function GlowBehind() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-3xl bg-gradient-to-br from-orange-500/20 via-transparent to-transparent blur-2xl"
      aria-hidden
    />
  );
}

function FloatingPill({
  className,
  icon: Icon,
  title,
  sub,
  delay,
}: {
  className?: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`absolute items-center gap-2 rounded-xl border border-border/70 bg-card/95 px-3 py-2 shadow-md backdrop-blur-md ${className}`}
    >
      <Icon className="size-4 text-orange-500" />
      <div>
        <p className="text-[10px] font-semibold">{title}</p>
        <p className="text-[9px] text-muted-foreground">{sub}</p>
      </div>
    </motion.div>
  );
}
