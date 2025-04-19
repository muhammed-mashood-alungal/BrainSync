import cron from 'node-cron';
import { NotificationRepository } from '../repositories/implementation/notification.repository';
import { NotificationServices } from '../services/implementation/notification.services';
import { UserRepository } from '../repositories/implementation/user.repository';
import { UserServices } from '../services/implementation/user.services';
import { SessionRepository } from '../repositories/implementation/session.repository';
import { SessionActivityRepository } from '../repositories/implementation/sesssionActivity.respository';
import { UserSubscriptionRepository } from '../repositories/implementation/subscription.repository';
import { SubscriptionServices } from '../services/implementation/subscription.services';

const notificationRepo = new NotificationRepository();
const notificationServices = new NotificationServices(notificationRepo);

const userRepo = new UserRepository();
const sessionActivityRepo = new SessionActivityRepository();
const userServices = new UserServices(userRepo, sessionActivityRepo);

const subscriptionRepo = new UserSubscriptionRepository();
const subscriptionServices = new SubscriptionServices(
  subscriptionRepo,
  userRepo
);

cron.schedule('0 9 * * *', async () => {
  console.log('Running Daily nitification job');

  const activeSubscriptions =
    await subscriptionServices.getAllActiveSubscriptions();
  const today = new Date();
  for (let subscription of activeSubscriptions) {
    const timeDiff = subscription.endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft <= 5 && daysLeft > 0) {
      await notificationServices.createNotification({
        userId: subscription.userId,
        title:"Your Subscription Expires Soon",
        message: `Your subscription will expire in ${daysLeft} day(s). Renew soon to avoid interruption.`,
        type: 'WARNING',
      });
    }else if(daysLeft <= 0 ){
      await subscriptionServices.subscriptionExpired(subscription._id , subscription.userId)
      await notificationServices.createNotification({
        userId: subscription.userId,
        title:"Your Subscription Expired",
        message: `Your subscription  Expired. Renew soon to avoid interruption.`,
        type: 'WARNING',
      });
    }
  }

});
