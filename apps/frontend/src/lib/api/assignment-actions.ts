import { assignmentsApi } from "./assignments";
import { downloadAssignmentPdfFile, ensurePdfReady } from "./pdf";

export async function downloadAssignmentPdf(assignmentId: string): Promise<void> {
  await ensurePdfReady(assignmentId);
  await downloadAssignmentPdfFile(assignmentId);
}

export async function regenerateAssignmentSection(
  assignmentId: string,
  sectionTitle: string,
) {
  return assignmentsApi.regenerateSection(assignmentId, { sectionTitle });
}
