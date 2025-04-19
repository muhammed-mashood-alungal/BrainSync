import { Types } from "mongoose";
import Notification, { INotificationModel } from "../../models/notification.model";
import { BaseRepository } from "../base.repositry";
import { INotificationRepository } from "../interface/INotificationRepository";

export class NotificationRepository extends BaseRepository<INotificationModel> implements INotificationRepository {
    constructor(){
        super(Notification)
    }
    async createNotification(notificationData: Partial<INotificationModel>): Promise<INotificationModel> {
        console.log(notificationData)
             return await this.create(notificationData)
    }
    async readNotification(notificationId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
         await this.findByIdAndUpdate(notificationId , {
            $set : {isRead : true}
        })
    }
    async readAllNotification(userId: Types.ObjectId): Promise<void> {
        await this.model.updateMany({userId : userId},{
            $set : {isRead : true}
        })
        console.log('updatedddd')
    }
    async getUserNotifications(userId :Types.ObjectId) :Promise<INotificationModel[]> {
        return await this.find({userId : userId  , isRead:false})
    }
}