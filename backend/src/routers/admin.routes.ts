import { Router } from 'express';
import { UserRepository } from '../repositories/implementation/user.repository';
import { UserServices } from '../services/implementation/user.services';
import { UserController } from '../controllers/implementation/user.controller';
import { adminAuth } from '../middlewares/admin.middleware';
import { SessionActivityRepository } from '../repositories/implementation/sesssionActivity.respository';

const adminRouter = Router();

const userRepo = new UserRepository();
const sessionActivityRepo = new SessionActivityRepository()
const userServices = new UserServices(userRepo , sessionActivityRepo);
const userController = new UserController(userServices);

adminRouter.use(adminAuth);

adminRouter.get(
  '/all-students',
  userController.getAllStudents.bind(userController)
);
adminRouter.put(
  '/block-unblock-student/:studentId',
  userController.blockOrUnblock.bind(userController)
);

export default adminRouter;
