"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { viewportOnce } from "../motion";

const pipeline = [
  { id: "upload", label: "Upload", sub: "Client extract" },
  { id: "api", label: "Express API", sub: "POST /assignments" },
  { id: "queue", label: "BullMQ", sub: "Redis queue" },
  { id: "worker", label: "AI Worker", sub: "Gemini" },
  { id: "validate", label: "Validation", sub: "Semantic checks" },
  { id: "db", label: "MongoDB", sub: "Persist" },
  { id: "ws", label: "Socket.IO", sub: "Live events" },
  { id: "pdf", label: "PDF Worker", sub: "Puppeteer" },
  { id: "ui", label: "Frontend", sub: "Delivery" },
] as const;

function PipelineNode({
  label,
  sub,
  index,
}: {
  label: string;
  sub: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="group relative flex flex-col items-center"
    >
      <div className="relative flex size-12 items-center justify-center rounded-xl border border-border/80 bg-card shadow-sm ring-1 ring-orange-500/10 transition-shadow group-hover:shadow-[0_0_24px_rgba(249,115,22,0.15)] sm:size-14">
        <motion.span
          className="absolute inset-0 rounded-xl bg-orange-500/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
        />
        <span className="relative text-[10px] font-bold text-orange-600 sm:text-xs">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-2 text-center text-xs font-semibold text-foreground">{label}</p>
      <p className="text-center text-[10px] text-muted-foreground">{sub}</p>
    </motion.div>
  );
}

export function PipelineTimeline({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent sm:top-7 lg:block"
        aria-hidden
      />
      <motion.div
        className="absolute left-0 top-6 hidden h-px w-1/3 bg-gradient-to-r from-orange-500/80 to-transparent lg:block"
        animate={{ x: ["0%", "200%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        aria-hidden
      />

      <div className="grid grid-cols-3 gap-x-2 gap-y-8 sm:grid-cols-5 lg:grid-cols-9">
        {pipeline.map((node, i) => (
          <PipelineNode
            key={node.id}
            label={node.label}
            sub={node.sub}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
