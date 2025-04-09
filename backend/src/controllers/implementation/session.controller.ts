import { NextFunction, Request, Response } from "express";
import { ISessionServices } from "../../services/interface/ISessionService";
import { ISessionController } from "../interface/ISessionControllers";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { successResponse } from "../../utils/response";

export class SessionController implements ISessionController {
    constructor(private _sessionServices: ISessionServices) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body
            const userId = req.user
            const newData = await this._sessionServices.createSession(data, userId as string)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK, { newSession: newData }))
        } catch (err) {
            next(err)
        }
    }
    async allSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sessions = await this._sessionServices.getAllSessions()
            console.log(sessions)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK, { sessions: sessions }))
        } catch (err) {
            next(err)
        }
    }
    async mySessions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user
            const { subject, date } = req.query
            const sessions = await this._sessionServices.getMySessions(userId, subject as string, date as string)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK, { sessions: sessions }))
        } catch (err) {
            next(err)
        }
    }
    async validateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { sessionCode } = req.params
            const userId = req.user
            const result = await this._sessionServices.validateSession(sessionCode, userId)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK, { result: result }))
        } catch (err) {
            next(err)
        }
    }
    async updateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { sessionId } = req.params
            const data = req.body
            const userId = req.user

            const updatedSession = await this._sessionServices.updateSession(data, sessionId, userId)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.UPDATED, { updatedSession: updatedSession }))
        } catch (err) {
            next(err)
        }
    }
    async stopSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { sessionId } = req.params
            const response = await this._sessionServices.stopSession(sessionId)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK))
        } catch (error) {
            next(error)
        }
    }
} 