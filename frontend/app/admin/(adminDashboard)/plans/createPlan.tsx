import { IPlanError, IPlans } from "@/types/plans.types";
import { validatePlanForm } from "@/validations";
import React, { useState } from "react";

interface CreatePlanProps {
  initialPlan?: IPlans; // For editing existing plan
  onSubmit: (plan: Omit<IPlans, "_id">) => void;
  onCancel: () => void;
}

const CreatePlan: React.FC<CreatePlanProps> = ({
  initialPlan,
  onSubmit,
  onCancel,
}) => {
  const [plan, setPlan] = useState<Omit<IPlans, "_id">>({
    name: initialPlan?.name || "",
    orginalPrice: initialPlan?.orginalPrice || 0,
    offerPrice: initialPlan?.offerPrice || 0,
    interval: initialPlan?.interval || "monthly",
    features: initialPlan?.features || [],
    isActive: initialPlan?.isActive ?? true,
    isHighlighted: initialPlan?.isHighlighted ?? false,
  });
  const [planErr, setPlanErr] = useState<IPlanError>({
    name: "",
    orginalPrice: "",
    offerPrice: "",
    interval: "",
    features: [{ title: "", description: "" }],
    isActive: "",
    isHighlighted: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    console.log(name, value, type);
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setPlan({ ...plan, [name]: checked });
    } else if (name === "offerPrice" || name === "originalPrice") {
      const num = value === "" ? "" : parseInt(value, 10);
      setPlan({ ...plan, [name]: num });
    } else {
      setPlan({ ...plan, [name]: value });
    }
  };

  const addFeature = () => {
    setPlan({
      ...plan,
      features: [...plan.features, { title: "", description: "" }],
    });
  };

  const updateFeature = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedFeatures = [...plan.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value,
    };

    setPlan({
      ...plan,
      features: updatedFeatures,
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = plan.features.filter((_, i) => i !== index);
    setPlan({
      ...plan,
      features: updatedFeatures,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(plan)
    const { status, err } = validatePlanForm(plan);
    console.log(status , err)
    if (!status) {
      return setPlanErr(err);
    }
    onSubmit(plan);
  };

  return (
    <div className=" rounded-lg shadow-md p-6 max-w-2xl mx-auto h-[80vh] overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">
        {initialPlan ? "Edit Plan" : "Create New Plan"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Plan Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Plan Name
              </label>
              <input
                type="text"
                name="name"
                value={plan.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-red-600 ml-1"> {planErr?.name}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Orginal Price
              </label>
              <input
                type="number"
                name="orginalPrice"
                value={plan.orginalPrice}
                onChange={handleInputChange}
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-red-600 ml-1">
                {" "}
                {planErr?.orginalPrice}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Offer Price
              </label>
              <input
                type="number"
                name="offerPrice"
                value={plan.offerPrice}
                onChange={handleInputChange}
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-red-600 ml-1"> {planErr?.offerPrice}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-white  mb-1">
                Billing Interval
              </label>
              <select
                name="interval"
                value={plan.interval}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 bg-black rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <span className="text-red-600 ml-1"> {planErr?.interval}</span>
            </div>
          </div>

          {/* Plan Features */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-lg font-medium text-white">
                Features
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Feature
              </button>
            </div>

            <div className="space-y-4 h-[300px] w-full overflow-auto">
              {plan.features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-md "
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-medium text-cyan-500">
                      Feature {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) =>
                          updateFeature(index, "title", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <span className="text-red-600 ml-1">
                        {" "}
                        {planErr?.features[index]?.title}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white  mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={feature.description}
                        onChange={(e) =>
                          updateFeature(index, "description", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <span className="text-red-600 ml-1">
                        {" "}
                        {planErr?.features[index]?.description}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {plan.features.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No features added yet. Click the &quot;Add Feature&quot; button to add
                  one.
                </div>
              )}
            </div>
          </div>

          {/* Plan Settings */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={plan.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-white"
              >
                Active Plan
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isHighlighted"
                name="isHighlighted"
                checked={plan.isHighlighted}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isHighlighted"
                className="ml-2 block text-sm text-white"
              >
                Highlight this plan
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
            >
              {initialPlan ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePlan;
