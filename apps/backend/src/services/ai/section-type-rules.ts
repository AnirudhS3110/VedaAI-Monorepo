import type { QuestionBlueprintItem } from '../../api/validators/schemas/question-semantics.validation';

const TYPE_LABELS: Record<string, string> = {
  mcq: 'Multiple Choice (MCQ)',
  true_false: 'True / False',
  fill_blank: 'Fill in the Blanks',
  short: 'Short Answer',
  long: 'Long Answer',
};

export const SECTION_TYPE_CONTRACTS = `
SECTION STRUCTURE (CRITICAL):
- Create exactly ONE section per requested question type, in the order listed below.
- Every question in a section MUST use the same "type" value as that section.
- NEVER mix MCQ, True/False, fill-in-the-blank, short, or long questions in the same section.
- Section titles and instructions must clearly name the question format (e.g. "Section A — Multiple Choice").

Per-type rules:

MCQ (type: "mcq"):
- ONLY multiple-choice stems with exactly 4 options + correctAnswer.
- NEVER blanks, True/False statements, or "explain in detail" prompts.
- BAD: "The process of _____ is called photosynthesis." (fill blank)
- GOOD: "Which process converts light energy into chemical energy in plants?"

True/False (type: "true_false"):
- Concise declarative statements students mark True or False.
- NO options array. NO blanks.
- BAD: "Explain how vaccines work." (short answer)
- GOOD: "Vaccines stimulate the immune system to produce antibodies against specific pathogens."

Fill in the blanks (type: "fill_blank"):
- Completion sentences with ___ or _____ placeholders.
- NO options array.
- BAD: "Which organelle produces ATP?" (MCQ/short style)
- GOOD: "The powerhouse of the cell is the _____."

Short answer (type: "short"):
- Conceptual questions answerable in 2–5 sentences.
- NO options. NO blanks.
- BAD: "Photosynthesis occurs in chloroplasts." (statement without a question)
- GOOD: "Explain the role of chlorophyll in photosynthesis."

Long answer (type: "long"):
- Analytical questions requiring detailed paragraph responses.
- NO options. NO blanks.
- GOOD: "Discuss the impact of deforestation on the carbon cycle and biodiversity."
`.trim();

export const formatSectionBlueprintForPrompt = (
  blueprint: QuestionBlueprintItem[],
): string => {
  if (blueprint.length === 0) {
    return '';
  }

  const lines = blueprint.map((item, index) => {
    const letter = String.fromCharCode(65 + index);
    const label = TYPE_LABELS[item.type] ?? item.type;
    const sectionMarks = item.numQuestions * item.marksPerQuestion;
    return `- Section ${letter} — ${label}: exactly ${item.numQuestions} questions, ${item.marksPerQuestion} marks each (${sectionMarks} marks subtotal), type "${item.type}" only`;
  });

  return `
SECTION BLUEPRINT (follow exactly — one section per line):
${lines.join('\n')}
`.trim();
};
