import { Types } from 'mongoose';
import { IUserSubscriptionModel } from '../../models/userSubscription.model';
import { IUserSubscriptionRepository } from '../../repositories/interface/IUserSubscriptionRepository';
import { ISubscriptionServices } from '../interface/ISubscription';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import { createHttpsError } from '../../utils/httpError.utils';
import { HttpStatus } from '../../constants/status.constants';
import { HttpResponse } from '../../constants/responseMessage.constants';

export class SubscriptionServices implements ISubscriptionServices {
  constructor(
    private _subscriptionRepo: IUserSubscriptionRepository,
    private _userRepo: IUserRepository
  ) {}

  async createSubscription(
    subscriptionData: Partial<IUserSubscriptionModel>,
    planType: string
  ): Promise<IUserSubscriptionModel> {
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (planType == 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (planType == 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    await this._userRepo.setSubscription(
      subscriptionData.userId as Types.ObjectId,
      subscriptionData.planId as Types.ObjectId
    );

    return await this._subscriptionRepo.createSubscription({
      ...subscriptionData,
      startDate,
      endDate,
    });
  }
  async getAllSubscription(status : string , skip : unknown , limit : unknown): Promise<{subscriptions : IUserSubscriptionModel[] , count : number}> {
    const {subscriptions , count}= await this._subscriptionRepo.getAllSubscription(status , skip as number , limit as number);
    return {subscriptions , count}
  }
  async getUserSubscription(
    userId: unknown
  ): Promise<IUserSubscriptionModel[]> {
    return await this._subscriptionRepo.getUserSubscription(
      userId as Types.ObjectId
    );
  }
  async cancelSubscription(
    subscriptionId : unknown
  ):Promise<void> {
    const userId = await this._subscriptionRepo.cancelSubscription(subscriptionId as Types.ObjectId)
    await this._userRepo.cancelUserSubscription(userId)
  }
  async getAllActiveSubscriptions():Promise<IUserSubscriptionModel[]>{
    return await this._subscriptionRepo.getAllActiveSubscriptions()
  }
  async getAllExpiredSubscriptions() : Promise<IUserSubscriptionModel[]>{
    return await this._subscriptionRepo.getAllExpiredSubscriptions()
  }

  async subscriptionExpired(subscriptionId : unknown , userId  : unknown): Promise<void> {
     await this._subscriptionRepo.subscriptionExpired(subscriptionId as Types.ObjectId)
     await this._userRepo.userSubscriptionExpired(userId as Types.ObjectId)
  }
}
