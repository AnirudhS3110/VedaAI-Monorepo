import type { MouseEvent } from "react";

/** Scroll to an in-page section on the landing page (nested scroll container). */
export function scrollToLandingSection(sectionId: string): void {
  const id = sectionId.replace(/^#/, "");
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function handleLandingAnchorClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
): void {
  if (!href.startsWith("#")) return;

  event.preventDefault();
  scrollToLandingSection(href);
}
