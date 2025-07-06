import { plansInstances } from "@/axios/instance.axios";
import { IPlans } from "@/types/plans.types";
import { AxiosError } from "axios";

export const plansServices = {
  createPlan: async (
    planData: Partial<IPlans>
  ): Promise<IPlans | undefined> => {
    try {
      const response = await plansInstances.post("/create", { planData });
      return response.data.newPlanData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Note Saving failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  getAllPlans: async (): Promise<IPlans[]> => {
    try {
      const response = await plansInstances.get("/all-plans");
      return response.data.plans;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Note Saving failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  getActivePlans: async (): Promise<IPlans[]> => {
    try {
      const response = await plansInstances.get("/active-plans");
      return response.data.plans;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Note Saving failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  toggleActive: async (planId: string): Promise<void> => {
    try {
      const response = await plansInstances.put(`/toggle-plan-state/${planId}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Note Saving failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  updatePlan: async (
    planId: string,
    newPlanData: Partial<IPlans>
  ): Promise<void> => {
    try {
      const response = await plansInstances.put(`/update/${planId}`, {
        newData: newPlanData,
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Note Saving failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
};
