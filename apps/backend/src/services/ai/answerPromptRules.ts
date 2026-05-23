/** Shared Gemini instructions for co-generated question + answer pairs */
export const ANSWER_GENERATION_RULES = `
ANSWER REQUIREMENTS:
- Co-generate precise model answers suitable for a teacher answer key.
- NEVER use placeholders or meta-instructions ("student should explain", "identify the correct option", etc.).

MCQ questions (type: "mcq"):
- MUST include "options" (array of exactly 4 distinct answer choices as plain text, without letters).
- MUST include "correctAnswer" (exact string matching one item in "options").
- Do NOT use an "answer" field for MCQ — only options + correctAnswer.

true_false:
- Include "answer" with "True" or "False" plus a brief factual justification (1–2 sentences).

fill_blank:
- Include "answer" with the exact word(s) or phrase(s) that complete the blank.

short:
- Include "answer" with a complete 2–5 sentence model answer.

long:
- Include "answer" with a structured paragraph model answer.

Marks must be positive integers only (1, 2, 3, …). Do not use decimals.
`.trim();

export const MCQ_JSON_EXAMPLE = `{
          "text": "Which process converts light energy into chemical energy in plants?",
          "difficulty": "easy",
          "marks": 2,
          "type": "mcq",
          "options": ["Respiration", "Photosynthesis", "Digestion", "Transpiration"],
          "correctAnswer": "Photosynthesis"
        }`;

export const SHORT_ANSWER_JSON_EXAMPLE = `{
          "text": "Explain how chlorophyll supports energy conversion in plants.",
          "difficulty": "medium",
          "marks": 4,
          "type": "short",
          "answer": "Chlorophyll absorbs light energy in chloroplasts and drives photosynthesis, converting carbon dioxide and water into glucose while releasing oxygen."
        }`;
