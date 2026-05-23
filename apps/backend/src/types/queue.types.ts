export const QUEUE_NAMES = {
  ASSESSMENT_GENERATION: 'assessment-generation',
  PDF_GENERATION: 'pdf-generation',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export interface AssessmentGenerationJobData {
  assignmentId: string;
}

export interface PdfGenerationJobData {
  assignmentId: string;
}

export type AssessmentGenerationJobName = 'generate';
export type PdfGenerationJobName = 'generate-pdf';
