import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { apiRouter } from './api/routes';
import { errorHandler } from './api/middlewares/errorHandler';
import { notFoundHandler } from './api/middlewares/notFound';

export const createApp = (): express.Application => {
  const app = express();
  console.log("api key:",process.env.GEMINI_API_KEY);
  app.use(helmet());
  const allowedOrigins = new Set([
    "https://vedaaiv1-anirudhs.vercel.app",
    'http://localhost:3000',
    'http://localhost:3001',
  ]);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', apiRouter);
  app.get('/health', (_req, res) => {
    res.redirect(307, '/api/health');
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
