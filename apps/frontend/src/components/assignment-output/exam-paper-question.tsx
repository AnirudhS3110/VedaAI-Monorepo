import type { Question } from "@/types/domain";
import {
  DIFFICULTY_LABELS,
  isMcqWithOptions,
  MCQ_OPTION_LABELS,
} from "@/lib/exam-paper";
import { cn } from "@/lib/utils";

interface ExamPaperQuestionProps {
  number: number;
  question: Question;
}

export function ExamPaperQuestion({ number, question }: ExamPaperQuestionProps) {
  const showMcqOptions = isMcqWithOptions(question);

  return (
    <li className="min-w-0 text-sm leading-[1.65] text-foreground sm:text-[15px] sm:leading-relaxed">
      <div className="min-w-0">
        <span className="font-medium tabular-nums">{number}. </span>
        <span
          className={cn(
            "mr-1 font-medium",
            question.difficulty === "easy" && "text-emerald-700",
            question.difficulty === "medium" && "text-amber-700",
            question.difficulty === "hard" && "text-red-700",
          )}
        >
          [{DIFFICULTY_LABELS[question.difficulty]}]
        </span>{" "}
        <span className="break-words [overflow-wrap:anywhere]">
          {question.text}
        </span>{" "}
        <span className="whitespace-nowrap font-medium text-foreground/80">
          [{question.marks} Marks]
        </span>
      </div>

      {showMcqOptions ? (
        <ol className="mt-2.5 list-none space-y-2 pl-4 sm:mt-3 sm:space-y-1.5 sm:pl-6">
          {question.options.map((option, index) => (
            <li
              key={`${number}-${index}-${option.slice(0, 24)}`}
              className="min-w-0 break-words text-sm sm:text-[15px]"
            >
              <span className="font-medium tabular-nums">
                {MCQ_OPTION_LABELS[index] ?? String(index + 1)}.
              </span>{" "}
              {option}
            </li>
          ))}
        </ol>
      ) : question.type === "mcq" && question.answer ? (
        <p className="mt-2 pl-4 text-xs text-muted-foreground sm:pl-6 sm:text-sm">
          (Legacy MCQ — see answer key)
        </p>
      ) : null}
    </li>
  );
}
