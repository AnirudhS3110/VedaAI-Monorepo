"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Database,
  Layers,
  Radio,
  Server,
  FileCode2,
  Globe,
} from "lucide-react";
import { staggerContainer, staggerItem, viewportOnce } from "../motion";

const stack = [
  { icon: Layers, label: "BullMQ" },
  { icon: Database, label: "Redis" },
  { icon: Radio, label: "Socket.IO" },
  { icon: Bot, label: "Gemini" },
  { icon: FileCode2, label: "Puppeteer" },
  { icon: Database, label: "MongoDB" },
  { icon: Server, label: "Express.js" },
  { icon: Globe, label: "Next.js" },
] as const;

export function TrustStripSection() {
  return (
    <section className="relative border-y border-border/50 bg-gradient-to-b from-card/40 to-transparent px-4 py-8 sm:px-6 lg:px-8">
      <p className="mb-6 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Infrastructure stack
      </p>
      <motion.ul
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={viewportOnce}
        className="mx-auto flex max-w-6xl min-w-0 flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-10"
      >
        {stack.map(({ icon: Icon, label }) => (
          <motion.li
            key={label}
            variants={staggerItem}
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-card shadow-sm">
              <Icon className="size-4 text-orange-500/90" strokeWidth={1.75} />
            </span>
            {label}
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
