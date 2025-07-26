"use client";
import { AUTH_MESSAGES } from "@/constants/messages/auth.messages";
import {  CONFIG_MESSAGES } from "@/constants/messages/config.messages";
import { SUBSCRIPTION_MESSAGES } from "@/constants/messages/subscription.messages";
import { useAuth } from "@/context/auth.context";
import { paymentServices } from "@/services/client/payment.client";
import { subscriptionServices } from "@/services/client/subscription.client";
import { IPlans } from "@/types/plans.types";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
interface PremiumPlansProps {
  plans: IPlans[];
}

const PremiumPlans: React.FC<PremiumPlansProps> = ({ plans }) => {
  const { user, checkAuth } = useAuth();
  const router = useRouter();

  const handleOnlinePayment = (amount: number) => {
    return new Promise(async (resolve, reject) => {
      try {
        const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_ID;

        if (!RAZORPAY_KEY_ID) {
          throw new Error(CONFIG_MESSAGES.MISSING_ENV("REZORPAY KEY"));
        }

        const order = await paymentServices.createPaymentOrder(amount * 100);

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Brain Sync",
          description: "Payment for your order",
          order_id: order.id,
          handler: async (response: any) => {
            try {
              await paymentServices.verifyPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );
              resolve({
                success: true,
                message: "Payment Success",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
              });
            } catch (err) {
              reject({ success: false, message: "Payment Failed", err });
            }
          },
          prefill: {
            name: user?.username,
            email: user?.email,
          },
          notes: {
            address: "BrainSync Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzpay = new (window as any).Razorpay(options);
        rzpay.open();

        rzpay.on("payment.failed", (response: any) => {
          console.error("Payment failed", response.error);
          reject({
            success: false,
            message: "Payment failed",
            error: response.error,
          });
        });
      } catch (err: any) {
        toast.error(err.message || SUBSCRIPTION_MESSAGES.PAYMENT_ERROR);
        reject({
          success: false,
          message: SUBSCRIPTION_MESSAGES.PAYMENT_ERROR,
          error: err,
        });
      }
    });
  };

  const handleSubscription = async (plan: IPlans) => {
    try {
      if (!user) {
        toast.error(AUTH_MESSAGES.PLEASE_LOGIN_TO_ACCESS);
        return router.push("/login");
      }
      if (user.isPremiumMember) {
        return toast.error(SUBSCRIPTION_MESSAGES.ALREADY_PREMIUM_USER);
      }

      const result = (await handleOnlinePayment(plan.offerPrice)) as {
        success: boolean;
        message: string;
        razorpayOrderId: string;
        razorpayPaymentId: string;
      };
      if (result.success) {
        toast.success(SUBSCRIPTION_MESSAGES.PAYMENT_SUCCESS);
        await subscriptionServices.buySubscription(
          {
            planId: plan._id,
            razorpayOrderId: result.razorpayOrderId,
            razorpayPaymentId: result.razorpayPaymentId,
            amount: plan.offerPrice,
          },
          plan.interval
        );
        const data = {
          plan: plan,
          transactionId: result.razorpayPaymentId,
        };
        checkAuth();
        router.push(
          `/premium-plans/purchase-success?data=${encodeURIComponent(
            JSON.stringify(data)
          )}`
        );
      } else {
      }
    } catch (error: unknown) {
      toast.error(
        (error as Error).message || SUBSCRIPTION_MESSAGES.PAYMENT_FAILED
      );
    }
  };
  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Premium</h1>
          <p className="text-xl text-gray-300">
            Get started with a subscription that works for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans?.map((plan) => (
            <div
              key={plan._id}
              className={`rounded-lg p-8 ${
                plan.isHighlighted
                  ? "bg-gradient-to-br from-cyan-400 to-cyan-600 text-gray-900"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {plan.name}
                    <span className="text-lg font-normal ml-2">
                      billed {plan.interval}
                      {plan.interval === "yearly"
                        ? ` (₹${plan?.offerPrice * 12})`
                        : ""}
                    </span>
                  </h2>
                </div>
                {plan.isHighlighted && (
                  <div className="bg-white text-cyan-600 px-3 py-1 rounded-full text-sm font-semibold">
                    🎉 Most popular
                  </div>
                )}
              </div>

              {plan.isHighlighted && (
                <div className="mb-4">
                  <p className="font-medium">
                    Our <span className="font-bold">most popular</span> plan
                    previously sold for ₹{plan.orginalPrice}/month and is now
                    only ₹{plan.offerPrice}/month.
                  </p>
                </div>
              )}

              {!plan.isHighlighted && (
                <div className="mb-4">
                  <p className="mb-2">Down from ₹{plan.orginalPrice}/month.</p>
                  <p className="text-gray-300">
                    Our {plan.interval} plan grants access to{" "}
                    <span className="font-bold">all premium features</span>, the
                    best plan for
                    {plan.interval === "monthly"
                      ? " short-term subscribers."
                      : " long-term subscribers."}
                  </p>
                </div>
              )}

              <div className="flex items-end mb-8">
                <span className="text-4xl font-bold">₹{plan.offerPrice}</span>
                <span className="text-xl ml-1">/mo</span>
              </div>

              <p className="text-sm mb-6 text-right">
                Prices are marked in Rupee
              </p>

              <button
                onClick={() => handleSubscription(plan)}
                className={`w-full py-3 rounded-md font-bold ${
                  plan.isHighlighted
                    ? "bg-gray-900 hover:bg-gray-800 text-cyan-400"
                    : "bg-black hover:bg-gray-900"
                }`}
              >
                Subscribe
              </button>

              {plan.features && plan.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold mb-2">Features:</h3>
                  <ul className="space-y-2">
                    {plan?.features?.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">✓</span>
                        <div>
                          <p className="font-medium">{feature.title}</p>
                          {feature.description && (
                            <p className="text-sm text-gray-300">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumPlans;
