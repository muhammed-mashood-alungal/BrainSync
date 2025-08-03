import { Request, Response, NextFunction } from 'express';
import { INoteService } from '../../services/interface/INoteService';
import { INotificationController } from '../interface/INotificationsController';
import { INotificationservices } from '../../services/interface/INotificationServices';
import { HttpStatus } from '../../constants/status.constants';
import { successResponse } from '../../utils/response';
import { HttpResponse } from '../../constants/responseMessage.constants';

export class NotificationController implements INotificationController {
  constructor(private _notificationServices: INotificationservices) {}

  async createNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { notificationData } = req.body;
      await this._notificationServices.createNotification(notificationData);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK));
    } catch (error) {
      next(error);
    }
  }
  async readAllNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user;
      await this._notificationServices.readAllNotification(userId);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK));
    } catch (error) {
      next(error);
    }
  }
  async readNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user;
      const { notificationId } = req.params;
      await this._notificationServices.readNotification(notificationId, userId);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK));
    } catch (error) {
      next(error);
    }
  }
  async getUserNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user;
      const notifications =
        await this._notificationServices.getUserNotifications(userId);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { notifications }));
    } catch (error) {
      next(error);
    }
  }
}
