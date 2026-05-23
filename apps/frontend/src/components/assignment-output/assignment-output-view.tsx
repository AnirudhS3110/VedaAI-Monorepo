"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ContentArea } from "@/components/layout/content-area";
import { PageTransition } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { getUserFirstName } from "@/lib/user-display";
import { useSession } from "next-auth/react";
import { useAssignmentGenerationSocket } from "@/hooks/use-assignment-generation-socket";
import { assignmentsApi } from "@/lib/api/assignments";
import {
  downloadAssignmentPdf,
  regenerateAssignmentSection,
} from "@/lib/api/assignment-actions";
import { getErrorMessage } from "@/lib/api/errors";
import { useGenerationStore } from "@/stores/generation-store";
import type { AssignmentDetail } from "@/types/assignment";
import type { PaperSection } from "@/types/domain";
import { AssignmentAiBanner } from "./assignment-ai-banner";
import { ExamPaperDocument } from "./exam-paper-document";

interface AssignmentOutputViewProps {
  assignmentId: string;
}

function replaceSection(
  sections: PaperSection[],
  title: string,
  updated: PaperSection,
): PaperSection[] {
  return sections.map((s) =>
    s.title.trim().toLowerCase() === title.trim().toLowerCase() ? updated : s,
  );
}

export function AssignmentOutputView({
  assignmentId,
}: AssignmentOutputViewProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [detail, setDetail] = useState<AssignmentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(
    null,
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const socketMessage = useGenerationStore((s) => s.message);
  const socketProgress = useGenerationStore((s) => s.progress);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignmentsApi.getById(assignmentId);
      setDetail(data);

      if (data.status === "generating" || data.status === "pending") {
        router.replace(`/assignments/${assignmentId}/generating`);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [assignmentId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  useAssignmentGenerationSocket({ assignmentId });

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    setPdfError(null);
    setPdfStatus("Checking for existing PDF…");
    try {
      setPdfStatus("Preparing your PDF — this may take a moment…");
      await downloadAssignmentPdf(assignmentId);
      setPdfStatus("Download started.");
      setTimeout(() => setPdfStatus(null), 3000);
    } catch (err) {
      setPdfError(getErrorMessage(err));
      setPdfStatus(null);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleRegenerateSection = async (sectionTitle: string) => {
    if (!detail?.generatedPaper || regeneratingSection) return;

    setRegeneratingSection(sectionTitle);
    setActionError(null);
    setActionMessage(null);

    const previousSections = detail.generatedPaper.sections;

    try {
      const { section } = await regenerateAssignmentSection(
        assignmentId,
        sectionTitle,
      );

      setDetail((prev) => {
        if (!prev?.generatedPaper) return prev;
        return {
          ...prev,
          generatedPaper: {
            ...prev.generatedPaper,
            sections: replaceSection(
              prev.generatedPaper.sections,
              sectionTitle,
              section,
            ),
          },
        };
      });

      setActionMessage(`"${sectionTitle}" regenerated successfully.`);
    } catch (err) {
      setDetail((prev) => {
        if (!prev?.generatedPaper) return prev;
        return {
          ...prev,
          generatedPaper: {
            ...prev.generatedPaper,
            sections: previousSections,
          },
        };
      });
      setActionError(getErrorMessage(err));
    } finally {
      setRegeneratingSection(null);
    }
  };

  if (loading) {
    return (
      <ContentArea className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </ContentArea>
    );
  }

  if (error || !detail?.generatedPaper) {
    return (
      <ContentArea className="max-w-lg text-center">
        <p className="text-sm text-destructive">
          {error ?? "Paper not ready yet."}
        </p>
        <Button asChild variant="outline" className="mt-4 rounded-xl">
          <Link href="/assignments">Back to Assignments</Link>
        </Button>
      </ContentArea>
    );
  }

  const { assignment, generatedPaper } = detail;
  const firstName = getUserFirstName(session?.user?.name);
  const bannerMessage = `Certainly, ${firstName}! Here is your customized question paper for ${assignment.subject} — ${assignment.title}:`;

  return (
    <PageTransition className="pb-8 max-lg:pb-6 lg:pb-12">
      <ContentArea className="max-w-3xl min-w-0 space-y-3 px-4 pt-2 sm:space-y-6 sm:px-6 sm:pt-4 lg:px-8">
        <AssignmentAiBanner
          message={bannerMessage}
          onDownloadPdf={() => void handleDownloadPdf()}
          isDownloading={pdfLoading}
          downloadStatus={pdfStatus}
        />
        {pdfError && (
          <p className="text-center text-xs text-destructive">{pdfError}</p>
        )}

        <AnimatePresence mode="wait">
          {actionMessage && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-center text-sm text-emerald-800"
            >
              {actionMessage}
            </motion.p>
          )}
          {actionError && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-center text-sm text-destructive"
            >
              {actionError}
            </motion.p>
          )}
          {regeneratingSection && socketMessage && (
            <motion.p
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-muted-foreground"
            >
              {socketMessage}
              {socketProgress > 0 && ` (${socketProgress}%)`}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ExamPaperDocument
            assignment={assignment}
            paper={generatedPaper}
            regeneratingSection={regeneratingSection}
            onRegenerateSection={(title) => void handleRegenerateSection(title)}
          />
        </motion.div>
      </ContentArea>
    </PageTransition>
  );
}
