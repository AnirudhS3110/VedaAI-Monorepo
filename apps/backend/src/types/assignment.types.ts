import type { AssignmentStatus, PaperSection, QuestionType } from './domain.types';

export interface AssignmentResponse {
  id: string;
  title: string;
  schoolName: string;
  className: string;
  subject: string;
  dueDate: string;
  questionTypes: QuestionType[];
  numQuestions: number;
  totalMarks: number;
  instructions: string;
  uploadedContent: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedPaperResponse {
  id: string;
  assignmentId: string;
  sections: PaperSection[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentDetailResponse {
  assignment: AssignmentResponse;
  generatedPaper: GeneratedPaperResponse | null;
  status: AssignmentStatus;
}

export interface CreateAssignmentResponse {
  assignmentId: string;
  jobId: string;
}

export interface PdfGenerationResponse {
  assignmentId: string;
  jobId: string;
}

export interface RegenerateSectionResponse {
  assignmentId: string;
  section: PaperSection;
}

export interface AssignmentListItemResponse {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: AssignmentStatus;
  createdAt: string;
}
