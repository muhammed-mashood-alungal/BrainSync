import { Router } from 'express';
import { GroupRepository } from '../repositories/implementation/group.repository';
import { GroupServices } from '../services/implementation/group.service';
import { GroupController } from '../controllers/implementation/group.controller';
import { UserRepository } from '../repositories/implementation/user.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminAuth } from '../middlewares/admin.middleware';
import { NotificationRepository } from '../repositories/implementation/notification.repository';
import { NotificationServices } from '../services/implementation/notification.services';

const groupRouter = Router();

const groupRepo = new GroupRepository();
const userRepo = new UserRepository();
const notificationRepo = new NotificationRepository()
const notificationService = new NotificationServices(notificationRepo)
const groupServices = new GroupServices(groupRepo, userRepo,notificationService);
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
groupRouter.put(
  '/:groupId/delete-group',
  authMiddleware,
  groupController.deleteGroup.bind(groupController)
);
groupRouter.put(
  '/:groupId/remove-member',
  authMiddleware,
  groupController.removeMember.bind(groupController)
);
groupRouter.put(
  '/:groupId/edit-name',
  authMiddleware,
  groupController.editGroupName.bind(groupController)
);

export default groupRouter;
