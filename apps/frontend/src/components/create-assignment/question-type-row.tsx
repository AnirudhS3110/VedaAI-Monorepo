"use client";

import { X } from "lucide-react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { QUESTION_TYPE_OPTIONS } from "@/constants/question-types";
import type { CreateAssignmentFormValues } from "@/lib/validations/create-assignment";
import { mobileUi } from "@/lib/mobile-ui";
import { cn } from "@/lib/utils";
import { NumberStepper } from "./number-stepper";

interface QuestionTypeRowProps {
  index: number;
  control: Control<CreateAssignmentFormValues>;
  errors?: FieldErrors<CreateAssignmentFormValues>["questionRows"];
  onRemove: () => void;
  canRemove: boolean;
}

export function QuestionTypeRow({
  index,
  control,
  errors,
  onRemove,
  canRemove,
}: QuestionTypeRowProps) {
  const rowErrors = errors?.[index];

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-muted/20 p-4",
        "max-lg:border-0 max-lg:bg-transparent max-lg:p-0",
        "sm:border-0 sm:bg-transparent sm:p-0",
        "sm:grid sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-4 sm:border-b sm:border-border/60 sm:pb-4 sm:last:border-0 sm:last:pb-0",
      )}
    >
      <div className="flex items-start justify-between gap-2 sm:contents">
        <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-0">
          <label className="text-xs font-medium text-muted-foreground">
            Question Type
          </label>
          <Controller
            name={`questionRows.${index}.type`}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={cn(
                  "h-11 w-full cursor-pointer rounded-full border border-border bg-background px-3 text-sm shadow-sm outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring/30",
                  mobileUi.createFormField,
                  rowErrors?.type && "border-destructive",
                )}
              >
                {QUESTION_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          />
          {rowErrors?.type && (
            <p className="text-xs text-destructive">{rowErrors.type.message}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors",
            "active:bg-muted sm:order-4 sm:size-9 sm:rounded-lg lg:hover:bg-muted lg:hover:text-foreground",
            !canRemove && "invisible",
          )}
          aria-label="Remove question type"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-0 sm:contents">
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            No. of Questions
          </span>
          <Controller
            name={`questionRows.${index}.numQuestions`}
            control={control}
            render={({ field }) => (
              <NumberStepper
                value={field.value}
                onChange={field.onChange}
                min={1}
                max={50}
                aria-label="number of questions"
                className="w-full"
              />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Marks</span>
          <Controller
            name={`questionRows.${index}.marks`}
            control={control}
            render={({ field }) => (
              <NumberStepper
                value={field.value}
                onChange={field.onChange}
                min={1}
                max={100}
                aria-label="marks per question"
                className="w-full"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
