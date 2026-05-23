import { User, type UserDocument } from '../../models/user.model';
import type { SyncUserInput } from '../../api/validators/schemas/user.schema';
import { assertMongoAvailable } from '../../utils/infrastructure';

export interface SyncUserResponse {
  userId: string;
}

export const syncUser = async (input: SyncUserInput): Promise<SyncUserResponse> => {
  assertMongoAvailable();

  const email = input.email.toLowerCase().trim();

  const user = await User.findOneAndUpdate(
    { email },
    {
      name: input.name,
      email,
      image: input.image ?? '',
      provider: input.provider,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return { userId: user._id.toString() };
};

export const getUserById = async (userId: string): Promise<UserDocument | null> => {
  assertMongoAvailable();
  return User.findById(userId);
};
