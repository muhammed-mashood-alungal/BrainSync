import { Router } from "express";
import { UserRepository } from "../repositories/implementation/user.repository";
import { UserServices } from "../services/implementation/user.services";
import { UserController } from "../controllers/implementation/user.controller";

const adminRouter = Router()


const userRepo = new UserRepository()
const userServices = new UserServices(userRepo)
const userController = new UserController(userServices)



adminRouter.get('/all-students' , userController.getAllStudents.bind(userController))
adminRouter.put('/block-unblock-student/:studentId' , userController.blockOrUnblock.bind(userController))


export default adminRouter