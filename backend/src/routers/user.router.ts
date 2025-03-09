import { Router } from "express";
import { UserRepository } from "../repositories/implementation/user.repository";
import { UserServices } from "../services/implementation/user.services";
import { UserController } from "../controllers/implementation/user.controller";
import upload from "../configs/multer.configs";

const userRouter = Router()


const userRepo = new UserRepository()
const userServices = new UserServices(userRepo)
const userController = new UserController(userServices)


userRouter.put('/change-profile-photo/:userId', upload.single('image'),userController.changeProfilePic.bind(userController))
userRouter.get('/:userId' , userController.getUserData.bind(userController) )
userRouter.put('/edit-username/:userId' , userController.editUsername.bind(userController))
userRouter.put('/change-password/:userId' , userController.changePassword.bind(userController))
export default userRouter