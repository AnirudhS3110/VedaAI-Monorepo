import type { AssignmentStatus, PaperSection, QuestionType } from "./domain";

export interface Assignment {
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

export interface GeneratedPaper {
  id: string;
  assignmentId: string;
  sections: PaperSection[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentDetail {
  assignment: Assignment;
  generatedPaper: GeneratedPaper | null;
  status: AssignmentStatus;
}

export interface QuestionBlueprintItem {
  type: QuestionType;
  numQuestions: number;
  marksPerQuestion: number;
}

export interface CreateAssignmentPayload {
  title: string;
  schoolName: string;
  className: string;
  subject: string;
  dueDate: string | Date;
  questionTypes: QuestionType[];
  questionBlueprint?: QuestionBlueprintItem[];
  numQuestions: number;
  totalMarks: number;
  instructions?: string;
  uploadedContent?: string;
}

export interface CreateAssignmentResult {
  assignmentId: string;
  jobId: string;
}

export interface PdfGenerationResult {
  assignmentId: string;
  jobId: string;
}

export interface RegenerateSectionPayload {
  sectionTitle: string;
}

export interface RegenerateSectionResult {
  assignmentId: string;
  section: PaperSection;
}
