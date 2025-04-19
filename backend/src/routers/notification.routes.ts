import { Router } from 'express';
import { NotificationRepository } from '../repositories/implementation/notification.repository';
import { NotificationServices } from '../services/implementation/notification.services';
import { NotificationController } from '../controllers/implementation/notification.constroller';
import { authMiddleware } from '../middlewares/auth.middleware';
const notificationRouter = Router();

const notificationRepo = new NotificationRepository();
const notificationServices = new NotificationServices(notificationRepo);
const notificationController = new NotificationController(notificationServices);
notificationRouter.put(
  '/read-all',
  authMiddleware,
  notificationController.readAllNotification.bind(notificationController)
);
notificationRouter.put(
  '/read-notification/:notificationId',
  authMiddleware,
  notificationController.readNotification.bind(notificationController)
);
notificationRouter.get(
  '/my-notifications',
  authMiddleware,
  notificationController.getUserNotifications.bind(notificationController)
);
export default notificationRouter;
