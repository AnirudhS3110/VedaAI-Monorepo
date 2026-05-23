import { z } from 'zod';
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.ENABLE_MONGODB);
console.log(process.env.ENABLE_REDIS);

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z
    .string()
    .min(1)
    .default('mongodb://127.0.0.1:27017/vedaai'),
  REDIS_URL: z.string().min(1).default('redis://127.0.0.1:6379'),
  ENABLE_MONGODB: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  ENABLE_REDIS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-1.5-flash'),
  PDF_OUTPUT_DIR: z.string().default('./storage/pdfs'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  AUTH_SYNC_SECRET: z.string().min(16).optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    console.error('Invalid environment variables:', fieldErrors);
    process.exit(1);
  }

  return result.data;
}

export const env = parseEnv();
