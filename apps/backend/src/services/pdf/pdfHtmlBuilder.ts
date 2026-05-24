import type { AssignmentDocument } from '../../models/assignment.model';
import type { GeneratedPaperDocument } from '../../models/generatedPaper.model';
import type { PaperSection } from '../../types/domain.types';
import { DIFFICULTY_LABELS, EXAM_PAPER_ORGANIZATION } from './exam-paper.constants';
import {
  escapeHtml,
  estimateTimeAllowedMinutes,
  flattenQuestions,
  formatDueDateDisplay,
  buildMcqOptionsHtml,
  getQuestionAnswer,
  sectionTypeHeading,
} from './exam-paper.helpers';
import { EXAM_PAPER_PRINT_STYLES } from './exam-paper.styles';

const buildSectionsHtml = (
  sections: PaperSection[],
  numberByKey: Map<string, number>,
): string =>
  sections
    .map((section) => {
      const questionsHtml = section.questions
        .map((question) => {
          const number =
            numberByKey.get(`${section.title}-${question.text}`) ?? 0;
          const diffClass = `difficulty-${question.difficulty}`;
          const mcqOptions = buildMcqOptionsHtml(question);
          return `
          <li class="question-item">
            <div class="question-stem">
              <span class="question-number">${number}. </span>
              <span class="difficulty-label ${diffClass}">[${escapeHtml(DIFFICULTY_LABELS[question.difficulty])}]</span>
              <span class="question-text">${escapeHtml(question.text)}</span>
              <span class="question-marks">[${question.marks} Marks]</span>
            </div>
            ${mcqOptions}
          </li>`;
        })
        .join('');

      return `
      <section class="paper-section">
        <div class="section-intro">
          <h2 class="section-title">${escapeHtml(section.title)}</h2>
          <h3 class="section-type-heading">${escapeHtml(sectionTypeHeading(section.questions))}</h3>
          <p class="section-instruction">${escapeHtml(section.instruction)}</p>
        </div>
        <ol class="questions-list">
          ${questionsHtml}
        </ol>
      </section>`;
    })
    .join('');

export const buildExamPaperHtml = (
  assignment: AssignmentDocument,
  paper: GeneratedPaperDocument,
): string => {
  const flat = flattenQuestions(paper.sections);
  const numberByKey = new Map(
    flat.map(({ section, question, number }) => [
      `${section.title}-${question.text}`,
      number,
    ]),
  );

  const timeMinutes = estimateTimeAllowedMinutes(assignment.totalMarks);
  const dueDisplay = formatDueDateDisplay(assignment.dueDate);
  const schoolName =
    assignment.schoolName?.trim() || EXAM_PAPER_ORGANIZATION.defaultSchoolName;
  const className =
    assignment.className?.trim() || EXAM_PAPER_ORGANIZATION.defaultClassName;

  const sectionsHtml = buildSectionsHtml(paper.sections, numberByKey);

  const answerKeyHtml = flat
    .map(
      ({ question, number }) => `
        <li class="answer-key-item" value="${number}">
          ${escapeHtml(getQuestionAnswer(question))}
        </li>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(assignment.title)} — Exam Paper</title>
  <style>${EXAM_PAPER_PRINT_STYLES}</style>
</head>
<body>
  <article class="exam-paper">
    <header class="exam-header">
      <h1 class="school-name">${escapeHtml(schoolName)}</h1>
      <div class="exam-meta-grid">
        <p>
          <span class="field-label">Subject:</span>
          <span class="field-value"> ${escapeHtml(assignment.subject)}</span>
        </p>
        <p>
          <span class="field-label">Class:</span>
          <span class="field-value"> ${escapeHtml(className)}</span>
        </p>
      </div>
    </header>

    <div class="exam-meta-row">
      <span>
        <span class="field-label">Time Allowed:</span>
        <span class="field-value"> ${timeMinutes} minutes</span>
      </span>
      <span>
        <span class="field-label">Maximum Marks:</span>
        <span class="field-value"> ${assignment.totalMarks}</span>
      </span>
    </div>

    <p class="compulsory-note">
      All questions are compulsory unless stated otherwise.
    </p>

    <div class="student-fields">
      <div class="student-row">
        <span class="student-cell">
          <span class="field-label">Name:</span>
          <span class="student-field-line student-field-line--name"></span>
        </span>
        <span class="student-cell">
          <span class="field-label">Roll No:</span>
          <span class="student-field-line student-field-line--roll"></span>
        </span>
      </div>
      <div class="student-row">
        <span class="student-cell">
          <span class="field-label">Class:</span>
          <span class="field-value">${escapeHtml(className)}</span>
        </span>
        <span class="student-cell">
          <span class="field-label">Section:</span>
          <span class="student-field-line student-field-line--section"></span>
        </span>
      </div>
    </div>

    ${sectionsHtml}

    <p class="end-marker">End of Question Paper</p>

    <section class="answer-key">
      <h2 class="answer-key-title">Answer Key:</h2>
      <ol class="answer-key-list">
        ${answerKeyHtml}
      </ol>
    </section>

    <p class="exam-footer">
      Due: ${escapeHtml(dueDisplay)} · Generated by VedaAI
    </p>
  </article>
</body>
</html>`;
};
