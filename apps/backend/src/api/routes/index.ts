import { Router } from 'express';
import { assignmentRouter } from './assignment.routes';
import { healthRouter } from './health.routes';
import { userRouter } from './user.routes';

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/assignments', assignmentRouter);

export { apiRouter };
