import { Router } from "express"
import { UserRepository } from "../repositories/implementation/user.repository"
import { AuthService } from "../services/implementation/auth.services"
import { AuthController } from "../controllers/implementation/auth.controller"

const authRouter = Router()


const userRepository = new UserRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

authRouter.post('/signup' , authController.signup.bind(authController))
authRouter.post('/signin' , authController.signin.bind(authController))
authRouter.post('/verify-otp' , authController.verifyOtp.bind(authController))
