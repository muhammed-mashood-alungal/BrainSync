import { userInstances } from "@/axios/createInstance";
import { AxiosError } from "axios";

export const UserServices = {
  changeProfilePic: async (data: FormData, userId: string) => {
    try {
      const response = await userInstances.put(
        `/change-profile-photo/${userId}`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Change Profile Picture failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  getUserData: async (userId: string) => {
    try {
      const response = await userInstances.get(`/${userId}`);
      return response.data?.user;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Change Profile Picture failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  editUsername: async (userId: string, username: string) => {
    try {
      const response = await userInstances.put(`/edit-username/${userId}`, {
        username,
      });
      return response.data?.user;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Change Profile Picture failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  changePassword: async (userId: string, oldPass: string, newPass: string) => {
    try {
      const response = await userInstances.put(`/change-password/${userId}`, {
        oldPass,
        newPass,
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Change Profile Picture failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  searchUser: async (query: string) => {
    try {
      const response = await userInstances.get(`/search?query=${query}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Search User. Please try again.";
      throw new Error(errorMessage);
    }
  },
  deleteProfilePic: async (userId: string) => {
    try {
      const response = await userInstances.delete(
        `/delete-profile-photo/${userId}`
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Search User. Please try again.";
      throw new Error(errorMessage);
    }
  },
   getUserSessionGraph  : async (filterBy : string) : Promise<any[] | undefined>=>{
    try {
        const response = await userInstances.get(`/user-session-progress?filterBy=${filterBy}`)
        return response.data.graph
    } catch (error) {
        console.log(error)
    }
   },
   getUserOverallStats : async () : Promise<{totalGroups : number , totalTimeSpend : string , totalSessionsAttended : number} | undefined>=>{
    try {
      const response = await userInstances.get('/profile-stats')
      return response.data.stats
    } catch (error) {
      console.log(error)
    }
   }
};
