import Link from "next/link";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import {
  ASSIGNMENT_TEMPLATES,
  buildCreateUrlFromTemplate,
} from "@/lib/home-templates";
import { cn } from "@/lib/utils";
import { HomeSection } from "./home-section";

export function HomeTemplates() {
  return (
    <HomeSection
      title="Templates"
      description="Start faster with common assessment formats."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {ASSIGNMENT_TEMPLATES.map((template) => (
          <Link
            key={template.id}
            href={buildCreateUrlFromTemplate(template.id)}
            className={cn(
              "group flex flex-col rounded-2xl border border-border/70 bg-card p-4",
              "shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow,transform]",
              "hover:border-border hover:shadow-md lg:hover:-translate-y-0.5",
            )}
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-foreground">
              <LayoutTemplate className="size-4" />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {template.name}
            </h3>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
              {template.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-orange-600">
              Use template
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </HomeSection>
  );
}
