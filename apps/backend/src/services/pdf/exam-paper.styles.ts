/** Print-first exam paper CSS — aligned with frontend `exam-paper-*.tsx` */
export const EXAM_PAPER_PRINT_STYLES = `
  @page {
    size: A4;
    margin: 14mm 15mm;
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
    line-height: 1.45;
    background: #fff;
  }

  .exam-paper {
    width: 100%;
    max-width: 180mm;
    margin: 0 auto;
    padding: 0;
  }

  .field-label {
    font-weight: 700;
  }

  .field-value {
    font-weight: 400;
  }

  /* —— Header —— */
  .exam-header {
    text-align: center;
  }

  .school-name {
    font-size: 12.5pt;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: 0.01em;
  }

  .exam-meta-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.35rem 1.75rem;
    margin-top: 0.35rem;
    font-size: 10.5pt;
    line-height: 1.35;
  }

  .exam-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    margin-top: 0.5rem;
    font-size: 10pt;
    line-height: 1.35;
  }

  .compulsory-note {
    margin-top: 0.4rem;
    font-size: 9.5pt;
    line-height: 1.35;
    text-align: center;
    color: rgba(26, 26, 26, 0.85);
  }

  /* —— Student info (compact grid) —— */
  .student-fields {
    margin-top: 0.55rem;
    padding-top: 0.45rem;
    border-top: 1px solid rgba(26, 26, 26, 0.12);
  }

  .student-row {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.35rem 1.25rem;
    margin-bottom: 0.35rem;
    font-size: 10pt;
    line-height: 1.4;
  }

  .student-row:last-child {
    margin-bottom: 0;
  }

  .student-cell {
    display: flex;
    flex: 1 1 45%;
    align-items: baseline;
    gap: 0.25rem;
    min-width: 0;
  }

  .student-field-line {
    display: inline-block;
    flex: 1;
    border-bottom: 1px solid rgba(26, 26, 26, 0.4);
    vertical-align: baseline;
    min-height: 1em;
    min-width: 28mm;
  }

  .student-field-line--name { min-width: 38mm; }
  .student-field-line--roll { min-width: 32mm; }
  .student-field-line--section { min-width: 24mm; }

  /* —— Sections —— */
  .paper-section {
    margin-top: 1.1rem;
    break-inside: auto;
    page-break-inside: auto;
  }

  .paper-section:first-of-type {
    margin-top: 0.65rem;
    break-before: auto;
    page-break-before: auto;
  }

  .section-intro {
    break-inside: avoid;
    page-break-inside: avoid;
    break-after: avoid;
    page-break-after: avoid;
  }

  .section-title {
    text-align: center;
    font-size: 11.5pt;
    font-weight: 700;
    line-height: 1.3;
  }

  .section-type-heading {
    margin-top: 0.45rem;
    font-size: 10.5pt;
    font-weight: 700;
    line-height: 1.3;
  }

  .section-instruction {
    margin-top: 0.15rem;
    font-size: 9.5pt;
    font-style: italic;
    color: rgba(26, 26, 26, 0.8);
    line-height: 1.35;
  }

  .questions-list {
    list-style: none;
    margin-top: 0.55rem;
    padding: 0;
  }

  .question-item {
    margin-bottom: 0.75rem;
    font-size: 11pt;
    line-height: 1.55;
    break-inside: avoid;
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
    margin: 0.35rem 0 0 1.25rem;
    padding: 0;
  }

  .mcq-option {
    margin-bottom: 0.25rem;
    font-size: 10.5pt;
    line-height: 1.4;
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
    margin-top: 1.5rem;
    font-size: 11pt;
    font-weight: 700;
    break-before: auto;
    page-break-before: auto;
  }

  .answer-key {
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(26, 26, 26, 0.15);
    break-before: page;
    page-break-before: always;
  }

  .answer-key-title {
    font-size: 12pt;
    font-weight: 700;
    line-height: 1.35;
    break-after: avoid;
    page-break-after: avoid;
  }

  .answer-key-list {
    margin-top: 0.65rem;
    padding-left: 1.25rem;
    list-style: decimal;
  }

  .answer-key-item {
    margin-bottom: 0.65rem;
    font-size: 11pt;
    line-height: 1.55;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .answer-key-item:last-child {
    margin-bottom: 0;
  }

  .exam-footer {
    margin-top: 1.25rem;
    text-align: center;
    font-size: 8.5pt;
    color: rgba(26, 26, 26, 0.55);
    line-height: 1.35;
  }

  h1, h2, h3 {
    font-weight: 700;
  }
`;
