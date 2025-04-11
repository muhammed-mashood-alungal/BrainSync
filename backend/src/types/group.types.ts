import { Types } from 'mongoose';
import { IUser } from './user.types';

export interface IGroupTypes {
  name: string;
  createdBy: Types.ObjectId;
  members: Types.ObjectId[] | IUser[] | string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
