import { IUserSubscriptionModel } from "../../models/userSubscription.model";
import { IMapppedSubscription } from "../../types/userSubscription.type";

export interface ISubscriptionServices {
      createSubscription(
        subscriptionData: Partial<IUserSubscriptionModel>,
        planType : string
      ): Promise<IUserSubscriptionModel>;
      getAllSubscription(status : string , skip : unknown , limit : unknown): Promise<{subscriptions : IUserSubscriptionModel[] , count : number}>
      getUserSubscription(
        userId:unknown
      ): Promise<IUserSubscriptionModel[]>;
      cancelSubscription(
        subscriptionId : unknown
      ):Promise<void> 
      getAllActiveSubscriptions():Promise<IUserSubscriptionModel[]>
      getAllExpiredSubscriptions() : Promise<IUserSubscriptionModel[]>
     subscriptionExpired(subscriptionId : unknown, userId  : unknown): Promise<void> 
     userSubscribtionHistory(userId : unknown) : Promise<IMapppedSubscription[]>
}