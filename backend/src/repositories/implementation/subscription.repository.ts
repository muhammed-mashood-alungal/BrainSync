import { Types } from "mongoose";
import { IUserSubscriptionModel, UserSubscription } from "../../models/userSubscription.model";
import { BaseRepository } from "../base.repositry";
import {  IUserSubscriptionRepository } from "../interface/IUserSubscriptionRepository";

export class UserSubscriptionRepository extends BaseRepository<IUserSubscriptionModel> implements IUserSubscriptionRepository{
    constructor(){
        super(UserSubscription)
    }
    async createSubscription(subscriptionData: Partial<IUserSubscriptionModel>): Promise<IUserSubscriptionModel> {
       return await this.create(subscriptionData)
    }
    async getAllSubscription(status : string , skip : number , limit : number): Promise<{subscriptions : IUserSubscriptionModel[] ,count : number}> {
        const count = await this.model.countDocuments({status : status})
        const subscriptions = await this.model.find({status}).skip(skip).limit(limit)

        return {subscriptions , count}
    }
    async getUserSubscription(userId: Types.ObjectId): Promise<IUserSubscriptionModel[]> {
        return await this.find({userId : userId})
    }
}