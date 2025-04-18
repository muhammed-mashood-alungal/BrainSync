import BaseModal from "@/Components/Modal/Modal";
import { IPlans } from "@/types/plans.types";
import React, { useState, useEffect } from "react";
import CreatePlan from "./createPlan";
import { Crown } from "lucide-react";

interface PlansListingProps {
  plans: IPlans[];
  onEdit: (planId: string , newData : Omit<IPlans, "_id">) => void;
  onToggleActive: (planId: string, isActive: boolean) => void;
}

const PlansListing: React.FC<PlansListingProps> = ({
  plans,
  onEdit,
  onToggleActive,
}) => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [initialPlan, setInitialPlan] = useState<any>();

  const updatePlan = async (newData: Omit<IPlans, "_id">) => {
    onEdit(selectedPlan, newData)
    setSelectedPlan('')
  };
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`rounded-lg shadow-md overflow-hidden `}
          >
            <div className="bg-purple-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="flex text-xl font-bold">{plan.name}  {plan.isHighlighted && <Crown color="yellow"/>}</h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    plan.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="p-6 border-3 rounded-b-2xl border-purple-600">
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <div className="text-white">
                    {plan.interval === "monthly" ? "Monthly" : "Yearly"}
                  </div>
                  
                  <div className="text-3xl ">
                  <span className="line-through text-gray-500">{plan.orginalPrice}</span>
                    <span className="font-bold"> ₹{plan.offerPrice}</span>
                    </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex flex-col">
                      <div className="bg-gray-800 rounded-md p-2 flex flex-col">
                        <span className="font-medium">
                          {index + 1} : {feature.title}
                        </span>
                        <span className="text-sm text-gray-300">
                          {feature.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setInitialPlan(plan);
                    setSelectedPlan(plan._id);
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    onToggleActive(plan._id as string, !plan.isActive)
                  }
                  className={`flex-1 py-2 px-4 rounded ${
                    plan.isActive
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {plan.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BaseModal
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan("")}
        title="Create a Plan"
      >
        <CreatePlan
          onCancel={() => console.log("cancelled")}
          onSubmit={updatePlan}
          initialPlan={initialPlan}
        />
      </BaseModal>
    </div>
  );
};

export default PlansListing;
