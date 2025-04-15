
import mongoose, { Schema, Document, Types } from 'mongoose';
import { ISessionActivity } from '../types/sessionActivity.types';

export interface ISessionActivityModel extends ISessionActivity, Document {}

const sessionActivitySchema = new Schema<ISessionActivityModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionCode: {
    type: String,
    required: true,
  },
  totalDuration :{
      type : Number,
      default : 0
  },
  logs: [
    {
      joinTime: Date,
      leaveTime: Date,
      duration: Number, 
    },
  ],
}, {
  timestamps: true,
});

export const SessionActivity = mongoose.model<ISessionActivityModel>(
  'SessionActivity',
  sessionActivitySchema
);
