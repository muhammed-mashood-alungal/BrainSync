import Razorpay from 'razorpay';
import { IRazorpayOrder } from '../../types/razorpay.types';

export interface IRazorpayServices {
  createPaymentOrder(amount: number): Promise<IRazorpayOrder>;
  verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
  ): Promise<boolean>;
}
