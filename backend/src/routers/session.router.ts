import { Router } from 'express';
import { SessionRepository } from '../repositories/implementation/session.repository';
import { SessionServices } from '../services/implementation/session.services';
import { SessionController } from '../controllers/implementation/session.controller';
import { GroupRepository } from '../repositories/implementation/group.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminAuth } from '../middlewares/admin.middleware';
import { SessionActivityRepository } from '../repositories/implementation/sesssionActivity.respository';
import { NotificationRepository } from '../repositories/implementation/notification.repository';
import { NotificationServices } from '../services/implementation/notification.services';

const sessionRouter = Router();

const sessionRepo = new SessionRepository();
const groupRepo = new GroupRepository();
const notificationRepo = new NotificationRepository()
const notificationService = new NotificationServices(notificationRepo)
const sessionActivityRepo = new SessionActivityRepository();
const sessionServices = new SessionServices(
  sessionRepo,
  groupRepo,
  sessionActivityRepo,
  notificationService
);
const sessionController = new SessionController(sessionServices);

sessionRouter.post(
  '/create',
  authMiddleware,
  sessionController.createSession.bind(sessionController)
);
sessionRouter.get(
  '/',
  adminAuth,
  sessionController.allSessions.bind(sessionController)
);
sessionRouter.get(
  '/my-sessions',
  authMiddleware,
  sessionController.mySessions.bind(sessionController)
);
sessionRouter.get(
  '/validate/:sessionCode',
  authMiddleware,
  sessionController.validateSession.bind(sessionController)
);
sessionRouter.put(
  '/update/:sessionId',
  authMiddleware,
  sessionController.updateSession.bind(sessionController)
);
sessionRouter.post(
  '/stop-session/:sessionId',
  authMiddleware,
  adminAuth,
  sessionController.stopSession.bind(sessionController)
);

sessionRouter.put('/add-session-activity/:sessionCode', authMiddleware , sessionController.addTimeSpendOnSession.bind(sessionController));


export default sessionRouter;
