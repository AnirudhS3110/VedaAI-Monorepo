"use client";

import { Plus } from "lucide-react";
import type { Control, FieldErrors, UseFieldArrayReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { QUESTION_TYPE_OPTIONS } from "@/constants/question-types";
import type { CreateAssignmentFormValues } from "@/lib/validations/create-assignment";
import { QuestionTypeRow } from "./question-type-row";

interface QuestionTypesSectionProps {
  control: Control<CreateAssignmentFormValues>;
  fieldArray: UseFieldArrayReturn<
    CreateAssignmentFormValues,
    "questionRows"
  >;
  errors?: FieldErrors<CreateAssignmentFormValues>;
}

function typeLabel(value: string): string {
  return (
    QUESTION_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value
  );
}

export function QuestionTypesSection({
  control,
  fieldArray,
  errors,
}: QuestionTypesSectionProps) {
  const { fields, append, remove } = fieldArray;
  const rows = useWatch({ control, name: "questionRows" }) ?? [];

  const totalQuestions = rows.reduce((sum, r) => sum + (r?.numQuestions ?? 0), 0);
  const totalMarks = rows.reduce(
    (sum, r) => sum + (r?.numQuestions ?? 0) * (r?.marks ?? 0),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="hidden gap-4 border-b border-border pb-2 text-xs font-medium text-muted-foreground lg:grid lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <span>Question Type</span>
        <span>No. of Questions</span>
        <span>Marks</span>
        <span className="w-9" aria-hidden />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {fields.map((field, index) => (
          <QuestionTypeRow
            key={field.id}
            index={index}
            control={control}
            errors={errors?.questionRows}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
      </div>

      {errors?.questionRows?.message && (
        <p className="text-xs text-destructive">{errors.questionRows.message}</p>
      )}
      {errors?.questionRows?.root?.message && (
        <p className="text-xs text-destructive">
          {errors.questionRows.root.message}
        </p>
      )}

      <Button
        type="button"
        variant="ghost"
        className="h-10 w-full cursor-pointer gap-1.5 rounded-xl px-2 text-sm font-medium text-foreground sm:h-9 sm:w-auto"
        onClick={() =>
          append({ type: "short", numQuestions: 5, marks: 2 })
        }
      >
        <Plus className="size-4" />
        Add Question Type
      </Button>

      <div className="rounded-xl border border-border/80 bg-muted/30 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Paper totals
        </p>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium text-foreground">
          <p>
            Total Questions:{" "}
            <span className="tabular-nums">{totalQuestions}</span>
          </p>
          <p>
            Total Marks: <span className="tabular-nums">{totalMarks}</span>
          </p>
        </div>
        {rows.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            {rows.map((row, index) => (
              <li key={`${row?.type ?? "row"}-${index}`}>
                {typeLabel(row?.type ?? "short")}: {row?.numQuestions ?? 0} ×{" "}
                {row?.marks ?? 0} marks ={" "}
                <span className="font-medium tabular-nums text-foreground">
                  {(row?.numQuestions ?? 0) * (row?.marks ?? 0)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
