import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interface/IAuthController";
import { IAuthService } from "../../services/interface/IAuthService";
import { HttpStatus } from "../../constants/status.constants";
import { createHttpsError } from "../../utils/httpError.utils";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { generateAccesToken } from "../../utils/jwt.util";
import { env } from "../../configs/env.config";
import { IUserModel } from "../../models/user.model";

export class AuthController implements IAuthController {
    constructor(private _authService: IAuthService) { }

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email = await this._authService.signup(req.body)

            res.status(HttpStatus.OK).json({
                email: email
            })
        } catch (error) {
            next(error)
        }
    }
    async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body

            const tokens = await this._authService.signin(email, password)


            res.cookie("accessToken", tokens.accessToken, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
            })

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
            })
            res.status(HttpStatus.OK).json(tokens)
        } catch (err) {
            next(err)
        }
    }
    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { otp, email } = req.body
            console.log(otp, email)
            const tokens = await this._authService.verifyOtp(email, otp)

            res.cookie("accessToken", tokens.accessToken, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
            })

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
            })

            res.status(HttpStatus.CREATED).json(tokens)
        } catch (err) {
            next(err)
        }

    }
    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body
            await this._authService.resendOtp(email)
            res.status(HttpStatus.CREATED).json()
        } catch (err) {
            console.log(err)
            next(err)
        }

    }
    async refreshAccessToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.cookies;

            const accessToken = await this._authService.refreshAccessToken(refreshToken);

            res.status(HttpStatus.OK).json(accessToken);
        } catch (error) {
            next(error)
        }
    }
    async authMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { accessToken } = req.cookies;
            if (!accessToken) {
                throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.NO_TOKEN)
            }
            const user = this._authService.authMe(accessToken)

            res.status(HttpStatus.OK).json(user)
        } catch (error) {
            next(error)
        }
    }
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('api hit')
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            res.status(HttpStatus.OK).json()
        } catch (err) {
            next(err)
        }
    }
    async googleAuthRedirect(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('hellllllllllo')
            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" })
                return
            }

            const tokens = this._authService.generateTokens(req.user as IUserModel)

            res.cookie("accessToken", tokens.accessToken, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
            })

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
            })


            res.redirect(`${env.CLIENT_ORIGIN}`);
        } catch (err) {
            
            next(err)
        }

    }
} 