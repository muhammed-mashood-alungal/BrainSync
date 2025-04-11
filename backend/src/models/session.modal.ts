import mongoose, { Document, Mongoose, Schema, Types } from 'mongoose';
import { ISessionTypes } from '../types/session.types';

export interface ISessionModal extends Document, ISessionTypes {}

const sessionSchema = new Schema<ISessionModal>(
  {
    sessionName: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    sessionLink: {
      type: String,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    code: {
      type: String,
      unique: true,
    },
    isStopped: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
const Session = mongoose.model<ISessionModal>('Session', sessionSchema);
export default Session;
