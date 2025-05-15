import { Document, model, Schema, Types } from 'mongoose';
import { IUser } from '../types/user.types';

// export interface IUserModel extends Document, Omit<IUser, "_id"> { }
export interface IUserModel
  extends Document<Types.ObjectId>,
    Omit<IUser, '_id'> {}

const userSchema = new Schema<IUserModel>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
    },
    profilePicture: {
      url: { type: String },
      publicId: { type: String },
    },
    subscription : {
       planId: {type  : Schema.Types.ObjectId},
       isActive: {type : Boolean}
    }
  },
  {
    timestamps: true,
  }
);
const User = model<IUserModel>('User', userSchema);
export default User;
