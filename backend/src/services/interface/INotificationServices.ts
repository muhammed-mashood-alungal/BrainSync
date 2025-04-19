import { INotificationModel } from "../../models/notification.model"

export interface INotificationservices {
    createNotification(notificationData : Partial<INotificationModel>) : Promise<INotificationModel>
    readNotification(notificationId :unknown , userId : unknown) : Promise<void>
    readAllNotification(userId : unknown) : Promise<void>
    getUserNotifications(userId :unknown) :Promise<INotificationModel[]>
} 