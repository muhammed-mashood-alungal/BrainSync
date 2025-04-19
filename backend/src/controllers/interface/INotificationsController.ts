import { NextFunction, Request, Response } from "express";

export interface INotificationController {
        createNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
        readNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
        readAllNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
        getUserNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
}