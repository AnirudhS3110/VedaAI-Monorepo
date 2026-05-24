import Link from "next/link";
import { Code2 } from "lucide-react";
import { VedaLogo } from "@/components/layout/veda-logo";

const links = [
  { label: "GitHub", href: "https://github.com/AnirudhS3110/VedaAI-Monorepo",logo: <Code2 className="size-4" />, external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/anirudh-selvakumar31/", external: true },
  { label: "Architecture", href: "#architecture", external: false },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/30 px-4 py-12 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl min-w-0 flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <VedaLogo href="/" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Built by Anirudh — production-grade AI assessment generation for
            educators.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {links.map(({ label, href, external }) => (
            <Link
              key={label}
              href={href}
              className="text-muted-foreground transition-colors hover:text-foreground"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-border/40 pt-8 text-center text-xs text-muted-foreground sm:text-left">
        © {new Date().getFullYear()} VedaAI · Queue-driven · Validation-first ·
        Realtime by design
      </p>
    </footer>
  );
}
