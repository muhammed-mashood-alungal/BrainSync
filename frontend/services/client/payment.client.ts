import { paymentInstances } from "@/axios/instance.axios";
import { AxiosError } from "axios";

export const paymentServices = {
  createPaymentOrder: async (amount: number): Promise<any> => {
    try {
      const response = await paymentInstances.post("/create-order", { amount });
      return response.data.order;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Creating Payment Order failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  verifyPayment: async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
  ): Promise<boolean> => {
    try {
      const response = await paymentInstances.post("/verify-payment", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Payment verification failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
};
