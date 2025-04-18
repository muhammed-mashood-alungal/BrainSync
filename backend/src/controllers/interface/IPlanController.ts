import { NextFunction, Request, Response } from "express";

export interface IPlanController {
  createPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
       getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void>;
       getAcitvePlans(req: Request, res: Response, next: NextFunction): Promise<void>;
       updatePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
       toggleActive(req: Request, res: Response, next: NextFunction): Promise<void>;
}