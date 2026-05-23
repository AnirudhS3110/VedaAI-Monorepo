import type { AssignmentDocument } from '../../models/assignment.model';
import type { PaperSection } from '../../types/domain.types';
import {
  ANSWER_GENERATION_RULES,
  MCQ_JSON_EXAMPLE,
  SHORT_ANSWER_JSON_EXAMPLE,
} from './answerPromptRules';
import { QUESTION_QUALITY_RULES } from './question-quality-rules';
import {
  formatSectionBlueprintForPrompt,
  SECTION_TYPE_CONTRACTS,
} from './section-type-rules';
import type { QuestionType } from '../../types/domain.types';

const formatReferenceContent = (content: string): string => {
  const trimmed = content?.trim();
  if (!trimmed) {
    return 'None provided.';
  }
  if (trimmed.length > 12000) {
    return `${trimmed.slice(0, 12000)}\n...[truncated for prompt length]`;
  }
  return trimmed;
};

const formatBlueprint = (assignment: AssignmentDocument): string => {
  const blueprint = assignment.questionBlueprint;
  if (blueprint && blueprint.length > 0) {
    return formatSectionBlueprintForPrompt(blueprint);
  }
  return assignment.questionTypes
    .map((type, index) => {
      const letter = String.fromCharCode(65 + index);
      return `- Section ${letter}: type "${type}" only`;
    })
    .join('\n');
};

export const buildAssessmentPrompt = (assignment: AssignmentDocument): string => {
  const questionTypesList = assignment.questionTypes.join(', ');
  const dueDate = assignment.dueDate.toISOString().split('T')[0];
  const sectionBlueprint = formatBlueprint(assignment);

  return `You are an expert assessment creator for educational institutions.

Create a complete exam paper based on the following assignment details.

ASSIGNMENT DETAILS:
- Title: ${assignment.title}
- Subject: ${assignment.subject}
- Due Date: ${dueDate}
- Number of Questions: ${assignment.numQuestions}
- Total Marks: ${assignment.totalMarks}
- Question Types to include: ${questionTypesList}
- Teacher Instructions: ${assignment.instructions || 'None'}

EXTRACTED REFERENCE MATERIAL (use as context — paraphrase into exam questions, do not quote headings):
${formatReferenceContent(assignment.uploadedContent)}

REQUIREMENTS:
1. Create one section per question type listed below — do not combine types in one section.
2. Distribute ${assignment.totalMarks} marks across all questions (integer marks only).
3. Include a mix of difficulty levels: easy, medium, hard.
4. Use only these question types: ${questionTypesList}.
5. Generate exactly ${assignment.numQuestions} questions total (match per-section counts when specified).
6. Each section must have a clear instruction for students naming the format.
7. Follow the teacher instructions when provided.
8. Base questions on reference topics, but write them as original exam items.

${sectionBlueprint}

${SECTION_TYPE_CONTRACTS}

${QUESTION_QUALITY_RULES}

${ANSWER_GENERATION_RULES}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        ${MCQ_JSON_EXAMPLE},
        ${SHORT_ANSWER_JSON_EXAMPLE}
      ]
    }
  ]
}

Allowed difficulty values: easy, medium, hard
Allowed type values: mcq, short, long, true_false, fill_blank

Return ONLY valid JSON.`;
};

export const buildRegenerateSectionPrompt = (
  assignment: AssignmentDocument,
  sectionTitle: string,
  existingSections: PaperSection[],
  expectedType?: QuestionType,
): string => {
  const questionTypesList = assignment.questionTypes.join(', ');
  const typeConstraint = expectedType
    ? `ALL questions in this section MUST have type "${expectedType}" only.`
    : `Use a single question type consistent with the section title.`;

  const otherSections = existingSections
    .filter((s) => s.title.toLowerCase() !== sectionTitle.toLowerCase())
    .map((s) => `- ${s.title} (${s.questions.length} questions)`)
    .join('\n');

  return `You are an expert assessment creator. Regenerate ONLY one section of an existing exam paper.

ASSIGNMENT CONTEXT:
- Title: ${assignment.title}
- Subject: ${assignment.subject}
- Total Marks (entire paper): ${assignment.totalMarks}
- Question Types: ${questionTypesList}
- Teacher Instructions: ${assignment.instructions || 'None'}
- Extracted Reference Material: ${formatReferenceContent(assignment.uploadedContent)}

SECTION TO REGENERATE: "${sectionTitle}"

OTHER EXISTING SECTIONS (do not duplicate their content):
${otherSections || 'None'}

REQUIREMENTS:
1. Regenerate ONLY the section titled "${sectionTitle}".
2. Include a clear instruction for students.
3. Use appropriate difficulty mix: easy, medium, hard.
4. ${typeConstraint}
5. Generate the same number of questions as the original section when possible.
6. Distribute integer marks only.
7. Do NOT mix question types within this section.

${SECTION_TYPE_CONTRACTS}

${QUESTION_QUALITY_RULES}

${ANSWER_GENERATION_RULES}

Return ONLY valid JSON for a single section (no markdown, no explanation):
{
  "title": "${sectionTitle}",
  "instruction": "Section instruction here",
  "questions": [
    ${MCQ_JSON_EXAMPLE}
  ]
}

Allowed difficulty values: easy, medium, hard
Allowed type values: mcq, short, long, true_false, fill_blank

Return ONLY valid JSON.`;
};
