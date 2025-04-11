import mongoose, { Document, Schema, Types } from 'mongoose';
import { IGroupTypes } from '../types/group.types';

export interface IGroupModel extends Document, IGroupTypes {}

const groupSchema = new Schema<IGroupModel>(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const Group = mongoose.model<IGroupModel>('Group', groupSchema);
export default Group;
