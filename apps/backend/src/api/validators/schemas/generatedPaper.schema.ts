import { z } from 'zod';
import { sectionSchema } from './section.schema';

export const generatedPaperOutputSchema = z.object({
  sections: z
    .array(sectionSchema)
    .min(1, 'Generated paper must contain at least one section'),
});

export type GeneratedPaperOutput = z.infer<typeof generatedPaperOutputSchema>;
