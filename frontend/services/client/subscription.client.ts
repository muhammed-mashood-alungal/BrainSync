import { subscriptionInstances } from "@/axios/createInstance";
import { IUserSubscription } from "@/types/subscriptionTypes";
import { AxiosError } from "axios";

export const subscriptionServices = {
  buySubscription: async (
    subscriptionData: Partial<IUserSubscription>,
    planType : string
  ): Promise<void> => {
    try {
      const response = await subscriptionInstances.post("/buy", {
        subscriptionData,
        planType
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "buy Subscription failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  getAllSubscription: async (status : string , skip : number  , limit : number): Promise<{subscriptions  :IUserSubscription[] , count : number}> => {
    try {
      const response = await subscriptionInstances.get(`/all-subscriptions?status=${status}&skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Subscription fetching failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  getUserSubscription: async (): Promise<IUserSubscription[] | undefined> => {
    try {
      const response = await subscriptionInstances.get("/user-subscription");
      return response.data.subscribtions;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Subscription fetching failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  cancelSubscription : async (subscriptionId : string ) : Promise<void>=>{
    try {
        const response = await subscriptionInstances.put(`/cancel/${subscriptionId}`);
        return response.data;
      } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        const errorMessage =
          err.response?.data?.error ||
          "Subscription fetching failed. Please try again.";
        throw new Error(errorMessage);
      }
  }
};
