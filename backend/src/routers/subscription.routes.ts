import { Router } from 'express';
import { RazorpayServices } from '../services/implementation/razorpay.services';
import { UserRepository } from '../repositories/implementation/user.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import razorpay from '../utils/razorpay.util';
import { RazorpayController } from '../controllers/implementation/razorpay.controller';
import { SubscriptionController } from '../controllers/implementation/subscription.controller';
import { SubscriptionServices } from '../services/implementation/subscription.services';
import { UserSubscriptionRepository } from '../repositories/implementation/subscription.repository';
import { adminAuth } from '../middlewares/admin.middleware';
import { NotificationRepository } from '../repositories/implementation/notification.repository';
import { NotificationServices } from '../services/implementation/notification.services';

const subscriptionRouter = Router();

const subscriptionRepo = new UserSubscriptionRepository();
const userRepo = new UserRepository()
const notificationRepo  = new NotificationRepository()
const notificationServices = new NotificationServices(notificationRepo)
const subscriptionServices = new SubscriptionServices(subscriptionRepo,userRepo ,notificationServices);
const subscriptionController = new SubscriptionController(subscriptionServices);
subscriptionRouter.post(
  '/buy',
  authMiddleware,
  subscriptionController.createSubscription.bind(subscriptionController)
);
subscriptionRouter.get(
  '/all-subscriptions',
  authMiddleware,
  adminAuth,
  subscriptionController.getAllSubscription.bind(subscriptionController)
);
subscriptionRouter.get(
  '/user-subscriptions',
  authMiddleware,
  subscriptionController.getUserSubscription.bind(subscriptionController)
);
subscriptionRouter.put(
    '/cancel/:subscriptionId',
    authMiddleware,
    subscriptionController.cancelSubsription.bind(subscriptionController)
  );
export default subscriptionRouter;
