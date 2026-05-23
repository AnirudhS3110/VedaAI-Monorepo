import { z } from 'zod';

export const syncUserSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(200),
  image: z.string().optional().default(''),
  provider: z.string().trim().min(1).default('google'),
});

export type SyncUserInput = z.infer<typeof syncUserSchema>;
