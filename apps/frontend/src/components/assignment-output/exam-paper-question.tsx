import type { Question } from "@/types/domain";
import {
  DIFFICULTY_LABELS,
  isMcqWithOptions,
  MCQ_OPTION_LABELS,
} from "@/lib/exam-paper";

interface ExamPaperQuestionProps {
  number: number;
  question: Question;
}

export function ExamPaperQuestion({ number, question }: ExamPaperQuestionProps) {
  const showMcqOptions = isMcqWithOptions(question);
  const diffClass = `difficulty-${question.difficulty}`;

  return (
    <li className="question-item">
      <div className="question-stem">
        <span className="question-number">{number}. </span>
        <span className={`difficulty-label ${diffClass}`}>
          [{DIFFICULTY_LABELS[question.difficulty]}]
        </span>{" "}
        <span className="question-text">{question.text}</span>
        <span className="question-marks"> [{question.marks} Marks]</span>
      </div>

      {showMcqOptions ? (
        <ol className="mcq-options">
          {question.options.map((option, index) => (
            <li key={`${number}-${index}`} className="mcq-option">
              <span className="mcq-label">
                {MCQ_OPTION_LABELS[index] ?? String(index + 1)}.
              </span>{" "}
              {option}
            </li>
          ))}
        </ol>
      ) : question.type === "mcq" && question.answer ? (
        <p className="mt-1 pl-5 text-[9.5pt] text-muted-foreground">
          (Legacy MCQ — see answer key)
        </p>
      ) : null}
    </li>
  );
}
