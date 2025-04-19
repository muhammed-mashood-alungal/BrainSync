import { NextFunction, Request, Response } from "express";

export interface IAdminController {
    getDashboardData(req: Request, res: Response, next: NextFunction): Promise<void>;
}