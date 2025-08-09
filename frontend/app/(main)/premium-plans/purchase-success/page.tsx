"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PurchaseSuccess: React.FC = ({}) => {
  const searchParams = useSearchParams();
  const dataParam = searchParams?.get("data");

  const parsedData = dataParam
    ? JSON.parse(decodeURIComponent(dataParam))
    : null;
  const planName = parsedData?.plan?.name;
  const planInterval = parsedData?.plan?.interval;
  const transactionId = parsedData?.transactionId || "N/A";
  const purchaseDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const userEmail = parsedData?.email || "";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto py-8">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-4 md:p-8 border border-gray-700 my-4">
        <div className="flex justify-center mb-4">
          <div className="bg-cyan-500 rounded-full p-3 md:p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 md:h-12 md:w-12 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-300 text-center mb-4 md:mb-8">
          Thank you for subscribing to our premium service
        </p>

        <div className="bg-gray-700 rounded-lg p-4 md:p-6 mb-4 md:mb-8">
          <div className="mb-3 pb-3 border-b border-gray-600">
            <h2 className="text-lg md:text-xl font-bold mb-3">
              Subscription Details
            </h2>
            <div className="flex justify-between mb-1 md:mb-2">
              <span className="text-gray-300">Plan:</span>
              <span className="font-medium">{planName || "Premium Plan"}</span>
            </div>
            <div className="flex justify-between mb-1 md:mb-2">
              <span className="text-gray-300">Billing:</span>
              <span className="font-medium">
                {planInterval === "yearly" ? "Annual" : "Monthly"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Amount:</span>
              <span className="font-medium">
                ${parsedData?.plan?.offerPrice}/mo
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 md:mb-2">
              <span className="text-gray-300">Transaction ID:</span>
              <span className="font-medium">{transactionId}</span>
            </div>
            <div className="flex justify-between mb-1 md:mb-2">
              <span className="text-gray-300">Date:</span>
              <span className="font-medium">{purchaseDate}</span>
            </div>
            {userEmail && (
              <div className="flex justify-between">
                <span className="text-gray-300">Email:</span>
                <span className="font-medium">{userEmail}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-4 md:mb-6">
          <p className="text-cyan-400 font-medium mb-1 md:mb-2">
            What happens next?
          </p>
          <p className="text-gray-300 text-sm md:text-base">
            We have sent a confirmation email with your receipt and subscription
            details. Your premium features are now available in your account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard" className="flex-1">
            <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 md:py-3 px-4 md:px-6 rounded-md transition duration-300 hover:cursor-pointer">
              Go to Dashboard
            </button>
          </Link>
          <Link href="/help" className="flex-1">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-md border border-gray-600 transition duration-300 hover:cursor-pointer">
              Need Help?
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-4 md:mt-6 text-center">
        <p className="text-gray-400 text-xs md:text-sm">
          Having trouble? Contact our support team at{" "}
          <a
            href="mailto:support@example.com"
            className="text-cyan-400 hover:underline"
          >
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
