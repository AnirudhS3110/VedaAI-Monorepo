"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudUpload,
  FileText,
  ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  detectUploadKind,
  extractContentFromFile,
  validateUploadFile,
} from "@/lib/upload/extract-content";
import type { UploadExtractionState } from "@/lib/upload/types";
import { initialUploadState } from "@/lib/upload/types";
import { cn } from "@/lib/utils";

const ACCEPT =
  "application/pdf,text/plain,.txt,image/jpeg,image/png,.pdf";

interface FileUploadZoneProps {
  state: UploadExtractionState;
  onStateChange: (state: UploadExtractionState) => void;
}

export function FileUploadZone({ state, onStateChange }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const revokePreview = useCallback((url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    return () => revokePreview(state.previewUrl);
  }, [revokePreview, state.previewUrl]);

  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateUploadFile(file);
      if (validationError) {
        onStateChange({
          ...initialUploadState(),
          status: "error",
          error: validationError,
        });
        return;
      }

      const kind = detectUploadKind(file);
      onStateChange({
        file,
        kind,
        status: "extracting",
        extractedContent: "",
        previewUrl: null,
        truncated: false,
        message: null,
        error: null,
      });

      try {
        const result = await extractContentFromFile(file, kind);
        onStateChange({
          file,
          kind,
          status: "ready",
          extractedContent: result.content,
          previewUrl: result.previewUrl,
          truncated: result.truncated,
          message: result.message,
          error: null,
        });
      } catch (err) {
        onStateChange({
          file,
          kind,
          status: "error",
          extractedContent: "",
          previewUrl: null,
          truncated: false,
          message: null,
          error:
            err instanceof Error
              ? err.message
              : "Failed to process file",
        });
      }
    },
    [onStateChange],
  );

  const handleFile = useCallback(
    (f: File | null) => {
      if (!f) {
        revokePreview(state.previewUrl);
        onStateChange(initialUploadState());
        return;
      }
      void processFile(f);
    },
    [onStateChange, processFile, revokePreview, state.previewUrl],
  );

  const clearFile = () => {
    revokePreview(state.previewUrl);
    onStateChange(initialUploadState());
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) void handleFile(dropped);
  };

  const isExtracting = state.status === "extracting";

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex min-h-[10.5rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 transition-colors sm:px-6 sm:py-10",
          isDragging
            ? "border-foreground/30 bg-muted/50"
            : "border-border bg-muted/20",
          state.status === "error" && "border-destructive/50",
          isExtracting && "pointer-events-none opacity-80",
        )}
      >
        {isExtracting ? (
          <Loader2 className="size-10 animate-spin text-muted-foreground" />
        ) : (
          <CloudUpload
            className="size-10 text-muted-foreground/70"
            strokeWidth={1.25}
          />
        )}
        <p className="mt-4 text-sm font-medium text-foreground">
          {isExtracting ? "Extracting content…" : "Choose a file or drag & drop"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF, TXT, JPEG, or PNG · up to 10MB
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={isExtracting}
          className="mt-4 w-full max-w-xs cursor-pointer rounded-xl bg-card shadow-sm sm:mt-5 sm:w-auto"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          disabled={isExtracting}
          onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        We extract readable text from PDFs and text files to improve AI question
        generation.
      </p>

      <AnimatePresence mode="wait">
        {state.status === "error" && state.error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-destructive"
          >
            {state.error}
          </motion.p>
        )}

        {state.status === "ready" && state.file && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-border bg-muted/30 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                {state.kind === "image" && state.previewUrl ? (
                  <img
                    src={state.previewUrl}
                    alt="Upload preview"
                    className="size-14 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
                    {state.kind === "pdf" ? (
                      <FileText className="size-5 text-muted-foreground" />
                    ) : (
                      <ImageIcon className="size-5 text-muted-foreground" />
                    )}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{state.file.name}</p>
                  {state.message && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {state.message}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="touch-manipulation tap-highlight-none flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground active:bg-muted active:scale-95 lg:hover:bg-muted lg:hover:text-foreground"
                aria-label="Remove file"
              >
                <X className="size-4" />
              </button>
            </div>

            {state.kind !== "image" && state.extractedContent && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium text-foreground">
                  Preview extracted text
                </summary>
                <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-background p-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {state.extractedContent.slice(0, 1200)}
                  {state.extractedContent.length > 1200 ? "…" : ""}
                </pre>
              </details>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
