'use client'
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IPlans } from '@/types/plans.types';
import { decodeAction } from 'next/dist/server/app-render/entry-base';

interface PurchaseSuccessProps {
  plan?: IPlans;
  transactionId?: string;
  purchaseDate?: string;
  userEmail?: string;
}

const PurchaseSuccess: React.FC<PurchaseSuccessProps> = ({ 
  plan, 
  transactionId = "TX-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
  purchaseDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  userEmail = ""
}) => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const dataParam = searchParams.get('data')

  const parsedData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : null
  // If no plan is passed, try to get info from query params
  const planName = parsedData?.plan?.name
  const planPrice = parsedData?.plan?.offerPrice
  const planInterval = parsedData?.plan?.interval

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="bg-cyan-500 rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">Payment Successful!</h1>
        <p className="text-gray-300 text-center mb-8">Thank you for subscribing to our premium service</p>
        
        <div className="bg-gray-700 rounded-lg p-6 mb-8">
          <div className="mb-4 pb-4 border-b border-gray-600">
            <h2 className="text-xl font-bold mb-4">Subscription Details</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Plan:</span>
              <span className="font-medium">{planName || 'Premium Plan'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Billing:</span>
              <span className="font-medium">{planInterval === 'yearly' ? 'Annual' : 'Monthly'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Amount:</span>
              <span className="font-medium">${parsedData?.plan?.offerPrice}/mo</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Transaction ID:</span>
              <span className="font-medium">{transactionId}</span>
            </div>
            <div className="flex justify-between mb-2">
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
        
        <div className="text-center mb-8">
          <p className="text-cyan-400 font-medium mb-2">What happens next?</p>
          <p className="text-gray-300">
            We've sent a confirmation email with your receipt and subscription details.
            Your premium features are now available in your account.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="flex-1">
            <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-6 rounded-md transition duration-300">
              Go to Dashboard
            </button>
          </Link>
          <Link href="/help" className="flex-1">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md border border-gray-600 transition duration-300">
              Need Help?
            </button>
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Having trouble? Contact our support team at <a href="mailto:support@example.com" className="text-cyan-400 hover:underline">support@example.com</a>
        </p>
      </div>
    </div>
  );
};

export default PurchaseSuccess