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
    <section className="paper-section">
      <div className="section-actions">
        <button
          type="button"
          disabled={isRegenerating}
          onClick={() => onRegenerate(section.title)}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors active:bg-muted disabled:opacity-50 lg:hover:bg-muted lg:hover:text-foreground"
        >
          {isRegenerating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          {isRegenerating ? "Regenerating…" : `Regenerate · ${section.title}`}
        </button>
      </div>

      {isRegenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/90 font-sans backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-2 px-4 text-center text-sm font-medium text-foreground">
            <Loader2 className="size-5 shrink-0 animate-spin" />
            AI is rewriting this section…
          </div>
        </motion.div>
      )}

      <div className="section-intro">
        <h2 className="section-title">{section.title}</h2>
        <h3 className="section-type-heading">
          {sectionHeading(section.questions)}
        </h3>
        <p className="section-instruction">{section.instruction}</p>
      </div>

      <ol className="questions-list">
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
