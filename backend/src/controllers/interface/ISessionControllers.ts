import { NextFunction, Request, Response } from "express";

export interface ISessionController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>
    mySessions(req: Request, res: Response, next: NextFunction): Promise<void>
    allSessions(req: Request, res: Response, next: NextFunction): Promise<void>
}