"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteAssignmentDialogProps {
  open: boolean;
  title: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAssignmentDialog({
  open,
  title,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteAssignmentDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={isDeleting ? undefined : onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-assignment-title"
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="delete-assignment-title"
          className="text-lg font-semibold text-foreground"
        >
          Delete assignment?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          &ldquo;{title}&rdquo; and its generated paper will be permanently
          removed. This cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            className="rounded-xl"
            disabled={isDeleting}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-red-600 text-white hover:bg-red-700"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
