import { NextFunction, Request, Response } from "express";

export interface ISubscriptionController {
    createSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
      getAllSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
      getUserSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
      userSubscribtionHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
}