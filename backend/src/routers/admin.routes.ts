import { Router } from 'express';
import { UserRepository } from '../repositories/implementation/user.repository';
import { UserServices } from '../services/implementation/user.services';
import { UserController } from '../controllers/implementation/user.controller';
import { adminAuth } from '../middlewares/admin.middleware';
import { SessionActivityRepository } from '../repositories/implementation/sesssionActivity.respository';
import { auth } from 'googleapis/build/src/apis/abusiveexperiencereport';
import { authMiddleware } from '../middlewares/auth.middleware';
import { AdminController } from '../controllers/implementation/admin.controller';
import { GroupServices } from '../services/implementation/group.service';
import { GroupRepository } from '../repositories/implementation/group.repository';
import { SessionServices } from '../services/implementation/session.services';
import { SessionRepository } from '../repositories/implementation/session.repository';

const adminRouter = Router();

const userRepo = new UserRepository();
const sessionActivityRepo = new SessionActivityRepository()
const userServices = new UserServices(userRepo , sessionActivityRepo);
const userController = new UserController(userServices);

const groupRepo = new GroupRepository()
const groupServices = new GroupServices(groupRepo, userRepo)
const sessionRepo = new SessionRepository()
const sessionServices = new SessionServices(sessionRepo,groupRepo,sessionActivityRepo)

const adminController = new AdminController(userServices,groupServices , sessionServices)

adminRouter.use(adminAuth);

adminRouter.get(
  '/all-students',
  userController.getAllStudents.bind(userController)
);
adminRouter.put(
  '/block-unblock-student/:studentId',
  userController.blockOrUnblock.bind(userController)
);

adminRouter.get(
  '/get-dashboard-data',
  adminController.getDashboardData.bind(adminController)
)

export default adminRouter;
