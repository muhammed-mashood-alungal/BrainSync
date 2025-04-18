import { NextFunction, Request, Response } from "express";

export interface IRazorpayController {
     createPaymentOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
       verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
}