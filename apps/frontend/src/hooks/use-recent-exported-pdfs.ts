"use client";

import { useCallback, useEffect, useState } from "react";
import type { AssignmentListItem } from "@/stores/assignments-store";
import { getCompletedForExportCheck } from "@/lib/home-workspace";
import { pdfExists } from "@/lib/api/pdf";

export interface ExportedPdfItem {
  assignment: AssignmentListItem;
}

export function useRecentExportedPdfs(items: AssignmentListItem[]) {
  const [exported, setExported] = useState<ExportedPdfItem[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const refresh = useCallback(async () => {
    const candidates = getCompletedForExportCheck(items, 8);
    if (candidates.length === 0) {
      setExported([]);
      return;
    }

    setIsChecking(true);
    try {
      const results = await Promise.all(
        candidates.map(async (assignment) => ({
          assignment,
          exists: await pdfExists(assignment.id),
        })),
      );
      setExported(
        results
          .filter((r) => r.exists)
          .slice(0, 5)
          .map((r) => ({ assignment: r.assignment })),
      );
    } finally {
      setIsChecking(false);
    }
  }, [items]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { exported, isChecking, refresh };
}
