"use client";

import { format, isValid, parse } from "date-fns";
import { Calendar } from "lucide-react";
import { useRef } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/lib/validations/create-assignment";
import { mobileUi } from "@/lib/mobile-ui";
import { cn } from "@/lib/utils";

interface DueDateFieldProps {
  control: Control<CreateAssignmentFormValues>;
  error?: FieldErrors<CreateAssignmentFormValues>["dueDate"];
}

function ddMmYyyyToNative(value: string): string {
  if (!value) return "";
  const parsed = parse(value, "dd-MM-yyyy", new Date());
  if (!isValid(parsed)) return "";
  return format(parsed, "yyyy-MM-dd");
}

function nativeToDdMmYyyy(value: string): string {
  if (!value) return "";
  const parsed = new Date(value + "T00:00:00");
  if (!isValid(parsed)) return "";
  return format(parsed, "dd-MM-yyyy");
}

export function DueDateField({ control, error }: DueDateFieldProps) {
  const nativeInputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const el = nativeInputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.click();
    }
  };

  return (
    <div className="space-y-2 ">
      <label htmlFor="dueDate-display" className="text-sm font-medium text-foreground">
        Due Date
      </label>
      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => (
          <div className="relative rounded-full">
            <input
              id="dueDate-display"
              type="text"
              readOnly
              placeholder="DD-MM-YYYY"
              value={field.value}
              onClick={openPicker}
              className={cn(
                "h-11 w-full cursor-pointer rounded-full border border-border bg-background px-4 pr-11 text-sm shadow-sm outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring/30",
                mobileUi.createFormField,
                error && "border-destructive",
              )}
            />
            <button
              type="button"
              onClick={openPicker}
              className="touch-manipulation tap-highlight-none absolute right-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors active:bg-muted active:scale-95 lg:hover:bg-muted lg:hover:text-foreground"
              aria-label="Open calendar"
            >
              <Calendar className="size-4" />
            </button>
            <input
              ref={nativeInputRef}
              type="date"
              tabIndex={-1}
              aria-hidden
              className="pointer-events-none absolute h-0 w-0 opacity-0"
              value={ddMmYyyyToNative(field.value)}
              onChange={(e) => field.onChange(nativeToDdMmYyyy(e.target.value))}
            />
          </div>
        )}
      />
      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  );
}
