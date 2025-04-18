
import { env } from '../../configs/env.config';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import { IRazorpayOrder } from '../../types/razorpay.types';
import razorpay from '../../utils/razorpay.util';
import { IRazorpayServices } from '../interface/IRazorpayService';
import crypto from 'crypto'
export class RazorpayServices implements IRazorpayServices {

  async createPaymentOrder(amount: number): Promise<IRazorpayOrder> {
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
    };
    const order = await razorpay.orders.create(options);
    return order;
  }

  async verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
  ): Promise<boolean> {
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', env.RAZORPAY_SECRET_KEY!)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      return true
    } else {
      return false
    }
  }
}
