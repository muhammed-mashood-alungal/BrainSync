import { Request, Response, NextFunction } from 'express';
import { ISubscriptionController } from '../interface/ISubscriptionController';
import { ISubscriptionServices } from '../../services/interface/ISubscription';
import { HttpStatus } from '../../constants/status.constants';
import { successResponse } from '../../utils/response';
import { HttpResponse } from '../../constants/responseMessage.constants';

export class SubscriptionController implements ISubscriptionController {
  constructor(private _subscriptionServices: ISubscriptionServices) {}

  async createSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        const userId = req.user
        console.log(userId)
      const { subscriptionData , planType } = req.body;
      await this._subscriptionServices.createSubscription({...subscriptionData,userId} , planType);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK));
    } catch (error) {
      next(error);
    }
  }
  async getAllSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        const {status , skip , limit} = req.query
      const {subscriptions , count } =
        await this._subscriptionServices.getAllSubscription(status as string , skip , limit);

        console.log(subscriptions , count)
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { subscriptions , count}));
    } catch (error) {
      next(error);
    }
  }
  async getUserSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user;
      const subscriptions =
        await this._subscriptionServices.getUserSubscription(userId);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { subscriptions }));
    } catch (error) {
      next(error);
    }
  }
  async cancelSubsription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        const {subscriptionId} = req.params
        console.log(subscriptionId+"================================")
      await this._subscriptionServices.cancelSubscription(subscriptionId)
      console.log('Alllllllll Doneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK));
    } catch (error) {
      next(error);
    }
  }
}
