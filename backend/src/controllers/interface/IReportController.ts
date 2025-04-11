import { NextFunction, Request, Response } from 'express';

export interface IReportController {
  reportSession(req: Request, res: Response, next: NextFunction): Promise<void>;
  closeSessionReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  resolveSessionReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getAllReports(req: Request, res: Response, next: NextFunction): Promise<void>;
}
