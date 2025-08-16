import BaseModal from "@/components/ui/modal/BaseModal";
import { IPlans } from "@/types/plans.types";
import React, { useCallback, useState } from "react";
import CreatePlan from "./createPlan";
import { Crown, Edit2, Power } from "lucide-react";
import Confirm from "@/components/ui/modal/ConfirmModal";
import Button from "@/components/ui/button/Button";

interface PlansListingProps {
  plans: IPlans[];
  onEdit: (planId: string, newData: Omit<IPlans, "_id">) => void;
  onToggleActive: (planId: string, isActive: boolean) => void;
}

const PlansListing: React.FC<PlansListingProps> = ({
  plans,
  onEdit,
  onToggleActive,
}) => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [initialPlan, setInitialPlan] = useState<any>();
  const [toggledPlan, setToggledPlan] = useState<any>(null);

  const updatePlan = async (newData: Omit<IPlans, "_id">) => {
    onEdit(selectedPlan, newData);
    setSelectedPlan("");
  };

  const handleOnConfirm = useCallback(() => {
    onToggleActive(toggledPlan._id, !toggledPlan.isActive);
    setToggledPlan(null);
  }, [onToggleActive, toggledPlan]);

  return (
    <div className="p-6">
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-purple-500/10 hover:translate-y-[-2px] transition-all duration-300"
            >
              <div
                className={`bg-gradient-to-r from-purple-700 to-purple-500 text-white p-4 relative`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="flex text-xl font-bold">
                    {plan.name}{" "}
                    {plan.isHighlighted && (
                      <Crown color="yellow" className="ml-2" />
                    )}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      plan.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="p-6 border-t-0 border-purple-600 bg-gray-900">
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <div className="text-white">
                      {plan.interval === "monthly" ? "Monthly" : "Yearly"}
                    </div>

                    <div className="text-3xl">
                      <span className="line-through text-gray-500">
                        {plan.orginalPrice}
                      </span>
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
                  <Button
                    variant="other"
                    onClick={() => {
                      setInitialPlan(plan);
                      setSelectedPlan(plan._id);
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:cursor-pointer"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="other"
                    onClick={() => {
                      setToggledPlan(plan);
                    }}
                    className={`flex-1 py-2 px-4 rounded flex items-center justify-center gap-2 hover:cursor-pointer ${
                      plan.isActive
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    <Power size={16} />
                    <span>{plan.isActive ? "Deactivate" : "Activate"}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      <Confirm
        isOpen={Boolean(toggledPlan?._id)}
        onConfirm={handleOnConfirm}
        onClose={() => setToggledPlan(null)}
      />
    </div>
  );
};

export default PlansListing;
