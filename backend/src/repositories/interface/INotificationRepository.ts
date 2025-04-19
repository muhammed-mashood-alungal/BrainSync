import { Types } from "mongoose";
import { INotificationModel } from "../../models/notification.model";

export interface INotificationRepository {
    createNotification(notificationData : Partial<INotificationModel>) : Promise<INotificationModel>
    readNotification(notificationId : Types.ObjectId , userId : Types.ObjectId) : Promise<void>
    readAllNotification(userId : Types.ObjectId) : Promise<void>
    getUserNotifications(userId :Types.ObjectId) :Promise<INotificationModel[]>
}