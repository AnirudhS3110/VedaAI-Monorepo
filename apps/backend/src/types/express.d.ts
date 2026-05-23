import type { UserDocument } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
      user?: UserDocument;
    }
  }
}

export {};
