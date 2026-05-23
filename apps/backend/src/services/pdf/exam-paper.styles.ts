/** Print-first exam paper CSS — aligned with frontend `exam-paper-*.tsx` */
export const EXAM_PAPER_PRINT_STYLES = `
  @page {
    size: A4;
    margin: 18mm 15mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: Inter, 'Segoe UI', system-ui, sans-serif;
    color: #1a1a1a;
    font-size: 11pt;
    line-height: 1.5;
    background: #fff;
  }

  .exam-paper {
    width: 100%;
    max-width: 180mm;
    margin: 0 auto;
    padding: 0;
  }

  /* —— Header —— */
  .exam-header {
    text-align: center;
  }

  .school-name {
    font-size: 13pt;
    font-weight: 700;
    line-height: 1.35;
    letter-spacing: 0.01em;
  }

  .exam-meta-line {
    margin-top: 0.45rem;
    font-size: 11pt;
    line-height: 1.45;
  }

  .exam-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 1.35rem;
    font-size: 10pt;
    line-height: 1.4;
  }

  .compulsory-note {
    margin-top: 0.85rem;
    font-size: 10pt;
    line-height: 1.45;
  }

  /* —— Student info —— */
  .student-fields {
    margin-top: 1.35rem;
  }

  .student-field {
    margin-bottom: 0.55rem;
    font-size: 10pt;
    line-height: 1.5;
  }

  .student-field-line {
    display: inline-block;
    border-bottom: 1px solid rgba(26, 26, 26, 0.4);
    vertical-align: baseline;
    min-height: 1.1em;
  }

  .student-field-line--name { min-width: 52mm; }
  .student-field-line--roll { min-width: 42mm; }
  .student-field-line--section { min-width: 32mm; }

  /* —— Sections —— */
  .paper-section {
    margin-top: 2rem;
    page-break-inside: avoid;
  }

  .section-title {
    text-align: center;
    font-size: 12pt;
    font-weight: 700;
    line-height: 1.35;
    page-break-after: avoid;
  }

  .section-type-heading {
    margin-top: 1.1rem;
    font-size: 11pt;
    font-weight: 700;
    line-height: 1.35;
    page-break-after: avoid;
  }

  .section-instruction {
    margin-top: 0.25rem;
    font-size: 10pt;
    font-style: italic;
    color: rgba(26, 26, 26, 0.8);
    line-height: 1.45;
    page-break-after: avoid;
  }

  .questions-list {
    list-style: none;
    margin-top: 1rem;
    padding: 0;
  }

  .question-item {
    margin-bottom: 0.95rem;
    font-size: 11.25pt;
    line-height: 1.625;
    page-break-inside: avoid;
  }

  .question-item:last-child {
    margin-bottom: 0;
  }

  .question-stem {
    display: inline;
  }

  .mcq-options {
    list-style: none;
    margin: 0.45rem 0 0 1.35rem;
    padding: 0;
  }

  .mcq-option {
    margin-bottom: 0.35rem;
    font-size: 11pt;
    line-height: 1.5;
  }

  .mcq-label {
    font-weight: 600;
    margin-right: 0.25em;
  }

  .question-number {
    font-weight: 600;
  }

  .difficulty-label {
    font-weight: 600;
    margin-right: 0.15em;
  }

  .difficulty-easy { color: #047857; }
  .difficulty-medium { color: #b45309; }
  .difficulty-hard { color: #b91c1c; }

  .question-marks {
    font-weight: 600;
    color: rgba(26, 26, 26, 0.8);
    margin-left: 0.2em;
  }

  /* —— End marker & answer key —— */
  .end-marker {
    margin-top: 2.25rem;
    font-size: 11pt;
    font-weight: 700;
    page-break-before: auto;
  }

  .answer-key {
    margin-top: 2.25rem;
    padding-top: 1.75rem;
    border-top: 1px solid rgba(26, 26, 26, 0.15);
    page-break-inside: avoid;
  }

  .answer-key-title {
    font-size: 12pt;
    font-weight: 700;
    line-height: 1.35;
  }

  .answer-key-list {
    margin-top: 1rem;
    padding-left: 1.35rem;
    list-style: decimal;
  }

  .answer-key-item {
    margin-bottom: 0.85rem;
    font-size: 11.25pt;
    line-height: 1.625;
    page-break-inside: avoid;
  }

  .answer-key-item:last-child {
    margin-bottom: 0;
  }

  .exam-footer {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 8.5pt;
    color: rgba(26, 26, 26, 0.55);
    line-height: 1.4;
  }

  h1, h2, h3 {
    font-weight: 700;
  }
`;
