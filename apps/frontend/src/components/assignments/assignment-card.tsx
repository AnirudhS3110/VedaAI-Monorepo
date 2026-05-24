"use client";

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";
import { motion } from "framer-motion";
import { MoreVertical } from "lucide-react";
import type { AssignmentListItem } from "@/stores/assignments-store";
import { useAssignmentsStore } from "@/stores/assignments-store";
import { assignmentsApi } from "@/lib/api/assignments";
import { getErrorMessage } from "@/lib/api/errors";
import { mobileUi } from "@/lib/mobile-ui";
import { cn } from "@/lib/utils";
import { DeleteAssignmentDialog } from "./delete-assignment-dialog";
import { ToastBanner } from "@/components/shared/toast-banner";
import { useRouter } from "next/navigation";

interface AssignmentCardProps {
  assignment: AssignmentListItem;
  index?: number;
}

export function AssignmentCard({ assignment, index = 0 }: AssignmentCardProps) {
  const removeItem = useAssignmentsStore((s) => s.removeItem);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  /** Block the card's onClick — do not call preventDefault (breaks menu links). */
  const stopCardNavigation = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

  const handleDeleteConfirm = useCallback(async () => {
    setIsDeleting(true);
    try {
      await assignmentsApi.delete(assignment.id);
      removeItem(assignment.id);
      setConfirmOpen(false);
      setMenuOpen(false);
      setToast({ message: "Assignment deleted", variant: "success" });
    } catch (error) {
      setToast({
        message: getErrorMessage(error) || "Could not delete assignment",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [assignment.id, removeItem]);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: Math.min(index * 0.05, 0.25),
          ease: [0.25, 0.1, 0.25, 1],
        }}
        onClick={()=>{
          router.push(`/assignments/${assignment.id}`);
        }}
        className={cn(
          "relative flex min-w-0 cursor-pointer flex-col rounded-2xl border border-border/70 bg-card",
          "p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-[transform,box-shadow]",
          mobileUi.elevatedCard,
          "sm:p-5 lg:hover:-translate-y-0.5 lg:hover:shadow-md",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "min-w-0 flex-1 pr-1 text-base font-semibold leading-snug text-foreground",
              "underline decoration-foreground/25 underline-offset-[3px] lg:no-underline",
              "line-clamp-3 break-words",
            )}
          >
            {assignment.title}
          </h3>

          <div
            className="relative shrink-0"
            ref={menuRef}
            onClick={stopCardNavigation}
            onPointerDown={stopCardNavigation}
          >
            <button
              type="button"
              onClick={(e) => {
                stopCardNavigation(e);
                setMenuOpen((open) => !open);
              }}
              className={cn(
                "touch-manipulation tap-highlight-none flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors",
                "active:scale-95 active:bg-muted lg:hover:bg-muted lg:hover:text-foreground",
                menuOpen && "bg-muted text-foreground",
              )}
              aria-label="Assignment options"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <MoreVertical className="size-5" />
            </button>

            {menuOpen && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-[60] mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg"
                onClick={stopCardNavigation}
                onPointerDown={stopCardNavigation}
              >
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full min-h-[44px] px-4 py-3 text-left text-sm font-medium text-foreground transition-colors active:bg-muted lg:py-2.5 lg:hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    router.push(`/assignments/${assignment.id}`);
                  }}
                >
                  View Assignment
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="min-h-[44px] w-full px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors active:bg-red-50 lg:py-2.5 lg:hover:bg-red-50"
                  onClick={(e) => {
                    stopCardNavigation(e);
                    setMenuOpen(false);
                    setConfirmOpen(true);
                  }}
                >
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "mt-6 flex flex-col gap-1.5 text-xs text-muted-foreground sm:mt-8 sm:flex-row",
            "sm:items-center sm:justify-between sm:gap-4 sm:text-sm",
          )}
        >
          <span className="min-w-0 truncate">
            Assigned on :{" "}
            <span className="text-foreground/80">{assignment.assignedOn}</span>
          </span>
          <span className="min-w-0 shrink-0 truncate sm:text-right">
            Due :{" "}
            <span className="text-foreground/80">{assignment.dueDate}</span>
          </span>
        </div>
      </motion.article>

      <DeleteAssignmentDialog
        open={confirmOpen}
        title={assignment.title}
        isDeleting={isDeleting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => !isDeleting && setConfirmOpen(false)}
      />

      {toast && (
        <ToastBanner
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
