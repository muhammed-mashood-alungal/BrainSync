export {};

declare global {
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayPaymentResponse) => void;
    prefill?: {
      name?: string;
      email?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color: string;
    };
  }

  interface RazorpayInstance {
    open(): void;
    on(
      event: "payment.failed",
      callback: (response: RazorpayPaymentErrorResponse) => void
    ): void;
  }

  interface RazorpayPaymentResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }

  interface RazorpayPaymentErrorResponse {
    error: {
      code: string;
      description: string;
      source: string;
      reason: string;
      step: string;
      metadata: {
        order_id: string;
        payment_id: string;
      };
    };
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
