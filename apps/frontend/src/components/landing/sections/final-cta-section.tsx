"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingGridBackground } from "../landing-visuals";
import { LandingSection } from "../landing-section";

const primaryBtn =
  "h-12 rounded-2xl bg-white px-8 text-base text-[#1a1a1a] hover:bg-white/90";

export function FinalCtaSection() {
  return (
    <LandingSection animate={false} className="pb-12 pt-8 sm:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] px-8 py-16 text-center sm:px-14 sm:py-20"
      >
        <LandingGridBackground className="opacity-30" />
        <motion.div
          className="pointer-events-none absolute -left-20 top-0 size-64 rounded-full bg-orange-500/25 blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -right-20 bottom-0 size-64 rounded-full bg-orange-500/15 blur-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          aria-hidden
        />

        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Start creating AI-powered assessments
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/60">
            Launch the app, configure your first paper, and watch realtime
            generation flow through a production pipeline.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className={primaryBtn}>
              <Link href="/login">
                Launch App
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a
                href="https://github.com/AnirudhS3110/VedaAI-Monorepo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 className="size-4" />
                View Source
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </LandingSection>
  );
}
