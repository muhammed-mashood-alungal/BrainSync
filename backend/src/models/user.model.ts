import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "../types/user.types";


// export interface IUserModel extends Document, Omit<IUser, "_id"> { }
export interface IUserModel extends Document<Types.ObjectId>, Omit<IUser, "_id"> {}

const userSchema = new Schema<IUserModel>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    isAcitve: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['student', "admin"]
    },
    profilePicture: {
        type: String
    }

}, {
    timestamps: true
})
const User = model<IUserModel>('User' , userSchema)
export default User