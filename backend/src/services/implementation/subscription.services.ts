import { Types } from 'mongoose';
import { IUserSubscriptionModel } from '../../models/userSubscription.model';
import { IUserSubscriptionRepository } from '../../repositories/interface/IUserSubscriptionRepository';
import { ISubscriptionServices } from '../interface/ISubscription';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import { IMapppedSubscription } from '../../types/userSubscription.type';
import { subscriptionMapper } from '../../mappers/subscription.mapper';
import { INotificationservices } from '../interface/INotificationServices';

export class SubscriptionServices implements ISubscriptionServices {
  constructor(
    private _subscriptionRepo: IUserSubscriptionRepository,
    private _userRepo: IUserRepository,
    private _notificationServices: INotificationservices
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

    const newSubscription = await this._subscriptionRepo.createSubscription({
      ...subscriptionData,
      startDate,
      endDate,
    });

    await this._notificationServices.createNotification({
      userId: newSubscription.userId,
      title: 'Subscription Successfull',
      message: `Your ${planType} subscription is Success.`,
      type: 'SUCCESS',
    });

    return newSubscription;
  }
  async getAllSubscription(
    status: string,
    skip: unknown,
    limit: unknown
  ): Promise<{ subscriptions: IUserSubscriptionModel[]; count: number }> {
    const { subscriptions, count } =
      await this._subscriptionRepo.getAllSubscription(
        status,
        skip as number,
        limit as number
      );
    return { subscriptions, count };
  }
  async cancelSubscription(subscriptionId: unknown): Promise<void> {
    const userId = await this._subscriptionRepo.cancelSubscription(
      subscriptionId as Types.ObjectId
    );
    await this._notificationServices.createNotification({
      userId: userId,
      title: 'Subscription Cancelled',
      message: `Your Subscripbtion Has now cancelled By Admin. Please Contact the Admin`,
      type: 'ERROR',
    });
    await this._userRepo.cancelUserSubscription(userId);
  }
  async getAllActiveSubscriptions(): Promise<IUserSubscriptionModel[]> {
    return await this._subscriptionRepo.getAllActiveSubscriptions();
  }
  async getAllExpiredSubscriptions(): Promise<IUserSubscriptionModel[]> {
    return await this._subscriptionRepo.getAllExpiredSubscriptions();
  }

  async subscriptionExpired(
    subscriptionId: unknown,
    userId: unknown
  ): Promise<void> {
    await this._subscriptionRepo.subscriptionExpired(
      subscriptionId as Types.ObjectId
    );
    await this._userRepo.userSubscriptionExpired(userId as Types.ObjectId);
  }
  async userSubscribtionHistory(
    userId: unknown
  ): Promise<IMapppedSubscription[]> {
    const subscriptions = await this._subscriptionRepo.getUserSubscription(
      userId as Types.ObjectId
    );
    return subscriptions.map(subscriptionMapper);
  }
}
