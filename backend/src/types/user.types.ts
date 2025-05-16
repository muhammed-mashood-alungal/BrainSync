import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  googleId: string;
  role: 'student' | 'admin';
  isActive: Boolean;
  profilePicture?: {
    url: string;
    publicId: string;
  };
  subscription: {
    planId: Types.ObjectId;
    isActive: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMappedUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  isActive: boolean;
  role: string;
  createdAt: Date;
  googleId?: string;
  profilePicture?:string;
  subscription: {
    planId: Types.ObjectId;
    isActive: boolean;
  };      
}

export interface IMappedSessionUserData {
  id: Types.ObjectId;
  email: string;
  role: string;
  isPremiumMember: boolean;
  profilePicture?: string;
}

