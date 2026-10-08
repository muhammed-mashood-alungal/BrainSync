import { Router } from 'express';
import { UserRepository } from '../repositories/implementation/user.repository';
import { UserServices } from '../services/implementation/user.services';
import { UserController } from '../controllers/implementation/user.controller';
import upload from '../configs/multer.configs';
import { authMiddleware } from '../middlewares/auth.middleware';
import { SessionActivityRepository } from '../repositories/implementation/sesssionActivity.respository';
import { GroupRepository } from '../repositories/implementation/group.repository';

const userRouter = Router();

const userRepo = new UserRepository();
const sessionActivityRepo = new SessionActivityRepository();
const groupRepo = new GroupRepository();
const userServices = new UserServices(userRepo, sessionActivityRepo, groupRepo);
const userController = new UserController(userServices);

userRouter.put(
  '/change-profile-photo',
  upload.single('image'),
  authMiddleware,
  userController.changeProfilePic.bind(userController)
);
userRouter.get(
  '/search',
  authMiddleware,
  userController.searchUserByEmail.bind(userController)
);

userRouter.get(
  '/user-session-progress',
  authMiddleware,
  userController.getUserSessionProgress.bind(userController)
);

userRouter.get(
  '/profile-stats',
  authMiddleware,
  userController.getProfileStats.bind(userController)
);

userRouter.put(
  '/edit-username',
  authMiddleware,
  userController.editUsername.bind(userController)
);

userRouter.put(
  '/change-password',
  authMiddleware,
  userController.changePassword.bind(userController)
);

userRouter.get(
  '/profile-photo/:userId',
  authMiddleware,
  userController.getProfilePhoto.bind(userController)
);

userRouter.delete(
  '/delete-profile-photo',
  authMiddleware,
  userController.deleteAvatar.bind(userController)
);

userRouter.get(
  '/:userId',
  authMiddleware,
  userController.getUserData.bind(userController)
); 

export default userRouter;
