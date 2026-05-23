import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireSyncSecret } from '../middlewares/requireSyncSecret';
import { syncUserHandler } from '../controllers/user.controller';
import { validateBody } from '../middlewares/validate';
import { syncUserSchema } from '../validators/schemas/user.schema';

const userRouter = Router();

userRouter.post(
  '/sync',
  requireSyncSecret,
  validateBody(syncUserSchema),
  asyncHandler(syncUserHandler),
);

export { userRouter };
