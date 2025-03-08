import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interface/IAuthController";
import { IAuthService } from "../../services/interface/IAuthService";
import { HttpStatus } from "../../constants/status.constants";

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
            const tokens = await this._authService.verifyOtp(otp, email)
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
} 