import { Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role: 'student' | 'admin';
    isAcitve: Boolean;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
} 