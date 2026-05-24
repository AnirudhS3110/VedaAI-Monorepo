"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ContentArea } from "@/components/layout/content-area";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { useAssignmentGenerationSocket } from "@/hooks/use-assignment-generation-socket";
import { assignmentsApi } from "@/lib/api/assignments";
import { getErrorMessage } from "@/lib/api/errors";
import { statusToGenerationPayload } from "@/lib/generation-sync";
import { useAssignmentsStore } from "@/stores/assignments-store";
import { useGenerationStore } from "@/stores/generation-store";
import { GenerationProgressPanel } from "./generation-progress-panel";

const FALLBACK_POLL_MS = 2000;
const COMPLETE_REDIRECT_MS = 700;

interface GeneratingViewProps {
  assignmentId: string;
}

export function GeneratingView({ assignmentId }: GeneratingViewProps) {
  const router = useRouter();
  const updateItem = useAssignmentsStore((s) => s.updateItem);
  const updateFromEvent = useGenerationStore((s) => s.updateFromEvent);
  const progress = useGenerationStore((s) => s.progress);
  const message = useGenerationStore((s) => s.message);
  const isConnected = useGenerationStore((s) => s.isConnected);

  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateToResult = useCallback(() => {
    updateItem(assignmentId, { status: "completed" });
    router.replace(`/assignments/${assignmentId}`);
  }, [assignmentId, router, updateItem]);

  const handleCompleted = useCallback(() => {
    setIsComplete(true);
    redirectTimer.current = setTimeout(navigateToResult, COMPLETE_REDIRECT_MS);
  }, [navigateToResult]);

  const handleFailed = useCallback(
    (msg: string) => {
      updateItem(assignmentId, { status: "failed" });
      setError(msg || "Generation failed. Please try again.");
    },
    [assignmentId, updateItem],
  );

  useAssignmentGenerationSocket({
    assignmentId,
    onCompleted: handleCompleted,
    onFailed: handleFailed,
  });

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  // Always poll as backup; also catches completion if socket events were missed
  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const detail = await assignmentsApi.getById(assignmentId);
        if (!active) return;

        updateItem(assignmentId, { status: detail.status });

        const syncPayload = statusToGenerationPayload(detail);
        if (syncPayload && detail.status !== "completed") {
          updateFromEvent(syncPayload, { source: "poll" });
        }

        if (detail.status === "completed") {
          updateFromEvent(
            {
              assignmentId,
              status: "completed",
              progress: 100,
              message: "Generation completed",
            },
            { source: "poll" },
          );
          handleCompleted();
        } else if (detail.status === "failed") {
          handleFailed("Generation failed.");
        }
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err));
      }
    };

    void poll();
    const interval = setInterval(() => void poll(), FALLBACK_POLL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [
    assignmentId,
    handleCompleted,
    handleFailed,
    updateFromEvent,
    updateItem,
  ]);

  const displayProgress = isComplete ? 100 : progress;

  return (
    <PageTransition>
      <ContentArea className="max-w-2xl pb-8 max-lg:pt-2">
        <PageHeader
          title="Generating Assignment"
          description="Your question paper is being created"
          className="hidden lg:flex"
        />

        <GenerationProgressPanel
          progress={displayProgress}
          message={isComplete ? "Complete! Opening your paper…" : message}
          isConnected={isConnected}
          error={error}
        />

        {isComplete && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-xs text-muted-foreground"
          >
            Redirecting to your assignment…
          </motion.p>
        )}
      </ContentArea>
    </PageTransition>
  );
}
