import mongoose, { Document, Schema, Types } from 'mongoose';
import { INotificationTypes } from '../types/notification.types';

export interface INotificationModel extends Document, INotificationTypes {}

const notificationSchema = new Schema<INotificationModel>(
  {
     userId : {
        type : Schema.Types.ObjectId,
        ref :"User"
     },
     type : {
        type : String ,
        enum : ["INFO","WARNING" , "SUCCESS" , "ERROR" ]
     },
     title :{
        type : String
     },
     message : {
        type : String
     },
     isRead : {
        type : Boolean,
        default:false
     },
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model<INotificationModel>('Notification', notificationSchema);
export default Notification;
