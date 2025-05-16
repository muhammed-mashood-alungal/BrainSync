import { Types } from 'mongoose';
import { IMappedUser, IUser } from './user.types';

export interface IGroupTypes {
  name: string;
  createdBy: Types.ObjectId | IUser;
  members: Types.ObjectId[] | IUser[] | string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IMappedGroupTypes {
  name: string;
  createdBy: Types.ObjectId | IMappedUser;
  members: Types.ObjectId[] | IMappedUser[];
  isActive: boolean;
  createdAt?: Date;
}