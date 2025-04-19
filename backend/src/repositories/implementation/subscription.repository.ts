import { ObjectId, Types } from "mongoose";
import { IUserSubscriptionModel, UserSubscription } from "../../models/userSubscription.model";
import { BaseRepository } from "../base.repositry";
import {  IUserSubscriptionRepository } from "../interface/IUserSubscriptionRepository";
import { createHttpsError } from "../../utils/httpError.utils";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";

export class UserSubscriptionRepository extends BaseRepository<IUserSubscriptionModel> implements IUserSubscriptionRepository{
    constructor(){
        super(UserSubscription)
    }
    async createSubscription(subscriptionData: Partial<IUserSubscriptionModel>): Promise<IUserSubscriptionModel> {
       return await this.create(subscriptionData)
    }
    async getAllSubscription(status : string , skip : number , limit : number): Promise<{subscriptions : IUserSubscriptionModel[] ,count : number}> {
        let find : any = {}
        if(status != 'All'){
            find.status = status
        }
        
        const count = await this.model.countDocuments(find)
        const subscriptions = await this.model.find(find).skip(skip).limit(limit).populate('planId').populate('userId')
       
        return {subscriptions , count}
    }
    async getUserSubscription(userId: Types.ObjectId): Promise<IUserSubscriptionModel[]> {
        return await this.find({userId : userId})
    }
    async cancelSubscription(subscriptionId: Types.ObjectId): Promise<Types.ObjectId> {
        const subscription = await this.model.findById(subscriptionId)
        if(!subscription) throw createHttpsError(HttpStatus.BAD_REQUEST , HttpResponse.RESOURCE_NOT_FOUND)
        subscription.status = 'cancelled'
        const res = await subscription.save()
        console.log(res)
        return subscription.userId
    }
    async getAllActiveSubscriptions(): Promise<IUserSubscriptionModel[]> {
        return await this.find({status : 'active'})
    }
    async getAllExpiredSubscriptions(): Promise<IUserSubscriptionModel[]> {
        return await this.find({status : 'expired'})
    }
    async subscriptionExpired(subscriptionId : Types.ObjectId): Promise<void> {
        await this.findByIdAndUpdate(subscriptionId , {
            $set : {status : 'expired'}
        })
    }
    
}