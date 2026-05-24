import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { env } from '../../config/env';
import type { AssignmentDocument } from '../../models/assignment.model';
import type { GeneratedPaperDocument } from '../../models/generatedPaper.model';
import { logger } from '../../utils/logger';
import { buildExamPaperHtml } from './pdfHtmlBuilder';

export const getPdfOutputPath = (assignmentId: string): string =>
  path.join(env.PDF_OUTPUT_DIR, `${assignmentId}.pdf`);

export const ensurePdfOutputDir = async (): Promise<void> => {
  await mkdir(env.PDF_OUTPUT_DIR, { recursive: true });
};

export const generateExamPaperPdf = async (
  assignment: AssignmentDocument,
  paper: GeneratedPaperDocument,
): Promise<string> => {
  await ensurePdfOutputDir();

  const assignmentId = assignment._id.toString();
  const outputPath = getPdfOutputPath(assignmentId);
  const html = buildExamPaperHtml(assignment, paper);

  logger.info({ assignmentId, outputPath }, 'Generating exam paper PDF');

   const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '14mm',
        bottom: '14mm',
        left: '15mm',
        right: '15mm',
      },
    });
  } finally {
    await browser.close();
  }

  logger.info({ assignmentId, outputPath }, 'Exam paper PDF generated');

  return outputPath;
};
