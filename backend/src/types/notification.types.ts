import { Types } from "mongoose";

export interface INotificationTypes {
    userId:Types.ObjectId;
    type: "INFO" | "WARNING" | "SUCCESS" | "ERROR" | "SYSTEM"; 
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
  }