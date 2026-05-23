export {
  objectIdSchema,
  assignmentIdParamsSchema,
  type AssignmentIdParams,
} from './common.schema';
export {
  questionSchema,
  questionTypeSchema,
  questionDifficultySchema,
  type QuestionInput,
} from './question.schema';
export { sectionSchema, type SectionInput } from './section.schema';
export {
  regeneratedSectionOutputSchema,
  type RegeneratedSectionOutput,
} from './sectionOutput.schema';
export {
  generatedPaperOutputSchema,
  type GeneratedPaperOutput,
} from './generatedPaper.schema';
export {
  assignmentStatusSchema,
  createAssignmentSchema,
  regenerateSectionSchema,
  type CreateAssignmentInput,
  type RegenerateSectionInput,
} from './assignment.schema';
