import type { Request, Response } from 'express';
import { syncUser } from '../../services/user/user.service';
import type { ApiSuccessResponse } from '../../types/api.types';
import type { SyncUserInput } from '../validators/schemas/user.schema';
import { getValidatedBody } from '../../utils/validation';

export const syncUserHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const body = getValidatedBody<SyncUserInput>(req);
  const result = await syncUser(body);

  const response: ApiSuccessResponse<typeof result> = {
    success: true,
    data: result,
  };

  res.status(200).json(response);
};
