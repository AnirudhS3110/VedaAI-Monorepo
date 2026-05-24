"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VedaLogo } from "@/components/layout/veda-logo";
import { handleLandingAnchorClick } from "@/lib/landing-scroll";
import { cn } from "@/lib/utils";
import { fadeUpHero } from "../motion";

const navLinks = [
  { href: "#features", label: "Features" },
  // { href: "#workflow", label: "Workflow" },
  { href: "#architecture", label: "Architecture" },
  // { href: "#mobile", label: "Mobile" },
  { href: "https://github.com/AnirudhS3110/VedaAI-Monorepo", label: "GitHub", external: true },
] as const;

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={fadeUpHero.initial}
      animate={fadeUpHero.animate}
      transition={{ duration: 0.4 }}
      className={cn(
        "sticky top-0 z-50 transition-[background,box-shadow,border-color] duration-300",
        scrolled
          ? "border-b border-border/50 bg-workspace/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <VedaLogo href="/" />
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={"external" in link && link.external ? "_blank" : undefined}
              rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
              onClick={
                "external" in link && link.external
                  ? undefined
                  : (e) => handleLandingAnchorClick(e, link.href)
              }
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Button
          asChild
          className="h-10 rounded-xl bg-[#1a1a1a] px-4 text-white hover:bg-[#2a2a2a]"
        >
          <Link href="/login">
            Launch App
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </motion.header>
  );
}
