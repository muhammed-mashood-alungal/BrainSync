import { Types } from 'mongoose';
import { IUserSubscriptionModel } from '../../models/userSubscription.model';

export interface IUserSubscriptionRepository {
  createSubscription(
    subscriptionData: Partial<IUserSubscriptionModel>
  ): Promise<IUserSubscriptionModel>;
  getAllSubscription(status : string , skip : number , limit : number): Promise<{subscriptions : IUserSubscriptionModel[] ,count : number}>;
  getUserSubscription(
    userId: Types.ObjectId
  ): Promise<IUserSubscriptionModel[]>;
 
}
