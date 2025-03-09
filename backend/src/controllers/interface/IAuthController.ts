import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    signup(req : Request , res : Response , next : NextFunction) : Promise<void> 
    signin(req : Request , res : Response , next  : NextFunction) : Promise<void>
    verifyOtp(req : Request , res : Response , next : NextFunction) : Promise<void>
    resendOtp(req : Request , res : Response , next : NextFunction) : Promise<void>
    authMe(req : Request , res : Response , next : NextFunction) : Promise<void>
    refreshAccessToken(req: Request, res: Response, next: NextFunction): Promise<void>
    logout(req: Request, res: Response, next: NextFunction): Promise<void>
    googleAuthRedirect(req: Request, res: Response , next : NextFunction) : Promise<void>
}