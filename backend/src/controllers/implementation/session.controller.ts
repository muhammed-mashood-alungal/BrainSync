import { NextFunction, Request, Response } from "express";
import { ISessionServices } from "../../services/interface/ISessionService";
import { ISessionController } from "../interface/ISessionControllers";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";

export class SessionController implements ISessionController {
    constructor(private _sessionServices: ISessionServices) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body
            const userId = req.user

            
            
            await this._sessionServices.createSession(data, userId as string)
            res.status(HttpStatus.OK).json({ message: HttpResponse.CREATED })
        } catch (err) {
            next(err)
        }
    }
} 