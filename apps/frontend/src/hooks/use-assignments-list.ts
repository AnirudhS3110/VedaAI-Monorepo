"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { assignmentsApi } from "@/lib/api/assignments";
import { getErrorMessage } from "@/lib/api/errors";
import { formatAssignedDate, formatDisplayDate } from "@/lib/format-date";
import {
  useAssignmentsStore,
  type AssignmentListItem,
} from "@/stores/assignments-store";

export function useAssignmentsList() {
  const { status } = useSession();
  const setItems = useAssignmentsStore((s) => s.setItems);
  const items = useAssignmentsStore((s) => s.items);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status !== "authenticated") return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await assignmentsApi.list();
      const mapped: AssignmentListItem[] = data.map((a) => ({
        id: a.id,
        title: a.title,
        subject: a.subject,
        assignedOn: formatAssignedDate(a.createdAt),
        dueDate: formatDisplayDate(a.dueDate),
        status: a.status,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        hasStudyMaterial: a.hasStudyMaterial,
      }));
      setItems(mapped);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [setItems, status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, isLoading, error, refresh };
}
