import { env } from "@/config/env";
import type {
  AssignmentDetail,
  CreateAssignmentPayload,
  CreateAssignmentResult,
  PdfGenerationResult,
  RegenerateSectionPayload,
  RegenerateSectionResult,
} from "@/types/assignment";
import { apiDelete, apiGet, apiPost } from "./client";

export interface AssignmentListItemDto {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: import("@/types/domain").AssignmentStatus;
  createdAt: string;
  updatedAt: string;
  hasStudyMaterial: boolean;
}

export const assignmentsApi = {
  list: () => apiGet<AssignmentListItemDto[]>("/assignments"),

  create: (payload: CreateAssignmentPayload) =>
    apiPost<CreateAssignmentResult, CreateAssignmentPayload>(
      "/assignments",
      payload,
    ),

  getById: (id: string) => apiGet<AssignmentDetail>(`/assignments/${id}`),

  regenerateSection: (id: string, payload: RegenerateSectionPayload) =>
    apiPost<RegenerateSectionResult, RegenerateSectionPayload>(
      `/assignments/${id}/regenerate-section`,
      payload,
    ),

  requestPdf: (id: string) =>
    apiPost<PdfGenerationResult>(`/assignments/${id}/generate-pdf`),

  pdfDownloadUrl: (id: string) => `${env.apiBasePath}/assignments/${id}/pdf`,

  delete: (id: string) =>
    apiDelete<{ deleted: true; id: string }>(`/assignments/${id}`),
};
