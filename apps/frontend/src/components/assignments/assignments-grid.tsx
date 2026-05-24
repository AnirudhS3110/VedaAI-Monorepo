"use client";

import type { AssignmentListItem } from "@/stores/assignments-store";
import { AssignmentCard } from "./assignment-card";

interface AssignmentsGridProps {
  assignments: AssignmentListItem[];
}

export function AssignmentsGrid({ assignments }: AssignmentsGridProps) {
  return (
    <ul className="grid min-w-0 list-none grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-2">
      {assignments.map((assignment, index) => (
        <li key={assignment.id} className="min-w-0">
          <AssignmentCard assignment={assignment} index={index} />
        </li>
      ))}
    </ul>
  );
}
