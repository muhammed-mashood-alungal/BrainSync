import { Request, Response, NextFunction } from 'express';
import { IRazorpayServices } from '../../services/interface/IRazorpayService';
import { IRazorpayController } from '../interface/IRazorpayController';
import { HttpStatus } from '../../constants/status.constants';
import { successResponse } from '../../utils/response';
import { HttpResponse } from '../../constants/responseMessage.constants';
import { createHttpsError } from '../../utils/httpError.utils';

export class RazorpayController implements IRazorpayController {
  constructor(private _razorpayServices: IRazorpayServices) {}

  async createPaymentOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { amount } = req.body;
      const order = await this._razorpayServices.createPaymentOrder(amount);
      res
        .status(HttpStatus.CREATED)
        .json(successResponse(HttpResponse.CREATED, { order }));
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
      const isVerified = await this._razorpayServices.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isVerified) {
        throw createHttpsError(
          HttpStatus.BAD_REQUEST,
          HttpResponse.PAYMENT_FAILED
        );
      }

      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK));
    } catch (error) {
      next(error);
    }
  }
}
