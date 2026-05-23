"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowOrb, LandingGridBackground, SectionLabel } from "../landing-visuals";
import { fadeUpHero } from "../motion";
import { HeroDashboardPreview } from "../previews/hero-dashboard-preview";

const highlights = [
  "Realtime generation",
  "Semantic validation",
  "Queue orchestration",
  "PDF exports",
] as const;

const primaryBtn =
  "h-12 rounded-2xl bg-[#1a1a1a] px-6 text-base text-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-[#2a2a2a]";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pt-20">
      <LandingGridBackground glow />
      <GlowOrb className="right-0 top-20 size-72 opacity-60 lg:size-96" />

      <div className="relative mx-auto grid max-w-6xl min-w-0 items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div>
          <motion.div {...fadeUpHero} transition={{ ...fadeUpHero.transition, delay: 0 }}>
            <SectionLabel>Production infrastructure</SectionLabel>
          </motion.div>

          <motion.h1
            initial={fadeUpHero.initial}
            animate={fadeUpHero.animate}
            transition={{ ...fadeUpHero.transition, delay: 0.06 }}
            className="mt-4 text-[2rem] font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
          >
            Generate structured question papers with{" "}
            <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          <motion.p
            initial={fadeUpHero.initial}
            animate={fadeUpHero.animate}
            transition={{ ...fadeUpHero.transition, delay: 0.14 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Queue-driven orchestration, semantic validation pipelines, live
            WebSocket progress, and print-ready PDF exports—built as a real
            distributed assessment platform.
          </motion.p>

          <motion.ul
            initial={fadeUpHero.initial}
            animate={fadeUpHero.animate}
            transition={{ ...fadeUpHero.transition, delay: 0.2 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-medium text-foreground/90 backdrop-blur-sm"
              >
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={fadeUpHero.initial}
            animate={fadeUpHero.animate}
            transition={{ ...fadeUpHero.transition, delay: 0.28 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className={primaryBtn}>
              <Link href="/login">
                Launch App
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl border-border/80 bg-card/50 backdrop-blur-sm">
              <a href="#architecture">View Architecture</a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 32, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <HeroDashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
