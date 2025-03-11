import { Router  } from "express";
import { GroupRepository } from "../repositories/implementation/group.repository";
import { GroupServices } from "../services/implementation/group.service";
import { GroupController } from "../controllers/implementation/group.controller";
import { UserRepository } from "../repositories/implementation/user.repository";

const groupRouter = Router()

const groupRepo = new GroupRepository()
const userRepo = new UserRepository()
const groupServices = new GroupServices(groupRepo,userRepo)
const groupController = new GroupController(groupServices)



groupRouter.post('/',groupController.createGroup.bind(groupController))
groupRouter.put('/:groupId/add-members' , groupController.addToGroup.bind(groupController))
groupRouter.put('/left-group/:groupId' , groupController.leftGroup.bind(groupController))
groupRouter.get('/' , groupController.getAllGroups.bind(groupController))
groupRouter.get('/my-groups/:userId' , groupController.getMyGroups.bind(groupController))
groupRouter.get('/:groupId' , groupController.getGroupData.bind(groupController))
groupRouter.put('/:groupId/handle-activation' , groupController.handleActivation.bind(groupController))

export default groupRouter