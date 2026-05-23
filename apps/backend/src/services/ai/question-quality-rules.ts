/** Instructions for academically sound question wording */
export const QUESTION_QUALITY_RULES = `
QUESTION QUALITY (CRITICAL):
- Write natural, exam-ready questions in clear academic English.
- Test understanding of concepts — do NOT copy source headings, labels, or slide titles verbatim.
- NEVER include phrases like "Prompt 1", "Prompt 2", "Section A title", or "provide to the user" in question text.
- Transform source material into proper assessment items.

BAD → GOOD examples:
- BAD: "What does Prompt 1: Resume Analysis provide to the user?"
  GOOD: "What information helps applicants identify missing keywords on a resume?"
- BAD: "What role should AI act as for Prompt 1?"
  GOOD: "How does AI assist in evaluating resume–job description alignment?"
- BAD: "Prompt 2: ATS Scanner — what is required?"
  GOOD: "Which resume elements most strongly influence ATS screening outcomes?"

MCQ rules:
- The question stem must stand alone (students see options A–D below it).
- Options must be plausible, distinct, and parallel in style.
- Do not embed "A)" / "B)" inside option strings — the UI labels options automatically.

SECTION DISCIPLINE:
- One question type per section — never mix formats within a section.
- Match section titles to the question type inside (MCQ section contains only mcq, etc.).
`.trim();
