import { IUserSubscriptionModel } from '../models/userSubscription.model';
import { IMapppedSubscription } from '../types/userSubscription.type';

export const subscriptionMapper = (
  sub: IUserSubscriptionModel
): IMapppedSubscription => {
  return {
    planId: sub.planId,
    amount: sub.amount,
    startDate: sub.startDate,
    endDate: sub.endDate,
    status: sub.status,
    createdAt : sub.createdAt
  };
};
