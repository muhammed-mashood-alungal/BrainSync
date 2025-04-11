import { Router } from 'express';
import { GroupRepository } from '../repositories/implementation/group.repository';
import { GroupServices } from '../services/implementation/group.service';
import { GroupController } from '../controllers/implementation/group.controller';
import { UserRepository } from '../repositories/implementation/user.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminAuth } from '../middlewares/admin.middleware';

const groupRouter = Router();

const groupRepo = new GroupRepository();
const userRepo = new UserRepository();
const groupServices = new GroupServices(groupRepo, userRepo);
const groupController = new GroupController(groupServices);

groupRouter.post(
  '/',
  authMiddleware,
  groupController.createGroup.bind(groupController)
);
groupRouter.put(
  '/:groupId/add-members',
  authMiddleware,
  groupController.addToGroup.bind(groupController)
);
groupRouter.put(
  '/left-group/:groupId',
  authMiddleware,
  groupController.leftGroup.bind(groupController)
);
groupRouter.get(
  '/',
  adminAuth,
  groupController.getAllGroups.bind(groupController)
);
groupRouter.get(
  '/my-groups/:userId',
  authMiddleware,
  groupController.getMyGroups.bind(groupController)
);
groupRouter.get(
  '/:groupId',
  groupController.getGroupData.bind(groupController)
);
groupRouter.put(
  '/:groupId/handle-activation',
  adminAuth,
  groupController.handleGroupActivation.bind(groupController)
);

export default groupRouter;
