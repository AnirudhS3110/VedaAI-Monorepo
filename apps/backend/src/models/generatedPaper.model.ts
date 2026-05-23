import { Schema, Types, model, type HydratedDocument, type Model } from 'mongoose';
import {
  QUESTION_DIFFICULTIES,
  QUESTION_TYPES,
  type PaperSection,
  type Question,
} from '../types/domain.types';

export interface IGeneratedPaper {
  assignmentId: Types.ObjectId;
  sections: PaperSection[];
  createdAt: Date;
  updatedAt: Date;
}

export type GeneratedPaperDocument = HydratedDocument<IGeneratedPaper>;

const questionSchema = new Schema<Question>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: QUESTION_DIFFICULTIES,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: QUESTION_TYPES,
      required: true,
    },
    answer: {
      type: String,
      trim: true,
      default: '',
    },
    options: {
      type: [String],
      default: undefined,
    },
    correctAnswer: {
      type: String,
      trim: true,
      default: undefined,
    },
  },
  { _id: false },
);

const sectionSchema = new Schema<PaperSection>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instruction: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (value: Question[]) => value.length > 0,
        message: 'Each section must contain at least one question',
      },
    },
  },
  { _id: false },
);

const generatedPaperSchema = new Schema<IGeneratedPaper>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      unique: true,
    },
    sections: {
      type: [sectionSchema],
      required: true,
      validate: {
        validator: (value: PaperSection[]) => value.length > 0,
        message: 'Generated paper must contain at least one section',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

generatedPaperSchema.index({ assignmentId: 1 });

export const GeneratedPaper: Model<IGeneratedPaper> = model<IGeneratedPaper>(
  'GeneratedPaper',
  generatedPaperSchema,
);
