export interface INotificationTypes {
    _id:string
    userId:string;
    type: "INFO" | "WARNING" | "SUCCESS" | "ERROR" | "SYSTEM"; 
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
  }