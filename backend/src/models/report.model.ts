import mongoose, { Schema } from 'mongoose';
import { IReportTypes } from '../types/reports.types';
import { Document } from 'mongoose';

export interface IReportModel extends Document, IReportTypes {}
const reportSchema = new Schema<IReportModel>(
  {
    sessionId: {
      type: Schema.ObjectId,
      ref: 'Session',
    },
    reportedBy: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Resolved', 'Pending', 'Closed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReportModel>('Report', reportSchema);
