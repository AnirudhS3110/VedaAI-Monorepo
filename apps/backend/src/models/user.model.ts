import { Schema, model, type HydratedDocument, type Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  image: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      required: true,
      default: 'google',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ email: 1 }, { unique: true });

export const User: Model<IUser> = model<IUser>('User', userSchema);
