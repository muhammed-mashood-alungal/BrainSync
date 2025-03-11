import { Router } from "express";
import { UserRepository } from "../repositories/implementation/user.repository";
import { UserServices } from "../services/implementation/user.services";
import { UserController } from "../controllers/implementation/user.controller";
import upload from "../configs/multer.configs";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRouter = Router()


const userRepo = new UserRepository()
const userServices = new UserServices(userRepo)
const userController = new UserController(userServices)


userRouter.put('/change-profile-photo/:userId', upload.single('image'), authMiddleware,userController.changeProfilePic.bind(userController))
userRouter.get('/search',authMiddleware,userController.searchUserbyEmail.bind(userController))
userRouter.get('/:userId' , authMiddleware,userController.getUserData.bind(userController))
userRouter.put('/edit-username/:userId' ,authMiddleware, userController.editUsername.bind(userController))
userRouter.put('/change-password/:userId' ,authMiddleware, userController.changePassword.bind(userController))
export default userRouter