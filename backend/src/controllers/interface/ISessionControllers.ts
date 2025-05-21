import { NextFunction, Request, Response } from 'express';

export interface ISessionController {
  createSession(req: Request, res: Response, next: NextFunction): Promise<void>;
  mySessions(req: Request, res: Response, next: NextFunction): Promise<void>;
  allSessions(req: Request, res: Response, next: NextFunction): Promise<void>;
  validateSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateSession(req: Request, res: Response, next: NextFunction): Promise<void>;
  stopSession(req: Request, res: Response, next: NextFunction): Promise<void>;
  sessionReport(req:Request , res : Response , next : NextFunction):Promise<void>
}
