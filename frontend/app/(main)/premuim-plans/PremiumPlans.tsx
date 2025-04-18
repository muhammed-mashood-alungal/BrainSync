import { IPlans } from '@/types/plans.types';
import React from 'react';

interface PremiumPlansProps {
  plans: IPlans[];
}

const PremiumPlans: React.FC<PremiumPlansProps> = ({ plans }) => {
  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Premium</h1>
          <p className="text-xl text-gray-300">Get started with a subscription that works for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan._id} 
              className={`rounded-lg p-8 ${
                plan.isHighlighted 
                  ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-gray-900' 
                  : 'bg-gray-800 border border-gray-700'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {plan.name} 
                    <span className="text-lg font-normal ml-2">
                      billed {plan.interval}
                      {plan.interval === 'yearly' ? ` (₹${plan.offerPrice * 12})` : ''}
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
                    Our <span className="font-bold">most popular</span> plan previously sold for ₹{plan.orginalPrice}/month and is now only ₹{plan.offerPrice}/month.
                  </p>
                  {/* <p className="font-medium">
                    This plan <span className="font-bold">saves you over 60%</span> in comparison to the monthly plan.
                  </p> */}
                </div>
              )}

              {!plan.isHighlighted && (
                <div className="mb-4">
                  <p className="mb-2">
                    Down from ₹{plan.orginalPrice}/month.
                  </p>
                  <p className="text-gray-300">
                    Our {plan.interval} plan grants access to <span className="font-bold">all premium features</span>, the best plan for 
                    {plan.interval === 'monthly' ? ' short-term subscribers.' : ' long-term subscribers.'}
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

              <button className={`w-full py-3 rounded-md font-bold ${
                plan.isHighlighted ? 'bg-gray-900 hover:bg-gray-800 text-cyan-400' : 'bg-black hover:bg-gray-900'
              }`}>
                Subscribe
              </button>

              {plan.features && plan.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold mb-2">Features:</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">✓</span>
                        <div>
                          <p className="font-medium">{feature.title}</p>
                          {feature.description && (
                            <p className="text-sm text-gray-300">{feature.description}</p>
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