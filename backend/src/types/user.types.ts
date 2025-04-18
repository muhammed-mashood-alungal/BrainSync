import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  googleId: string;
  role: 'student' | 'admin';
  isAcitve: Boolean;
  profilePicture?: {
    url: string;
    publicId: string;
  };
  subscription : {
    planId : Types.ObjectId,
    isActive : boolean
  }
  createdAt: Date;
  updatedAt: Date;
}
