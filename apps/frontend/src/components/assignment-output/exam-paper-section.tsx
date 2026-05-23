"use client";

import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import type { PaperSection } from "@/types/domain";
import type { QuestionType } from "@/types/domain";
import { ExamPaperQuestion } from "./exam-paper-question";

const SECTION_TYPE_HEADINGS: Record<QuestionType, string> = {
  mcq: "Multiple Choice Questions",
  short: "Short Answer Questions",
  long: "Long Answer Questions",
  true_false: "True / False Questions",
  fill_blank: "Fill in the Blanks",
};

function sectionHeading(questions: { type: QuestionType }[]): string {
  const type = questions[0]?.type ?? "short";
  return SECTION_TYPE_HEADINGS[type];
}

interface ExamPaperSectionProps {
  section: PaperSection;
  numberByKey: Map<string, number>;
  isRegenerating: boolean;
  onRegenerate: (sectionTitle: string) => void;
}

export function ExamPaperSection({
  section,
  numberByKey,
  isRegenerating,
  onRegenerate,
}: ExamPaperSectionProps) {
  return (
    <section className="relative mt-8 border-t border-foreground/10 pt-8 first:mt-6 first:border-t-0 first:pt-0 sm:mt-12 sm:pt-10 sm:first:mt-8">
      <div className="mb-4 flex flex-col items-center gap-2 print:hidden sm:flex-row sm:justify-center sm:gap-3">
        <h2 className="text-center text-base font-bold sm:text-lg">
          {section.title}
        </h2>
        <button
          type="button"
          disabled={isRegenerating}
          onClick={() => onRegenerate(section.title)}
          className="inline-flex h-9 min-w-[9rem] items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 font-sans text-xs font-medium text-muted-foreground transition-colors active:bg-muted disabled:opacity-50 sm:py-1.5 lg:hover:bg-muted lg:hover:text-foreground"
        >
          {isRegenerating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          {isRegenerating ? "Regenerating…" : "Regenerate"}
        </button>
      </div>

      <h2 className="hidden text-center text-lg font-bold print:block">
        {section.title}
      </h2>

      {isRegenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/85 font-sans backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-2 px-4 text-center text-sm font-medium text-foreground">
            <Loader2 className="size-5 shrink-0 animate-spin" />
            AI is rewriting this section…
          </div>
        </motion.div>
      )}

      <h3 className="mt-4 text-sm font-bold sm:mt-6 sm:text-base">
        {sectionHeading(section.questions)}
      </h3>
      <p className="mt-1 text-sm italic leading-relaxed text-foreground/80">
        {section.instruction}
      </p>

      <ol className="mt-4 list-none space-y-4 pl-0 sm:mt-5 sm:space-y-4">
        {section.questions.map((question) => {
          const number =
            numberByKey.get(`${section.title}-${question.text}`) ?? 0;
          return (
            <ExamPaperQuestion
              key={`${section.title}-${number}-${question.text.slice(0, 24)}`}
              number={number}
              question={question}
            />
          );
        })}
      </ol>
    </section>
  );
}
