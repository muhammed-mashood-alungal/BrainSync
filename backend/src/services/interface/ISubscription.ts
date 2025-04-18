import { IUserSubscriptionModel } from "../../models/userSubscription.model";

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
}