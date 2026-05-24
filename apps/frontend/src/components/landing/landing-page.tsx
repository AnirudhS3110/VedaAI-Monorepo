"use client";

import { ArchitectureSection } from "./sections/architecture-section";
import { FeatureGridSection } from "./sections/feature-grid-section";
import { FinalCtaSection } from "./sections/final-cta-section";
import { HeroSection } from "./sections/hero-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { LandingFooter } from "./sections/landing-footer";
import { LandingHeader } from "./sections/landing-header";
import { MobileExperienceSection } from "./sections/mobile-experience-section";
import { ProblemSolutionSection } from "./sections/problem-solution-section";
import { ProductPreviewSection } from "./sections/product-preview-section";
import { TemplatesSection } from "./sections/templates-section";
import { TrustStripSection } from "./sections/trust-strip-section";

export function LandingPage() {
  return (
    <div className="relative h-dvh scroll-smooth overflow-x-hidden overflow-y-auto overflow-touch bg-workspace scroll-pt-20">
      <div
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-orange-500/[0.03] via-transparent to-transparent"
        aria-hidden
      />
      <LandingHeader />
      <main className="relative">
        <HeroSection />
        <TrustStripSection />
        <ProblemSolutionSection />
        <FeatureGridSection />
        <TemplatesSection />
        {/* <HowItWorksSection /> */}
        <ArchitectureSection />
        {/* <ProductPreviewSection />
        <MobileExperienceSection /> */}
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
