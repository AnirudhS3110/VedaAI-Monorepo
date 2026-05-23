import { z } from 'zod';
import { sectionSchema } from './section.schema';

export const regeneratedSectionOutputSchema = sectionSchema;

export type RegeneratedSectionOutput = z.infer<
  typeof regeneratedSectionOutputSchema
>;
