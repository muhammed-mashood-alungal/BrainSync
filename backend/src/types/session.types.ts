import { Types } from 'mongoose';
import { IGroupTypes } from './group.types';
import { IUserModel } from '../models/user.model';

export interface ISessionTypes {
  sessionName: string;
  subject: string;
  date: string | Date;
  startTime: Date;
  endTime: Date;
  sessionLink: string;
  status: string;
  groupId: Types.ObjectId | IGroupTypes;
  createdBy: Types.ObjectId | IUserModel;
  code: string;
  isStopped: boolean;
  createdAt : Date
}
