import { Types } from "mongoose";
import { INotificationModel } from "../../models/notification.model";
import { INotificationRepository } from "../../repositories/interface/INotificationRepository";
import { INotificationservices } from "../interface/INotificationServices";

export class NotificationServices implements INotificationservices{
    constructor(private _notificatinoRepo : INotificationRepository) {}

    async createNotification(notificationData: Partial<INotificationModel>): Promise<INotificationModel> {
        return await this._notificatinoRepo.createNotification(notificationData)
    }
    async readAllNotification(userId: unknown): Promise<void> {
        return await this._notificatinoRepo.readAllNotification(userId as Types.ObjectId)
    }
    async readNotification(notificationId: unknown, userId: unknown): Promise<void> {
        return await this._notificatinoRepo.readNotification(notificationId as Types.ObjectId , userId as Types.ObjectId)
    }
    async getUserNotifications(userId :unknown) :Promise<INotificationModel[]>{
       return await this._notificatinoRepo.getUserNotifications(userId as Types.ObjectId)
    }
}