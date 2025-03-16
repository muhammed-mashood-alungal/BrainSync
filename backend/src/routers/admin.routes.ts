import { Router } from "express";
import { UserRepository } from "../repositories/implementation/user.repository";
import { UserServices } from "../services/implementation/user.services";
import { UserController } from "../controllers/implementation/user.controller";
import { adminAuth } from "../middlewares/admin.middleware";

const adminRouter = Router()

const userRepo = new UserRepository()
const userServices = new UserServices(userRepo)
const userController = new UserController(userServices)

adminRouter.use(adminAuth)

adminRouter.get('/all-students' , userController.getAllStudents.bind(userController))
adminRouter.put('/block-unblock-student/:studentId' , userController.blockOrUnblock.bind(userController))


export default adminRouter