import { Router } from 'express';
import { UserRepository } from '../repositories/implementation/user.repository';
import { AuthService } from '../services/implementation/auth.services';
import { AuthController } from '../controllers/implementation/auth.controller';
import passport from '../utils/passport.utils';
import { UserServices } from '../services/implementation/user.services';
import { env } from '../configs/env.config';
import { authMiddleware } from '../middlewares/auth.middleware';
const authRouter = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const userService = new UserServices(userRepository);
const authController = new AuthController(authService, userService);

authRouter.post('/signup', authController.signup.bind(authController));
authRouter.post('/verify-otp', authController.verifyOtp.bind(authController));
authRouter.post('/resend-otp', authController.resendOtp.bind(authController));
authRouter.post('/signin', authController.signin.bind(authController));
authRouter.post('/me', authController.authMe.bind(authController));
authRouter.post(
  '/verify-token',
  authController.verifyToken.bind(authController)
);
authRouter.post(
  '/refresh-token',
  authController.refreshAccessToken.bind(authController)
);
authRouter.post(
  '/logout',
  authMiddleware,
  authController.logout.bind(authController)
);
authRouter.post(
  '/forgot-password',
  authController.forgotPassword.bind(authController)
);
authRouter.post(
  '/reset-password',
  authController.resetPassword.bind(authController)
);
authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
    prompt: 'select_account',
  })
);
authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${env.CLIENT_ORIGIN}/login`,
  }),
  authController.googleAuthRedirect.bind(authController)
);
export default authRouter;
