import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';
import type { AssignmentDocument } from '../../models/assignment.model';
import { logger } from '../../utils/logger';
import { AiGenerationError } from './errors';
import { parseGeneratedPaperResponse } from './parser';
import { buildAssessmentPrompt, buildRegenerateSectionPrompt } from './promptBuilder';
import { parseRegeneratedSectionResponse } from './parser';
import type { GeneratedPaperOutput } from './schema';
import type { PaperSection } from '../../types/domain.types';

let genAiClient: GoogleGenerativeAI | null = null;

const getGenAiClient = (): GoogleGenerativeAI => {
  if (!env.GEMINI_API_KEY) {
    throw new AiGenerationError(
      'GEMINI_API_KEY is not configured. Set it in your environment.',
    );
  }

  if (!genAiClient) {
    genAiClient = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  return genAiClient;
};

export const generateValidatedPaper = async (
  assignment: AssignmentDocument,
): Promise<GeneratedPaperOutput> => {
  const prompt = buildAssessmentPrompt(assignment);
  const rawText = await callGemini(prompt, assignment._id.toString());
  const validated = parseGeneratedPaperResponse(rawText, {
    questionBlueprint: assignment.questionBlueprint,
  });

  logger.info(
    {
      assignmentId: assignment._id.toString(),
      sectionCount: validated.sections.length,
    },
    'Gemini response validated successfully',
  );

  return validated;
};

const callGemini = async (prompt: string, assignmentId: string): Promise<string> => {
  const client = getGenAiClient();
  const model = client.getGenerativeModel({
    model: env.GEMINI_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  logger.info(
    { assignmentId, model: env.GEMINI_MODEL },
    'Calling Gemini API',
  );

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    logger.info(
                {
                  assignmentId,
                  rawText,
                },
                'Raw Gemini response',
              );

    if (!rawText.trim()) {
      throw new AiGenerationError('Gemini returned an empty response');
    }

    return rawText;
  } catch (error) {
    if (error instanceof AiGenerationError) {
      throw error;
    }
    logger.error({ err: error }, 'Gemini API request failed');
    throw new AiGenerationError('Gemini API request failed', error);
  }
};

export const generateValidatedSection = async (
  assignment: AssignmentDocument,
  sectionTitle: string,
  existingSections: PaperSection[],
  expectedType?: PaperSection['questions'][number]['type'],
): Promise<PaperSection> => {
  const prompt = buildRegenerateSectionPrompt(
    assignment,
    sectionTitle,
    existingSections,
    expectedType,
  );

  const rawText = await callGemini(prompt, assignment._id.toString());
  const validated = parseRegeneratedSectionResponse(rawText, expectedType);

  logger.info(
    {
      assignmentId: assignment._id.toString(),
      sectionTitle: validated.title,
      questionCount: validated.questions.length,
    },
    'Regenerated section validated successfully',
  );

  return validated;
};
