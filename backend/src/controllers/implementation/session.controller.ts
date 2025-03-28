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
    async allSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sessions = await this._sessionServices.getAllSessions()
            console.log(sessions)
            res.status(HttpStatus.OK).json({sessions : sessions})
        } catch (err) {
            next(err)
        }
    }
    async mySessions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user
            const sessions = await this._sessionServices.getMySessions(userId)
            res.status(HttpStatus.OK).json({ sessions : sessions })
        } catch (err) {
            next(err)
        }
    }
    async validateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {sessionCode} = req.params
            const userId = req.user
            const result = await this._sessionServices.validateSession(sessionCode ,userId)
            res.status(HttpStatus.OK).json(result)
        }catch(err){
            next(err)
        }
    }
} 