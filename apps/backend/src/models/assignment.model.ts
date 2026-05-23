import { Schema, Types, model, type HydratedDocument, type Model } from 'mongoose';
import {
  ASSIGNMENT_STATUSES,
  QUESTION_TYPES,
  type AssignmentStatus,
  type QuestionType,
} from '../types/domain.types';

export interface QuestionBlueprintItem {
  type: QuestionType;
  numQuestions: number;
  marksPerQuestion: number;
}

export interface IAssignment {
  userId?: Types.ObjectId;
  title: string;
  schoolName: string;
  className: string;
  subject: string;
  dueDate: Date;
  questionTypes: QuestionType[];
  questionBlueprint?: QuestionBlueprintItem[];
  numQuestions: number;
  totalMarks: number;
  instructions: string;
  uploadedContent: string;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type AssignmentDocument = HydratedDocument<IAssignment>;

const assignmentSchema = new Schema<IAssignment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    schoolName: {
      type: String,
      default: 'Delhi Public School',
      trim: true,
    },
    className: {
      type: String,
      default: '5th',
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    questionTypes: {
      type: [String],
      enum: QUESTION_TYPES,
      required: true,
      validate: {
        validator: (value: QuestionType[]) => value.length > 0,
        message: 'At least one question type is required',
      },
    },
    questionBlueprint: {
      type: [
        {
          type: { type: String, enum: QUESTION_TYPES, required: true },
          numQuestions: { type: Number, required: true, min: 1 },
          marksPerQuestion: { type: Number, required: true, min: 1 },
        },
      ],
      default: undefined,
    },
    numQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    instructions: {
      type: String,
      default: '',
      trim: true,
    },
    uploadedContent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ASSIGNMENT_STATUSES,
      default: 'pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

assignmentSchema.index({ status: 1, createdAt: -1 });
assignmentSchema.index({ userId: 1, createdAt: -1 });

export const Assignment: Model<IAssignment> = model<IAssignment>(
  'Assignment',
  assignmentSchema,
);
