import { Router } from "express"
import { UserRepository } from "../repositories/implementation/user.repository"
import { AuthService } from "../services/implementation/auth.services"
import { AuthController } from "../controllers/implementation/auth.controller"
import passport from '../utils/passport.utils'

const authRouter = Router()


const userRepository = new UserRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

authRouter.post('/signup', authController.signup.bind(authController))
authRouter.post('/verify-otp', authController.verifyOtp.bind(authController))
authRouter.post('/resend-otp', authController.resendOtp.bind(authController))
authRouter.post('/signin', authController.signin.bind(authController))
authRouter.post('/me',authController.authMe.bind(authController))
authRouter.post('/refresh-token',authController.refreshAccessToken.bind(authController))
authRouter.post('/logout',authController.logout.bind(authController))
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), authController.googleAuthRedirect.bind(authController))
export default authRouter
